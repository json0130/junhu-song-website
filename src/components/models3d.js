import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { PALETTE } from '../data/palette';

// Procedural 3D products for the Home stage: over-ear headphones, a turntable (LP player) and a
// Marshall-style amp speaker. Each builder returns
//   { root, width, height, hot, follow, update(ctx), recolour(colors) }
// World units are arbitrary (≈ 10 cm); the stage fits the camera to whichever model is showing.

export const readVar = (name, fallback) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

export const readColors = () => ({
  body:   readVar('--hp-body',   '#2a7abf'),
  accent: readVar('--hp-accent', '#4FA8FF'),
  dark:   readVar('--hp-dark',   '#14171d'),
  metal:  readVar('--hp-metal',  '#c9d1dc'),
});

const DEFAULT_DISC = ['#1a1a2e', '#16213e', '#0f3460'];
const TAU = Math.PI * 2;

// ── Procedural textures ────────────────────────────────────────
const canvasOf = (w, h = w) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

function toTexture(canvas, { repeat, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}

// Fine random grain — leather, vinyl-covered cabinet, foam
function noiseTexture(size, repeat, lo = 100, hi = 200) {
  const c = canvasOf(size);
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = lo + Math.random() * (hi - lo);
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return toTexture(c, { repeat, srgb: false });
}

// Radially brushed metal for round plates
function brushedTexture() {
  const S = 512, R = S / 2;
  const c = canvasOf(S);
  const g = c.getContext('2d');
  g.fillStyle = '#dcdcdc';
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 900; i++) {
    const a = Math.random() * TAU;
    g.strokeStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.10)';
    g.lineWidth = 0.6 + Math.random();
    g.beginPath();
    g.moveTo(R + Math.cos(a) * R * 0.1, R + Math.sin(a) * R * 0.1);
    g.lineTo(R + Math.cos(a) * R, R + Math.sin(a) * R);
    g.stroke();
  }
  for (let r = R * 0.2; r < R; r += 14) {
    g.strokeStyle = 'rgba(0,0,0,0.07)';
    g.lineWidth = 1;
    g.beginPath(); g.arc(R, R, r, 0, TAU); g.stroke();
  }
  return toTexture(c);
}

// Walnut veneer
function woodTexture() {
  const c = canvasOf(512, 256);
  const g = c.getContext('2d');
  const base = g.createLinearGradient(0, 0, 0, 256);
  base.addColorStop(0, '#6a4326');
  base.addColorStop(1, '#4d2f19');
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 260; i++) {
    const y = Math.random() * 256;
    g.strokeStyle = Math.random() < 0.55 ? `rgba(30,15,5,${0.05 + Math.random() * 0.18})` : `rgba(210,150,90,${0.04 + Math.random() * 0.1})`;
    g.lineWidth = 0.5 + Math.random() * 2.2;
    g.beginPath();
    g.moveTo(0, y);
    const amp = 2 + Math.random() * 6, ph = Math.random() * TAU;
    for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x / 90 + ph) * amp);
    g.stroke();
  }
  return toTexture(c);
}

// Woven speaker cloth
function clothTexture() {
  const c = canvasOf(128);
  const g = c.getContext('2d');
  g.fillStyle = '#17120d';
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 128; i += 4) {
    g.fillStyle = 'rgba(214,176,98,0.16)';
    g.fillRect(i, 0, 1.6, 128);
    g.fillStyle = 'rgba(0,0,0,0.35)';
    g.fillRect(0, i + 2, 128, 1.6);
  }
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(230,190,110,${Math.random() * 0.22})`;
    g.fillRect(Math.random() * 128, Math.random() * 128, 1.5, 1.5);
  }
  return toTexture(c, { repeat: [14, 8] });
}

function makeBadgeTexture(text, bg, fg) {
  const c = canvasOf(256);
  const g = c.getContext('2d');
  g.fillStyle = bg;
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = fg;
  g.font = '800 120px "Syne", "Arial Black", sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, 128, 138);
  return toTexture(c);
}

// "Junhu" in script, white on transparent — the amp's badge
function drawScript(canvas) {
  const g = canvas.getContext('2d');
  g.clearRect(0, 0, canvas.width, canvas.height);
  g.fillStyle = '#f5f1e6';
  g.font = '700 118px "Caveat", "Segoe Script", cursive';
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText('Junhu', 14, 66);
  g.strokeStyle = '#f5f1e6';
  g.lineWidth = 5;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(20, 122); g.bezierCurveTo(120, 106, 240, 132, 330, 114);
  g.stroke();
}

// Record grooves: dark vinyl, concentric rings and a few lighter "track gap" bands
function drawVinyl(canvas) {
  const S = canvas.width, R = S / 2;
  const g = canvas.getContext('2d');
  g.fillStyle = '#0a0a0d';
  g.fillRect(0, 0, S, S);
  for (let r = R * 0.34; r < R * 0.985; r += 2.4) {
    g.strokeStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.05})`;
    g.lineWidth = 1;
    g.beginPath(); g.arc(R, R, r, 0, TAU); g.stroke();
  }
  [0.52, 0.66, 0.79, 0.9].forEach((k) => {
    g.strokeStyle = 'rgba(255,255,255,0.12)';
    g.lineWidth = 2.5;
    g.beginPath(); g.arc(R, R, R * k, 0, TAU); g.stroke();
  });
  g.strokeStyle = 'rgba(255,255,255,0.1)';
  g.lineWidth = 3;
  g.beginPath(); g.arc(R, R, R * 0.985, 0, TAU); g.stroke();
}

function drawLabel(canvas, colors) {
  const S = canvas.width, R = S / 2;
  const g = canvas.getContext('2d');
  const grad = g.createRadialGradient(R, R, R * 0.1, R, R, R);
  grad.addColorStop(0, colors[2]);
  grad.addColorStop(1, colors[1]);
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 3;
  g.beginPath(); g.arc(R, R, R * 0.9, 0, TAU); g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.92)';
  g.font = `800 ${S * 0.15}px "Syne", "Arial Black", sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('JS', R, R - S * 0.14);
  g.font = `600 ${S * 0.065}px "IBM Plex Mono", monospace`;
  g.fillText('SIDE A · 33⅓', R, R + S * 0.17);
  g.fillStyle = 'rgba(0,0,0,0.85)';
  g.beginPath(); g.arc(R, R, R * 0.07, 0, TAU); g.fill();       // spindle hole
}

// A soft light-catching band that stays put while the record turns under it
function sheenTexture() {
  const S = 256, R = S / 2;
  const c = canvasOf(S);
  const g = c.getContext('2d');
  [0.6, 0.6 + Math.PI].forEach((a0) => {
    const grad = g.createRadialGradient(R, R, R * 0.2, R, R, R);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(255,255,255,0.5)');
    g.fillStyle = grad;
    g.beginPath(); g.moveTo(R, R); g.arc(R, R, R, a0, a0 + 0.5); g.closePath(); g.fill();
  });
  return toTexture(c);
}

function disposeMaterialMaps(m) {
  ['map', 'bumpMap'].forEach((k) => m[k]?.dispose?.());
}

// Centre a model on the origin and measure it
function finish(root) {
  const box = new THREE.Box3().setFromObject(root);
  const centre = box.getCenter(new THREE.Vector3());
  root.children.forEach((c) => { c.position.sub(centre); });
  return { height: box.max.y - box.min.y, width: box.max.x - box.min.x };
}

const mesh = (geo, mat, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  return m;
};

// ── 1. Headphones ──────────────────────────────────────────────
// Matte over-ear cans: slim padded headband on metal sliders, swivel yokes, leather pads,
// brushed-metal cup plates with mic ports and a thin light ring.
const CUP_X = 1.05;          // distance of each cup's centre from the middle
const CUP_Y = -0.35;         // vertical centre of the cups

function cupProfile(R, H, b, seg = 10) {
  const pts = [new THREE.Vector2(0, H), new THREE.Vector2(R - b, H)];
  for (let i = 1; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - b + Math.sin(a) * b, H - b + Math.cos(a) * b));
  }
  pts.push(new THREE.Vector2(R, 0.1));
  pts.push(new THREE.Vector2(R - 0.08, 0));
  pts.push(new THREE.Vector2(0, 0));
  return pts;
}

function buildHeadphones(colors) {
  const root = new THREE.Group();
  const leather = noiseTexture(256, [10, 3], 90, 215);
  const foam = noiseTexture(128, [4, 4], 40, 130);
  const brushed = brushedTexture();

  const mats = {
    body:  new THREE.MeshPhysicalMaterial({ color: colors.body, metalness: 0.12, roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.45 }),
    plate: new THREE.MeshStandardMaterial({ color: colors.metal, metalness: 1, roughness: 0.36, map: brushed }),
    dark:  new THREE.MeshStandardMaterial({ color: colors.dark, metalness: 0.1, roughness: 0.7 }),
    metal: new THREE.MeshStandardMaterial({ color: colors.metal, metalness: 1, roughness: 0.3 }),
    pad:   new THREE.MeshPhysicalMaterial({ color: '#1a1c23', roughness: 0.58, sheen: 0.6, sheenRoughness: 0.5, bumpMap: leather, bumpScale: 1.4 }),
    foam:  new THREE.MeshStandardMaterial({ color: '#23262e', roughness: 1, bumpMap: foam, bumpScale: 2 }),
    ring:  new THREE.MeshStandardMaterial({ color: colors.accent, emissive: colors.accent, emissiveIntensity: 1.2, roughness: 0.4 }),
    badge: new THREE.MeshStandardMaterial({ map: makeBadgeTexture('JS', colors.accent, '#ffffff'), metalness: 0.1, roughness: 0.35 }),
  };
  const cups = [];

  [-1, 1].forEach((side) => {
    const cup = new THREE.Group();                         // local +Y is "outward"

    cup.add(new THREE.Mesh(new THREE.LatheGeometry(cupProfile(0.86, 0.5, 0.3), 96), mats.body));

    const plate = mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.035, 96), mats.plate, 0, 0.5, 0);
    cup.add(plate);
    cup.add(mesh(new THREE.TorusGeometry(0.64, 0.014, 12, 128), mats.ring, 0, 0.52, 0).rotateX(Math.PI / 2));
    // mic ports
    [-0.12, 0, 0.12].forEach((dx) => {
      cup.add(mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.045, 12), mats.dark, dx, 0.52, 0.4));
    });
    // logo disc
    cup.add(mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.02, 40), mats.metal, 0, 0.53, 0));
    const badgeFace = new THREE.Group();
    badgeFace.position.y = 0.542;
    badgeFace.rotation.y = side * Math.PI / 2;
    badgeFace.add(new THREE.Mesh(new THREE.CircleGeometry(0.15, 40), mats.badge).rotateX(-Math.PI / 2));
    cup.add(badgeFace);

    // Leather pad (rounded oval cushion) with a foam face behind the opening
    const pad = mesh(new THREE.TorusGeometry(0.55, 0.28, 36, 112), mats.pad, 0, -0.12, 0).rotateX(Math.PI / 2);
    pad.scale.set(1, 1, 0.82);
    cup.add(pad);
    cup.add(mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.44, 48), mats.foam, 0, -0.2, 0));   // solid, so the opening never shows the shell

    cup.scale.set(1.14, 1, 0.92);
    cup.rotation.z = -side * Math.PI / 2;
    cup.position.set(side * CUP_X, CUP_Y, 0);
    cup.userData.side = side;
    root.add(cup);
    cups.push(cup);

    // Swivel hinge + slider arm up to the headband
    const hx = side * (CUP_X + 0.5);
    const hingeY = CUP_Y + 0.98;
    root.add(mesh(new RoundedBoxGeometry(0.16, 0.2, 0.34, 3, 0.04), mats.dark, hx, hingeY, 0));
    const rod = mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.95, 20), mats.metal, hx, hingeY + 0.5, 0);
    root.add(rod);
    for (let k = 0; k < 6; k++) {
      root.add(mesh(new THREE.TorusGeometry(0.04, 0.008, 8, 20), mats.dark, hx, hingeY + 0.18 + k * 0.1, 0).rotateX(Math.PI / 2));
    }
    root.add(mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.26, 24), mats.dark, hx, hingeY + 1.02, 0));
  });

  // Headband: a slim ribbon with a padded underside
  const bandX = CUP_X + 0.5;
  const bandBase = CUP_Y + 0.98 + 1.1;
  const arc = (a, b, t0, t1) => {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const t = t0 + ((t1 - t0) * i) / 80;
      pts.push(new THREE.Vector3(a * Math.cos(t), bandBase + b * Math.sin(t), 0));
    }
    return new THREE.CatmullRomCurve3(pts);
  };
  const band = new THREE.Mesh(new THREE.TubeGeometry(arc(bandX, 1.35, 0, Math.PI), 120, 0.05, 16), mats.body);
  band.scale.z = 5.2;
  root.add(band);
  const cushion = new THREE.Mesh(new THREE.TubeGeometry(arc(bandX - 0.04, 1.27, Math.PI * 0.2, Math.PI * 0.8), 90, 0.085, 20), mats.pad);
  cushion.scale.z = 3.6;
  root.add(cushion);

  const size = finish(root);
  cups.forEach((c) => { c.userData.baseX = c.position.x; });

  return {
    root, ...size, hot: cups, follow: { yaw: 0.85, pitch: 0.3 },
    update({ dt, t, energy, isPlaying, hovered, kick, reduceMotion }) {
      cups.forEach((cup) => {
        const lift = hovered === cup ? 0.08 : 0;
        const goal = cup.userData.baseX + cup.userData.side * (lift + energy * 0.05);
        cup.position.x += (goal - cup.position.x) * Math.min(1, dt * 12);
      });
      const base = isPlaying ? 1.5 : 0.7 + (reduceMotion ? 0 : Math.sin(t * 2) * 0.2);
      mats.ring.emissiveIntensity = base + energy * 3 + (hovered ? 1.1 : 0) + kick * 2;
    },
    recolour(c) {
      mats.body.color.set(c.body);
      mats.dark.color.set(c.dark);
      mats.metal.color.set(c.metal);
      mats.plate.color.set(c.metal);
      mats.ring.color.set(c.accent);
      mats.ring.emissive.set(c.accent);
      mats.badge.map.dispose();
      mats.badge.map = makeBadgeTexture('JS', c.accent, '#ffffff');
      mats.badge.needsUpdate = true;
    },
    dispose() { Object.values(mats).forEach(disposeMaterialMaps); },
  };
}

// ── 2. Turntable ───────────────────────────────────────────────
// Walnut plinth, aluminium platter with a spinning LP, a tonearm that swings onto the record
// and tracks inward as the song plays, speed/power knobs and a power LED.
const PIVOT = { x: 1.75, z: -1.1 };
const CENTRE = { x: -0.55, z: 0.1 };
const ARM_L = 2.35;
const DX = CENTRE.x - PIVOT.x;
const DZ = CENTRE.z - PIVOT.z;
const D = Math.hypot(DX, DZ);
const PHI = Math.atan2(DZ, DX);                // direction from pivot to spindle (in the XZ plane)

// Angle between "pivot → spindle" and the arm, for a stylus resting r from the spindle
const armAlpha = (r) => Math.acos(THREE.MathUtils.clamp((ARM_L * ARM_L + D * D - r * r) / (2 * ARM_L * D), -1, 1));
const ALPHA_OUT = armAlpha(1.2);
const ALPHA_IN = armAlpha(0.6);
const ALPHA_PARK = ALPHA_OUT + 0.62;

function buildTurntable(colors) {
  const root = new THREE.Group();
  const tilt = new THREE.Group();              // look down onto the deck
  tilt.rotation.x = 0.66;
  root.add(tilt);

  const vinylCanvas = canvasOf(1024);
  drawVinyl(vinylCanvas);
  const labelCanvas = canvasOf(512);
  drawLabel(labelCanvas, DEFAULT_DISC);
  const vinylMap = toTexture(vinylCanvas);
  const labelMap = toTexture(labelCanvas);
  const sheenMap = sheenTexture();

  const mats = {
    wood:  new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.5 }),
    top:   new THREE.MeshStandardMaterial({ color: '#16171c', roughness: 0.45, metalness: 0.25 }),
    alu:   new THREE.MeshStandardMaterial({ color: colors.metal, metalness: 1, roughness: 0.26 }),
    dark:  new THREE.MeshStandardMaterial({ color: colors.dark, roughness: 0.6, metalness: 0.3 }),
    slip:  new THREE.MeshStandardMaterial({ color: '#0e0e11', roughness: 0.95 }),
    vinyl: new THREE.MeshPhysicalMaterial({ map: vinylMap, roughness: 0.34, metalness: 0.2, clearcoat: 0.7, clearcoatRoughness: 0.25 }),
    edge:  new THREE.MeshStandardMaterial({ color: '#0a0a0d', roughness: 0.4 }),
    label: new THREE.MeshStandardMaterial({ map: labelMap, roughness: 0.65 }),
    sheen: new THREE.MeshBasicMaterial({ map: sheenMap, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    led:   new THREE.MeshStandardMaterial({ color: '#ff4a4a', emissive: '#ff2020', emissiveIntensity: 0.3 }),
    accent: new THREE.MeshStandardMaterial({ color: colors.accent, emissive: colors.accent, emissiveIntensity: 0.8 }),
  };

  // Plinth, top plate, feet
  tilt.add(mesh(new RoundedBoxGeometry(4.7, 0.42, 3.7, 5, 0.07), mats.wood));
  tilt.add(mesh(new RoundedBoxGeometry(4.5, 0.03, 3.5, 3, 0.012), mats.top, 0, 0.215, 0));
  [[-2.05, -1.55], [2.05, -1.55], [-2.05, 1.55], [2.05, 1.55]].forEach(([x, z]) => {
    tilt.add(mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.14, 24), mats.dark, x, -0.28, z));
  });

  // Platter + record
  const platter = new THREE.Group();
  platter.position.set(CENTRE.x, 0.23, CENTRE.z);
  platter.add(mesh(new THREE.CylinderGeometry(1.44, 1.44, 0.12, 128), mats.alu, 0, 0.06, 0));
  platter.add(mesh(new THREE.CylinderGeometry(1.36, 1.36, 0.02, 96), mats.slip, 0, 0.13, 0));
  const rec = new THREE.Group();
  rec.position.y = 0.155;
  rec.add(mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.024, 160), [mats.edge, mats.vinyl, mats.vinyl]));
  rec.add(mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.03, 64), [mats.edge, mats.label, mats.label], 0, 0.004, 0));
  platter.add(rec);
  platter.add(mesh(new THREE.CircleGeometry(1.29, 96), mats.sheen, 0, 0.172, 0).rotateX(-Math.PI / 2));
  platter.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 20), mats.alu, 0, 0.22, 0));
  tilt.add(platter);

  // Tonearm
  const baseArm = new THREE.Group();
  baseArm.position.set(PIVOT.x, 0.23, PIVOT.z);
  baseArm.add(mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.26, 40), mats.dark, 0, 0.13, 0));
  baseArm.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 40), mats.alu, 0, 0.28, 0));
  const arm = new THREE.Group();                 // swings about Y; local +X points at the stylus
  arm.position.y = 0.36;
  arm.add(mesh(new THREE.SphereGeometry(0.11, 24, 16), mats.alu));
  arm.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, ARM_L + 0.1, 16), mats.alu, ARM_L / 2 - 0.05, 0, 0).rotateZ(Math.PI / 2));
  arm.add(mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.34, 32), mats.dark, -0.4, 0, 0).rotateZ(Math.PI / 2));
  arm.add(mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.04, 32), mats.alu, -0.22, 0, 0).rotateZ(Math.PI / 2));
  const head = mesh(new RoundedBoxGeometry(0.36, 0.045, 0.17, 2, 0.02), mats.dark, ARM_L + 0.12, -0.01, 0);
  head.rotation.y = -0.12;
  arm.add(head);
  arm.add(mesh(new RoundedBoxGeometry(0.2, 0.1, 0.14, 2, 0.02), mats.alu, ARM_L + 0.18, -0.08, 0));
  arm.add(mesh(new THREE.ConeGeometry(0.014, 0.1, 10), mats.alu, ARM_L + 0.27, -0.16, 0).rotateZ(Math.PI));
  baseArm.add(arm);
  tilt.add(baseArm);

  // Controls
  [[1.55, 1.38], [0.95, 1.38]].forEach(([x, z], i) => {
    tilt.add(mesh(new THREE.CylinderGeometry(0.17, 0.18, 0.12, 40), mats.alu, x, 0.29, z));
    tilt.add(mesh(new THREE.BoxGeometry(0.025, 0.02, 0.1), mats.dark, x, 0.355, z - 0.05).rotateY(i * 0.8));
  });
  tilt.add(mesh(new THREE.SphereGeometry(0.045, 16, 12), mats.led, 2.0, 0.24, 1.38));
  tilt.add(mesh(new THREE.BoxGeometry(0.5, 0.012, 0.03), mats.accent, 2.0, 0.232, 1.2));

  const size = finish(root);
  let paletteKey = 'default';
  let speed = 0;
  let alpha = ALPHA_PARK;
  const armTheta = (a) => -(PHI - a);            // arm local +X → direction PHI − a in the XZ plane
  arm.rotation.y = armTheta(alpha);

  return {
    root, ...size, hot: [root], follow: { yaw: 0.6, pitch: 0.3 },
    update({ dt, energy, isPlaying, activeId, progress }) {
      const key = activeId ?? 'default';
      if (key !== paletteKey) {
        paletteKey = key;
        drawLabel(labelCanvas, activeId != null ? PALETTE[(activeId - 1) % PALETTE.length].disc : DEFAULT_DISC);
        labelMap.needsUpdate = true;
      }
      // Platter spins up/down gently — about 17 rpm
      const target = isPlaying ? 1.8 : 0;
      speed += (target - speed) * Math.min(1, dt * (isPlaying ? 1.4 : 0.9));
      rec.rotation.y -= speed * dt;

      // Arm: parked → onto the outer groove → creeping inward with the song
      const aGoal = isPlaying
        ? ALPHA_OUT + (ALPHA_IN - ALPHA_OUT) * THREE.MathUtils.clamp(progress || 0, 0, 1)
        : ALPHA_PARK;
      alpha += (aGoal - alpha) * Math.min(1, dt * (isPlaying ? 1.6 : 1.8));
      arm.rotation.y = armTheta(alpha);

      mats.led.emissiveIntensity = isPlaying ? 2.2 + energy * 2 : 0.25;
      mats.accent.emissiveIntensity = isPlaying ? 1.2 + energy * 2.5 : 0.5;
    },
    recolour(c) {
      mats.alu.color.set(c.metal);
      mats.dark.color.set(c.dark);
      mats.accent.color.set(c.accent);
      mats.accent.emissive.set(c.accent);
    },
    dispose() { [mats.wood, mats.vinyl, mats.label, mats.sheen].forEach(disposeMaterialMaps); },
  };
}

// ── 3. Speaker ─────────────────────────────────────────────────
// A Marshall-style amp speaker: black textured cabinet, woven cloth grille in a gold frame,
// script badge, and a row of brass knobs on top.
function buildSpeaker(colors) {
  const root = new THREE.Group();
  const W = 3.5, H = 2.15, Dp = 1.55;

  const scriptCanvas = canvasOf(512, 144);
  drawScript(scriptCanvas);
  const scriptMap = toTexture(scriptCanvas);
  document.fonts?.load?.('700 100px Caveat').then(() => { drawScript(scriptCanvas); scriptMap.needsUpdate = true; }).catch(() => {});

  const mats = {
    tolex: new THREE.MeshPhysicalMaterial({ color: '#1b1b1f', roughness: 0.8, bumpMap: noiseTexture(256, [7, 4], 80, 200), bumpScale: 1.6 }),
    cloth: new THREE.MeshStandardMaterial({ map: clothTexture(), roughness: 1, bumpMap: noiseTexture(128, [10, 6], 60, 190), bumpScale: 1 }),
    gold:  new THREE.MeshStandardMaterial({ color: '#cfa64b', metalness: 1, roughness: 0.3 }),
    dark:  new THREE.MeshStandardMaterial({ color: '#101013', roughness: 0.6, metalness: 0.2 }),
    panel: new THREE.MeshStandardMaterial({ color: '#2a2a30', roughness: 0.45, metalness: 0.6 }),
    script: new THREE.MeshBasicMaterial({ map: scriptMap, transparent: true, alphaTest: 0.05 }),
    led:   new THREE.MeshStandardMaterial({ color: colors.accent, emissive: colors.accent, emissiveIntensity: 1.2 }),
  };

  root.add(mesh(new RoundedBoxGeometry(W, H, Dp, 6, 0.11), mats.tolex));

  // Grille cloth in a gold frame (the cloth "breathes" with the bass)
  const cloth = mesh(new RoundedBoxGeometry(W - 0.34, H - 0.34, 0.05, 3, 0.02), mats.cloth, 0, 0, Dp / 2 + 0.005);
  root.add(cloth);
  const fz = Dp / 2 + 0.02;
  root.add(mesh(new THREE.BoxGeometry(W - 0.22, 0.05, 0.07), mats.gold, 0, (H - 0.3) / 2, fz));
  root.add(mesh(new THREE.BoxGeometry(W - 0.22, 0.05, 0.07), mats.gold, 0, -(H - 0.3) / 2, fz));
  root.add(mesh(new THREE.BoxGeometry(0.05, H - 0.3, 0.07), mats.gold, (W - 0.22) / 2, 0, fz));
  root.add(mesh(new THREE.BoxGeometry(0.05, H - 0.3, 0.07), mats.gold, -(W - 0.22) / 2, 0, fz));

  // Script badge, top-left of the grille
  root.add(mesh(new THREE.PlaneGeometry(1.0, 0.28), mats.script, -0.95, 0.52, Dp / 2 + 0.036));

  // Control panel and brass knobs on top
  root.add(mesh(new RoundedBoxGeometry(W - 0.5, 0.03, 0.62, 2, 0.01), mats.panel, 0, H / 2 + 0.005, 0.42));
  [-1.1, -0.55, 0, 0.55, 1.1].forEach((x, i) => {
    root.add(mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.13, 48), mats.gold, x, H / 2 + 0.075, 0.42));
    root.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 32), mats.dark, x, H / 2 + 0.145, 0.42));
    root.add(mesh(new THREE.BoxGeometry(0.02, 0.012, 0.1), mats.gold, x, H / 2 + 0.155, 0.38).rotateY(0.6 + i * 0.5));
  });
  root.add(mesh(new THREE.SphereGeometry(0.05, 16, 12), mats.led, 1.45, H / 2 + 0.04, 0.42));

  // Corner caps and feet
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
    root.add(mesh(new THREE.SphereGeometry(0.06, 12, 10), mats.gold, sx * (W / 2 - 0.02), sy * (H / 2 - 0.02), Dp / 2 - 0.02));
  });
  [[-1.4, -0.55], [1.4, -0.55], [-1.4, 0.55], [1.4, 0.55]].forEach(([x, z]) => {
    root.add(mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.12, 20), mats.dark, x, -H / 2 - 0.05, z));
  });

  const size = finish(root);
  const clothZ = cloth.position.z;

  return {
    root, ...size, hot: [root], follow: { yaw: 0.8, pitch: 0.22 },
    update({ dt, t, energy, isPlaying, hovered, kick, reduceMotion }) {
      const pump = energy * 0.05 + kick * 0.04;
      cloth.position.z += (clothZ + pump - cloth.position.z) * Math.min(1, dt * 16);
      const s = 1 + energy * 0.012;
      cloth.scale.set(s, s, 1);
      const base = isPlaying ? 1.8 : 0.8 + (reduceMotion ? 0 : Math.sin(t * 2) * 0.25);
      mats.led.emissiveIntensity = base + energy * 3 + (hovered ? 1 : 0) + kick * 2;
    },
    recolour(c) {
      mats.led.color.set(c.accent);
      mats.led.emissive.set(c.accent);
    },
    dispose() { [mats.tolex, mats.cloth, mats.script].forEach(disposeMaterialMaps); },
  };
}

export const OBJECTS = [
  { id: 'headphones', label: 'HEADPHONES', build: buildHeadphones },
  { id: 'turntable',  label: 'LP PLAYER',  build: buildTurntable },
  { id: 'speaker',    label: 'SPEAKER',    build: buildSpeaker },
];
