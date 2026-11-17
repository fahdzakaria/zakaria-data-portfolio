/* =========================================================================
   Roi d'échecs 3D du haut de page (colonne .hero-visuel)
   Noir laqué, finitions mélangées (laqué, satiné, brossé, moleté),
   croix pattée sertie d'émeraudes. three.js chargé à la demande.
   Repli : sans WebGL, la colonne reste vide (rien ne casse).
   ========================================================================= */

const hote = document.querySelector(".hero-visuel[data-roi]");
const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hote) {
  // Ne charge three.js qu'une fois le visuel visible et le navigateur au repos :
  // le texte du haut de page s'affiche d'abord.
  const auRepos = window.requestIdleCallback
    ? (f) => requestIdleCallback(f, { timeout: 1500 })
    : (f) => setTimeout(f, 200);
  const obs = new IntersectionObserver((entrees) => {
    if (!entrees[0].isIntersecting) return;
    obs.disconnect();
    auRepos(() => demarrer().catch(() => {}));
  });
  obs.observe(hote);
}

async function demarrer() {
  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  } catch (e) {
    return;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const toile = renderer.domElement;
  toile.setAttribute("aria-hidden", "true");
  hote.appendChild(toile);

  const leger = matchMedia("(max-width: 960px), (pointer: coarse)").matches;
  const SEGS = leger ? 160 : 240;

  const scene = new THREE.Scene();
  const FOV = 28;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

  /* ---------- environnement et lumières : studio très sombre ---------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const cle = new THREE.DirectionalLight(0xf4f6ff, 1.1);
  cle.position.set(0.5, 9, 4);
  const contourFroid = new THREE.DirectionalLight(0xe8eeff, 5.5);
  contourFroid.position.set(-6, 3, -5);
  const contourVert = new THREE.DirectionalLight(0xa8e06a, 4.2); // --accent
  contourVert.position.set(6, 2, -5);
  scene.add(cle, contourFroid, contourVert);

  /* ---------- textures générées (aucun fichier à télécharger) ---------- */
  const texture = (taille, dessin, rx = 1, ry = 1) => {
    const c = document.createElement("canvas");
    c.width = c.height = taille;
    dessin(c.getContext("2d"), taille);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return t;
  };
  const grain = texture(256, (g, n) => {
    const im = g.createImageData(n, n);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 70;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
      im.data[i + 3] = 255;
    }
    g.putImageData(im, 0, 0);
  });
  // stries fines qui font le tour de la pièce (u = tour, v = hauteur)
  const brossage = texture(512, (g, n) => {
    for (let y = 0; y < n; y++) {
      const v = 105 + Math.random() * 55 + (Math.random() < 0.04 ? 60 : 0);
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(0, y, n, 1);
    }
  }, 1, 6);
  // quadrillage en diagonale
  const moletage = texture(256, (g, n) => {
    g.fillStyle = "#808080";
    g.fillRect(0, 0, n, n);
    g.strokeStyle = "#f0f0f0";
    g.lineWidth = 3;
    for (let i = -n; i < 2 * n; i += 16) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i + n, n); g.stroke();
      g.beginPath(); g.moveTo(i, n); g.lineTo(i + n, 0); g.stroke();
    }
  }, 10, 14);

  /* ---------- matières ---------- */
  const laque = new THREE.MeshPhysicalMaterial({
    color: 0x070707, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04,
    bumpMap: grain, bumpScale: 0.08, envMapIntensity: 0.9,
  });
  const satine = new THREE.MeshPhysicalMaterial({
    color: 0x0b0b0b, roughness: 0.68, roughnessMap: grain, bumpMap: grain, bumpScale: 0.6,
    metalness: 0, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 0.35,
  });
  const brosse = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a1a, metalness: 0.85, roughness: 0.38, roughnessMap: brossage,
    bumpMap: brossage, bumpScale: 0.25, anisotropy: 0.9, envMapIntensity: 1.1,
  });
  const molete = new THREE.MeshPhysicalMaterial({
    color: 0x0d0d0d, metalness: 0.5, roughness: 0.45, bumpMap: moletage, bumpScale: 1.4,
    clearcoat: 0.6, clearcoatRoughness: 0.3, envMapIntensity: 0.8,
  });
  const emeraude = new THREE.MeshPhysicalMaterial({
    color: 0x0a7a3a, emissive: 0x05401d, emissiveIntensity: 0.55, roughness: 0.03,
    metalness: 0, clearcoat: 1, clearcoatRoughness: 0.01, ior: 1.58, envMapIntensity: 2.4,
  });
  const LAQUE = 0, SATINE = 1, BROSSE = 2, MOLETE = 3;
  const MATS = [laque, satine, brosse, molete];

  /* ---------- tour : profil de révolution + cannelures + créneaux ---------- */
  const NFLUTES = 20, PROF_FLUTE = 0.05, NMERLONS = 8, ENCOCHE = 0.16;
  const lisse = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  function tourner(rangs) {
    const nr = rangs.length, W1 = SEGS + 1;
    const pos = new Float32Array(nr * W1 * 3);
    const uv = new Float32Array(nr * W1 * 2);
    rangs.forEach((p, i) => {
      for (let j = 0; j <= SEGS; j++) {
        const th = (j / SEGS) * Math.PI * 2;
        let r = p.r, y = p.y;
        if (p.w) r -= p.w * PROF_FLUTE * (1 - Math.pow(Math.abs(Math.sin((NFLUTES * th) / 2)), 1.5));
        if (p.t) {
          const ph = ((th * NMERLONS) / (Math.PI * 2)) % 1;
          y -= ENCOCHE * (1 - lisse(0.06, 0.14, ph) * (1 - lisse(0.46, 0.54, ph)));
        }
        const k = i * W1 + j;
        pos[k * 3] = r * Math.sin(th);
        pos[k * 3 + 1] = y;
        pos[k * 3 + 2] = r * Math.cos(th);
        uv[k * 2] = (j / SEGS) * 6;
        uv[k * 2 + 1] = p.y;
      }
    });
    const idx = [];
    for (let i = 0; i < nr - 1; i++)
      for (let j = 0; j < SEGS; j++) {
        const a = i * W1 + j, b = a + 1, c = a + W1, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    g.setIndex(idx);
    // une finition par bande du profil
    let debut = 0;
    for (let i = 1; i <= nr - 1; i++) {
      if (i === nr - 1 || rangs[i].m !== rangs[debut].m) {
        g.addGroup(debut * SEGS * 6, (i - debut) * SEGS * 6, rangs[debut].m);
        debut = i;
      }
    }
    g.computeVertexNormals();
    // couture : mêmes normales des deux côtés du raccord
    const n = g.attributes.normal;
    for (let i = 0; i < nr; i++) {
      const a = i * W1, b = a + SEGS;
      const x = n.getX(a) + n.getX(b), y = n.getY(a) + n.getY(b), z = n.getZ(a) + n.getZ(b);
      const l = Math.hypot(x, y, z) || 1;
      n.setXYZ(a, x / l, y / l, z / l);
      n.setXYZ(b, x / l, y / l, z / l);
    }
    return g;
  }

  // Petit langage de profil : L = arête vive (point doublé), S = point lisse.
  let rangs = [], M = LAQUE;
  const L = (r, y, w = 0) => { rangs.push({ r, y, w, m: M }, { r, y, w, m: M }); };
  const S = (r, y, w = 0, t = 0) => { rangs.push({ r, y, w, t, m: M }); };
  const arc = (cr, cy, rad, a0, a1, n) => {
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
      S(cr + rad * Math.cos(a), cy + rad * Math.sin(a));
    }
  };
  const courbe = (r0, y0, rc, yc, r1, y1, n) => {
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      S(u * u * r0 + 2 * u * t * rc + t * t * r1, u * u * y0 + 2 * u * t * yc + t * t * y1);
    }
  };
  const rayonFut = (y) => 0.6 - (y - 0.92) * 0.135;
  const fut = (y0, y1, n) => {
    for (let i = 0; i <= n; i++) {
      const y = y0 + ((y1 - y0) * i) / n;
      S(rayonFut(y), y, lisse(1.0, 1.18, y) * (1 - lisse(2.18, 2.34, y)));
    }
  };

  // corps
  M = LAQUE; S(0.001, 0);
  L(1.16, 0); M = MOLETE; L(1.16, 0.09); M = LAQUE; L(1.1, 0.12); L(1.1, 0.15);       // plinthe
  L(0.98, 0.17); L(0.98, 0.2);                                                         // gorge
  M = BROSSE; arc(0.94, 0.3, 0.11, -90, 90, 14);                                       // gros tore
  M = LAQUE; L(0.9, 0.41); L(0.9, 0.43); L(0.99, 0.43); L(0.99, 0.455); L(0.88, 0.47); // filets
  M = SATINE; courbe(0.88, 0.47, 0.62, 0.55, 0.62, 0.92, 20);                          // congé vers le fût
  fut(0.92, 1.56, 36);                                                                 // fût cannelé (bas)
  M = BROSSE; L(rayonFut(1.56) - 0.01, 1.58); L(0.6, 1.6); arc(0.58, 1.69, 0.09, -30, 30, 6); // bague
  L(0.67, 1.69); L(0.6, 1.78); M = SATINE; L(rayonFut(1.8) - 0.01, 1.8);
  fut(1.8, 2.42, 34);                                                                  // fût cannelé (haut)
  M = LAQUE; L(0.43, 2.48); L(0.64, 2.5); M = MOLETE; L(0.74, 2.54); M = LAQUE; L(0.74, 2.62); L(0.64, 2.66); // collerette 1
  M = BROSSE; L(0.5, 2.68); L(0.5, 2.74); L(0.56, 2.76); L(0.56, 2.78);                // renflement
  M = LAQUE; L(0.68, 2.82); L(0.8, 2.86); M = MOLETE; L(0.8, 2.95); M = LAQUE; L(0.68, 2.99); // collerette 2
  M = SATINE; courbe(0.5, 3.0, 0.5, 3.3, 0.8, 3.52, 16);                               // tête évasée
  M = BROSSE; L(0.92, 3.55); L(0.92, 3.63); M = LAQUE; L(0.82, 3.67); L(0.82, 3.7); L(0.001, 3.7); // rebord
  const corps = new THREE.Mesh(tourner(rangs), MATS);

  // couronne crénelée
  rangs = [];
  M = BROSSE; L(0.74, 3.7); L(0.74, 3.82); M = LAQUE; L(0.7, 3.88);
  S(0.7, 4.08, 0, 1); S(0.7, 4.08, 0, 1);
  S(0.5, 4.08, 0, 1); S(0.5, 4.08, 0, 1);
  S(0.5, 3.84); S(0.5, 3.84);
  S(0.001, 3.84);
  const couronne = new THREE.Mesh(tourner(rangs), MATS);

  // boule sous la croix, même laque que la croix
  const boule = new THREE.Mesh(new THREE.SphereGeometry(0.22, 48, 24), laque);
  boule.position.y = 4.12;

  /* ---------- croix pattée chanfreinée ---------- */
  const contour = [
    [-0.14, 0.62], [0.14, 0.62], [0.085, 0.46], [0.085, 0.335], [0.24, 0.335], [0.38, 0.39],
    [0.38, 0.11], [0.24, 0.165], [0.085, 0.165], [0.085, -0.26], [0.14, -0.4], [-0.14, -0.4],
    [-0.085, -0.26], [-0.085, 0.165], [-0.24, 0.165], [-0.38, 0.11], [-0.38, 0.39],
    [-0.24, 0.335], [-0.085, 0.335], [-0.085, 0.46],
  ];
  const gCroix = new THREE.ExtrudeGeometry(
    new THREE.Shape(contour.map(([x, y]) => new THREE.Vector2(x, y - 0.25))),
    { depth: 0.16, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 2, curveSegments: 4 }
  );
  gCroix.translate(0, 0, -0.08);
  const croix = new THREE.Mesh(gCroix, laque);
  croix.position.y = 4.74;

  // émeraudes en cabochon dans une monture brossée, sur les deux faces
  const gPierre = new THREE.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  gPierre.rotateX(Math.PI / 2);
  gPierre.scale(1, 1, 0.55);
  const gMonture = new THREE.TorusGeometry(1.06, 0.13, 16, 48);
  const sertis = [
    [0, 0, 0.075],
    [0.27, 0, 0.045], [-0.27, 0, 0.045],
    [0, 0.25, 0.045], [0, -0.3, 0.045],
  ];
  for (const face of [1, -1]) {
    for (const [x, y, r] of sertis) {
      const serti = new THREE.Group();
      serti.add(new THREE.Mesh(gPierre, emeraude), new THREE.Mesh(gMonture, brosse));
      serti.scale.setScalar(r);
      serti.position.set(x, y, face * 0.104);
      if (face < 0) serti.rotation.y = Math.PI;
      croix.add(serti);
    }
  }

  const roi = new THREE.Group();
  roi.add(corps, couronne, boule, croix);
  roi.position.y = -2.68; // centre vertical (hauteur ~5,4)

  /* ---------- ombre de contact ---------- */
  const ombreTex = texture(128, (g, n) => {
    const d = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
    d.addColorStop(0, "rgba(0,0,0,0.6)");
    d.addColorStop(0.5, "rgba(0,0,0,0.25)");
    d.addColorStop(0.95, "rgba(0,0,0,0)");
    d.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = d;
    g.fillRect(0, 0, n, n);
  });
  const ombre = new THREE.Mesh(
    // assez petite pour ne jamais toucher les bords du cadre (sinon on voit un rectangle sombre)
    new THREE.PlaneGeometry(2.6, 2.6),
    new THREE.MeshBasicMaterial({ map: ombreTex, transparent: true, depthWrite: false })
  );
  ombre.rotation.x = -Math.PI / 2;
  ombre.position.y = -2.69;

  const pivot = new THREE.Group();
  pivot.add(roi);
  const socle = new THREE.Group();
  socle.rotation.x = 0.1; // légèrement penché vers la caméra
  socle.add(pivot, ombre);
  scene.add(socle);

  /* ---------- cadrage ---------- */
  function cadrer() {
    const r = hote.getBoundingClientRect();
    const W = Math.max(1, r.width), H = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, leger ? 1.5 : 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const t = Math.tan((FOV * Math.PI) / 360);
    // marge sous le socle pour que l'ombre ne soit jamais coupée par le bas du cadre
    const d = Math.max(6.8 / (2 * t), 3.0 / (2 * t * camera.aspect));
    camera.position.set(0, 1.1, d);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    rendre();
  }

  /* ---------- rotation : lente en continu, glisser avec inertie ---------- */
  const AUTO = reduit ? 0 : (Math.PI * 2) / 25; // un tour en 25 s
  let angle = 0.6, vitesse = AUTO, glisse = false, dernierX = 0, dernierT = 0, temps = 0;
  let doigt = null; // seul le pointeur principal fait tourner le roi

  hote.addEventListener("pointerdown", (e) => {
    if (!e.isPrimary || e.button > 0) return;
    doigt = e.pointerId;
    glisse = true;
    dernierX = e.clientX;
    dernierT = performance.now();
    hote.classList.add("glisse");
    hote.setPointerCapture(e.pointerId);
    relancer();
  });
  hote.addEventListener("pointermove", (e) => {
    if (!glisse || e.pointerId !== doigt) return;
    const now = performance.now();
    const dx = e.clientX - dernierX;
    const dts = Math.max(0.008, (now - dernierT) / 1000);
    angle += dx * 0.009;
    vitesse = Math.max(-8, Math.min(8, (dx * 0.009) / dts));
    dernierX = e.clientX;
    dernierT = now;
  });
  const lacher = (e) => {
    if (!glisse || e.pointerId !== doigt) return;
    glisse = false;
    doigt = null;
    // tenu immobile avant de lâcher : pas d'élan
    if (performance.now() - dernierT > 80) vitesse = 0;
    hote.classList.remove("glisse");
  };
  hote.addEventListener("pointerup", lacher);
  hote.addEventListener("pointercancel", lacher);
  hote.addEventListener("lostpointercapture", lacher);

  function rendre() {
    pivot.rotation.y = angle;
    socle.rotation.z = reduit ? 0 : Math.sin(temps * 0.6) * 0.03;
    renderer.render(scene, camera);
  }

  let enCours = false, visible = true, onglet = !document.hidden, dernier = 0;
  function boucle(now) {
    const dt = Math.min(0.05, Math.max(0, (now - dernier) / 1000)) || 0.016;
    dernier = now;
    temps += dt;
    if (!glisse) {
      vitesse += (AUTO - vitesse) * (1 - Math.exp(-dt * 1.2));
      angle += vitesse * dt;
    }
    rendre();
    // en mouvement réduit, la boucle s'arrête dès que l'inertie est retombée
    const auRepos = reduit && !glisse && Math.abs(vitesse) < 0.002;
    if (visible && onglet && !auRepos) requestAnimationFrame(boucle);
    else enCours = false;
  }
  function relancer() {
    if (enCours || !(visible && onglet)) return;
    enCours = true;
    dernier = performance.now();
    requestAnimationFrame(boucle);
  }

  new IntersectionObserver((e) => { visible = e[0].isIntersecting; relancer(); }).observe(hote);
  document.addEventListener("visibilitychange", () => { onglet = !document.hidden; relancer(); });
  new ResizeObserver(cadrer).observe(hote);

  cadrer();
  hote.classList.add("pret"); // fondu d'apparition
  relancer();
}
