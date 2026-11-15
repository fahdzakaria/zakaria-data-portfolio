# Portfolio — Zakaria Fahd

Portfolio de data engineer (V5), site statique HTML / CSS / JS déployé sur Vercel.

Même système de design que [Immo Insights N°06](https://immo-insights-06.vercel.app) : noir pur, un seul
accent ambre, polices Poppins / Inter / Geist Mono (logo en Instrument Serif), fond du hero en verre
cannelé WebGL, aucun visuel décoratif (chaque image vient d'un vrai projet).

## Pages

- `index.html` : accueil, chiffres, projets, expériences, compétences, formation, contact
- `projects/immo-insights.html` : étude de cas Immo Insights N°06
- `projects/ecart-be.html` : étude de cas Écart BE (comparateur Excel assisté par IA)
- `projects/crypto.html` : étude de cas suivi des prix crypto
- `projects/immo.html` : étude de cas IMMO ETL (projet antérieur)

## Fichiers

- `styles.css` : système de design partagé
- `app.js` : menu mobile, apparition au défilement, onglets, formulaire (FormSubmit)
- `scene.js` : shader WebGL du hero (repli CSS, figé si mouvement réduit)
- `tools/carte_littoral.py` : régénère `assets/carte-littoral.svg` à partir des données publiées par Immo Insights

## Lancer en local

```bash
cd "/Users/zakariafahd/Documents/projet cv /portfolio"
python3 -m http.server 8081
```

Puis ouvrir `http://localhost:8081`.
