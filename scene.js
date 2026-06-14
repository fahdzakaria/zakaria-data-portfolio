// Interactive WebGL centerpiece — "The Machine that watches you".
// A surveillance eye / panopticon core: a dark tracked-globe housing that
// spins relentlessly, an amber-red pupil that follows the pointer (it sees
// you), a sweeping radar scan, and data particles harvested inward toward
// the core. Stays in the cappuccino palette (warm) with an ominous ember.
// Loaded as an ES module via import map (three.js from CDN). Fails silently
// if WebGL/three is unavailable; a CSS glow fallback remains.
import * as THREE from "three";

(function initEye() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return;
  }

  const getSize = () => {
    const r = canvas.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  };

  let { w, h } = getSize();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.z = 6;

  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // soft radial sprite texture for the pupil aura
  function radialTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,120,40,0.85)");
    g.addColorStop(0.35, "rgba(210,45,10,0.4)");
    g.addColorStop(1, "rgba(150,25,5,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  const eye = new THREE.Group();
  scene.add(eye);

  // ---- Dark lens housing (the machine body) ----
  const housing = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 48, 32),
    new THREE.MeshStandardMaterial({
      color: 0x1c130d,
      metalness: 0.45,
      roughness: 0.6,
      transparent: true,
      opacity: 0.96,
      side: THREE.FrontSide,
    })
  );
  eye.add(housing);

  // ---- Tracked-globe grid (spins forever) ----
  const grid = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(1.93, 24, 16)),
    new THREE.LineBasicMaterial({ color: 0xb5651d, transparent: true, opacity: 0.22 })
  );
  eye.add(grid);

  // latitude scan rings (camera lens look)
  const lensRings = new THREE.Group();
  eye.add(lensRings);
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.0 - i * 0.16, 0.01, 6, 110),
      new THREE.MeshBasicMaterial({ color: 0xcd8d4d, transparent: true, opacity: 0.32 })
    );
    ring.rotation.x = Math.PI / 2 + (i - 1) * 0.18;
    lensRings.add(ring);
  }

  // ---- The iris + pupil (sits on the front face, tracks pointer) ----
  const iris = new THREE.Group();
  iris.position.z = 1.74; // just proud of the housing front pole (r=1.7)
  eye.add(iris);

  // concentric iris rings
  for (let i = 0; i < 5; i++) {
    const r = 0.26 + i * 0.18;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.02, 8, 80),
      new THREE.MeshBasicMaterial({
        color: i % 2 ? 0xcd8d4d : 0xb5651d,
        transparent: true,
        opacity: 0.7 - i * 0.09,
      })
    );
    iris.add(ring);
  }

  // glowing pupil — the relentless ember
  const pupil = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0x180400,
      emissive: 0xff3208,
      emissiveIntensity: 3.0,
      roughness: 0.3,
      metalness: 0.1,
    })
  );
  pupil.position.z = 0.14;
  iris.add(pupil);

  // pupil aura
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture(),
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
  );
  halo.scale.set(1.5, 1.5, 1);
  halo.position.z = 0.22;
  iris.add(halo);

  // the eye casts its own ominous light
  const pupilLight = new THREE.PointLight(0xff5a1f, 24, 14);
  pupilLight.position.set(0, 0, 0.4);
  iris.add(pupilLight);

  // ---- Sweeping radar scan ----
  const scan = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.016, 6, 90, Math.PI * 0.55),
    new THREE.MeshBasicMaterial({ color: 0xffc98f, transparent: true, opacity: 0.55 })
  );
  scan.rotation.x = Math.PI / 2;
  eye.add(scan);

  // ---- Harvested data particles (stream inward, then respawn) ----
  const COUNT = 300;
  const positions = new Float32Array(COUNT * 3);
  const speeds = new Float32Array(COUNT);
  function seed(i, outer) {
    const r = outer ? 3.2 + Math.random() * 3.5 : 2.0 + Math.random() * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    speeds[i] = 0.004 + Math.random() * 0.01;
  }
  for (let i = 0; i < COUNT; i++) seed(i, false);
  const dataGeo = new THREE.BufferGeometry();
  dataGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const dataField = new THREE.Points(
    dataGeo,
    new THREE.PointsMaterial({ color: 0x8c6a44, size: 0.045, transparent: true, opacity: 0.7 })
  );
  scene.add(dataField);

  // ---- Lights kept dim: the pupil is the main light source (ominous) ----
  scene.add(new THREE.AmbientLight(0xb98a55, 0.22));
  const key = new THREE.PointLight(0xffe6c2, 9, 40);
  key.position.set(3, 4, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0x6e7e83, 16, 40);
  rim.position.set(-5, -2, 1);
  scene.add(rim);

  // ---- Pointer tracking (the eye follows you) ----
  const target = { x: 0, y: 0 };
  if (!reduce) {
    window.addEventListener("mousemove", (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    const s = reduce ? 0 : 1;

    // eye orients toward the pointer — it watches you
    const ty = target.x * 0.7;
    const tx = target.y * 0.55;
    eye.rotation.y += (ty - eye.rotation.y) * 0.06;
    eye.rotation.x += (tx - eye.rotation.x) * 0.06;

    // globe grid spins relentlessly under the tracking
    grid.rotation.y += 0.0035 * s;
    grid.rotation.x = 0.18;
    lensRings.rotation.y -= 0.002 * s;

    // radar sweep
    scan.rotation.z += 0.012 * s;
    scan.rotation.y += 0.02 * s;

    // pupil breathes — the machine is alive and never stops
    const pulse = 1 + Math.sin(t * 2.0) * 0.12 * s;
    pupil.scale.setScalar(pulse);
    pupil.material.emissiveIntensity = 2.2 + Math.sin(t * 2.0) * 0.9 * s;
    halo.scale.setScalar(1.5 * pulse);
    halo.material.opacity = (0.55 + Math.sin(t * 2.0) * 0.18) * (reduce ? 0.7 : 1);
    pupilLight.intensity = 22 + Math.sin(t * 2.0) * 10 * s;

    // harvest data inward
    if (!reduce) {
      const pos = dataGeo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        const x = pos[ix], y = pos[ix + 1], z = pos[ix + 2];
        const d = Math.sqrt(x * x + y * y + z * z) || 1;
        const f = speeds[i] * (1 + 1.5 / d);
        pos[ix] = x - x * f;
        pos[ix + 1] = y - y * f;
        pos[ix + 2] = z - z * f;
        if (d < 1.5) seed(i, true);
      }
      dataGeo.attributes.position.needsUpdate = true;
      dataField.rotation.y = t * 0.03;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  const onResize = () => {
    const size = getSize();
    w = size.w; h = size.h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener("resize", onResize);
  setTimeout(onResize, 300);
})();
