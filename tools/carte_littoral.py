"""Génère assets/carte-littoral.svg : les communes du littoral azuréen colorées
par leur prix médian au m² (appartements, 24 mois), avec les données publiées
par Immo Insights N°06 — même rampe de couleurs et mêmes seuils que le site.

Usage : python3 tools/carte_littoral.py [chemin/vers/immo-data-platform/frontend/public]
"""

import json
import math
import sys
from pathlib import Path

PUBLIC = Path(sys.argv[1] if len(sys.argv) > 1 else Path.home() / "Documents/immo-data-platform/frontend/public")
SORTIE = Path(__file__).resolve().parent.parent / "assets/carte-littoral.svg"

PALETTE = ["#2a1a0c", "#43260e", "#653410", "#8f4a12", "#bd6614", "#e88a1a", "#ffb547"]
ETEINT = "#141414"
SEUIL_VENTES = 5
BOITE = ((6.86, 43.5), (7.54, 43.84))  # même cadrage que l'aperçu du site
W, H = 640, 420


def lignes(nom):
    d = json.loads((PUBLIC / "data" / nom).read_text())
    return [dict(zip(d["colonnes"], r)) for r in d["lignes"]]


def quantiles(vals, n):
    tri = sorted(vals)
    return [tri[math.floor((i + 1) / (n + 1) * (len(tri) - 1))] for i in range(n)]


def couleur(v, seuils):
    if v is None:
        return ETEINT
    i = 0
    while i < len(seuils) and v >= seuils[i]:
        i += 1
    return PALETTE[min(i, len(PALETTE) - 1)]


communes = {r["code_commune"]: r for r in lignes("mart_prix_m2_par_commune.json") if r["type_bien"] == "appartement"}
quartiers = [r for r in lignes("mart_prix_m2_par_quartier.json") if r["type_bien"] == "appartement"]
valeurs = [c["prix_m2_median"] for c in communes.values() if (c["nb_ventes_24m"] or 0) >= SEUIL_VENTES and c["prix_m2_median"]]
valeurs += [q["prix_m2_median"] for q in quartiers if q["prix_m2_median"]]
seuils = sorted(set(quantiles(valeurs, len(PALETTE) - 1)))

(x0, y0), (x1, y1) = BOITE
k = math.cos(math.radians((y0 + y1) / 2))
s = min(W / ((x1 - x0) * k), H / (y1 - y0))
ox, oy = (W - (x1 - x0) * k * s) / 2, (H - (y1 - y0) * s) / 2


def proj(p):
    return ox + (p[0] - x0) * k * s, oy + (y1 - p[1]) * s


def chemin(geom):
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    d = []
    for poly in polys:
        for anneau in poly:
            pts = [proj(p) for p in anneau]
            d.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z")
    return "".join(d)


geo = json.loads((PUBLIC / "geo" / "communes-06.geojson").read_text())
formes = []
def touche_le_cadre(geom):
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    return any(x0 <= p[0] <= x1 and y0 <= p[1] <= y1 for poly in polys for anneau in poly for p in anneau)


for f in geo["features"]:
    if not touche_le_cadre(f["geometry"]):
        continue  # hors du cadre affiché : inutile dans le fichier
    c = communes.get(f["properties"]["code"])
    prix = c["prix_m2_median"] if c and (c["nb_ventes_24m"] or 0) >= SEUIL_VENTES else None
    formes.append(f'<path d="{chemin(f["geometry"])}" fill="{couleur(prix, seuils)}"/>')

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" '
    f'aria-label="Prix médian au m² des appartements par commune, littoral des Alpes-Maritimes">'
    f'<rect width="{W}" height="{H}" fill="#0b0d10"/>'
    f'<g stroke="#000" stroke-width=".6">{"".join(formes)}</g></svg>'
)
SORTIE.write_text(svg)
print(f"{SORTIE} : {len(formes)} communes, {len(svg) // 1024} Ko, seuils {[round(v) for v in seuils]}")
