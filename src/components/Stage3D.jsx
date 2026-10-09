import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useAudio } from '../context/AudioContext';
import { OBJECTS, readColors } from './models3d';
import './Stage3D.css';

function disposeScene(scene) {
  scene.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
        ['map', 'bumpMap'].forEach((k) => m[k]?.dispose?.());
        m.dispose();
      });
    }
  });
}

// ── Component ──────────────────────────────────────────────────
export default function Stage3D() {
  const wrapRef   = useRef(null);
  const stageRef  = useRef(null);
  const canvasRef = useRef(null);
  const audio     = useAudio();
  const audioRef  = useRef(audio);
  useEffect(() => { audioRef.current = audio; }); // latest audio state for the render loop

  const [idx, setIdx] = useState(0);
  const targetRef = useRef({ index: 0, dir: 1 });

  const go = (dir) => {
    const next = (targetRef.current.index + dir + OBJECTS.length) % OBJECTS.length;
    targetRef.current = { index: next, dir };
    setIdx(next);
  };
  const goTo = (i) => {
    if (i === targetRef.current.index) return;
    targetRef.current = { index: i, dir: i > targetRef.current.index ? 1 : -1 };
    setIdx(i);
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !stage || !canvas) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      wrap.dataset.fallback = 'true';
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.95;

    const key = new THREE.DirectionalLight('#ffffff', 1.6);
    key.position.set(3, 5, 6);
    scene.add(key);
    const rim = new THREE.PointLight(readColors().accent, 40, 20);
    rim.position.set(-4, 1.5, -3);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

    const models = OBJECTS.map((o) => o.build(readColors()));
    models.forEach((m) => { m.root.visible = false; scene.add(m.root); });
    let shown = 0;               // model currently on stage
    models[0].root.visible = true;
    let appear = 0;              // 0..1 — pop-in of the shown model

    const fit = () => {
      const model = models[shown];
      const w = stage.clientWidth || 1;
      const h = stage.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const distH = (model.height * 0.74) / tan;
      const distW = (model.width * 0.78) / (tan * camera.aspect);
      camera.position.set(0, 0, Math.max(distH, distW));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);

    const recolour = () => {
      const c = readColors();
      models.forEach((m) => m.recolour(c));
      rim.color.set(c.accent);
    };
    window.addEventListener('themechange', recolour);

    // ── Interaction state ──
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0, inside: false, ndc: new THREE.Vector2() };
    const drag = { active: false, moved: 0, lastX: 0, spin: 0, vel: 0 };
    const raycaster = new THREE.Raycaster();
    let hovered = null;
    let pressedHot = false;
    let energy = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let kick = 0;                                  // click "punch"
    const freq = new Uint8Array(128);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = THREE.MathUtils.clamp((e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 360), -1.2, 1.2);
      pointer.y = THREE.MathUtils.clamp((e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 360), -1.2, 1.2);
      pointer.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      pointer.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      if (drag.active) {
        const dx = e.clientX - drag.lastX;
        drag.lastX = e.clientX;
        drag.moved += Math.abs(dx);
        drag.spin += dx * 0.012;
        drag.vel = dx * 0.012;
      }
    };
    const onDown = (e) => {
      drag.active = true;
      pressedHot = hovered !== null;
      drag.moved = 0;
      drag.lastX = e.clientX;
      canvas.setPointerCapture?.(e.pointerId);
      stage.classList.add('is-dragging');
    };
    const onUp = (e) => {
      if (!drag.active) return;
      drag.active = false;
      canvas.releasePointerCapture?.(e.pointerId);
      stage.classList.remove('is-dragging');
      drag.spin = THREE.MathUtils.euclideanModulo(drag.spin + Math.PI, Math.PI * 2) - Math.PI;
      if (drag.moved < 6 && pressedHot) {   // a click on the object toggles the playlist
        kick = 1;
        audioRef.current?.handlePlayPause?.();
      }
    };
    const onLeave = () => { pointer.inside = false; };
    window.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onLeave);

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.01 });
    io.observe(wrap);

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.visibilityState === 'hidden') { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      // Swap objects: shrink the old one away, then pop the new one in
      const { index: want, dir } = targetRef.current;
      if (shown !== want) {
        appear -= dt * 6;
        if (appear <= 0) {
          models[shown].root.visible = false;
          shown = want;
          models[shown].root.visible = true;
          drag.spin = 0; drag.vel = 0;
          appear = 0;
          fit();
        }
      } else {
        appear = Math.min(1, appear + dt * 4);
      }
      const ease = appear * appear * (3 - 2 * appear);
      const model = models[shown];

      // Audio energy (low end of the spectrum), smoothed
      const { analyser, isPlaying, activeId, progress } = audioRef.current || {};
      let target = 0;
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(freq);
        let sum = 0;
        for (let i = 0; i < 10; i++) sum += freq[i];
        target = Math.min(1, (sum / 10 / 255) * 1.25);
      }
      energy += (target - energy) * Math.min(1, dt * (target > energy ? 14 : 5));

      // Orientation: follow the cursor, otherwise drift; plus manual spin that unwinds
      const root = model.root;
      const follow = pointer.inside || drag.active;
      const idleYaw = reduceMotion ? 0 : Math.sin(t * 0.45) * 0.5;
      const yawTarget = (follow ? pointer.x * model.follow.yaw : idleYaw) + drag.spin + (1 - ease) * dir * -1.1;
      const pitchTarget = follow ? pointer.y * model.follow.pitch : (reduceMotion ? 0 : Math.sin(t * 0.6) * 0.06);
      root.rotation.y += (yawTarget - root.rotation.y) * Math.min(1, dt * 6);
      root.rotation.x += (pitchTarget - root.rotation.x) * Math.min(1, dt * 6);
      if (!drag.active) {
        drag.spin += drag.vel; drag.vel *= 0.92;
        drag.spin *= Math.pow(0.35, dt);
      }

      // Float, music pulse, click punch and pop-in
      kick = Math.max(0, kick - dt * 3);
      const bob = reduceMotion ? 0 : Math.sin(t * 1.3) * 0.05;
      root.position.y = bob + energy * 0.05;
      root.scale.setScalar(Math.max(0.001, (1 + energy * 0.035 + Math.sin(kick * Math.PI) * 0.08) * (0.55 + 0.45 * ease)));

      // Hover: ray-cast the current model's hot parts
      hovered = null;
      if (pointer.inside && !drag.active && ease > 0.9) {
        raycaster.setFromCamera(pointer.ndc, camera);
        const hit = raycaster.intersectObjects(model.hot, true)[0];
        if (hit) {
          const hotSet = new Set(model.hot);
          let o = hit.object;
          while (o && !hotSet.has(o)) o = o.parent;
          hovered = o || null;
        }
      }
      stage.classList.toggle('is-hot', hovered !== null);

      model.update({ dt, t, energy, isPlaying, activeId, progress, hovered, kick, reduceMotion });
      rim.intensity = 30 + energy * 90;

      wrap.style.setProperty('--hp-energy', energy.toFixed(3));
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('themechange', recolour);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerleave', onLeave);
      disposeScene(scene);
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  const { isPlaying } = audio || {};
  const obj = OBJECTS[idx];

  return (
    <div className="st3d" ref={wrapRef}>
      <div className="st3d-stage" ref={stageRef}>
        <div className="st3d-glow" />
        <canvas
          ref={canvasRef}
          className="st3d-canvas"
          aria-label={`Interactive 3D ${obj.label.toLowerCase()}. Click to play or pause the playlist.`}
          role="img"
        />

        <div className="st3d-hint mono-tiny">
          <span className="st3d-dot" />
          {obj.label} // {isPlaying ? 'CLICK TO PAUSE' : 'DRAG TO SPIN · CLICK TO PLAY'}
        </div>

        <button type="button" className="st3d-arrow st3d-arrow--prev" onClick={() => go(-1)} aria-label="Previous 3D object">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <polyline points="10,2 4,8 10,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="st3d-arrow st3d-arrow--next" onClick={() => go(1)} aria-label="Next 3D object">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <polyline points="6,2 12,8 6,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="st3d-dots" role="tablist" aria-label="3D objects">
          {OBJECTS.map((o, i) => (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-label={o.label.toLowerCase()}
              className={`st3d-pip ${i === idx ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
