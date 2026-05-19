import { useEffect, useRef } from 'react';
import './AudioBars.css';

const NUM_BARS   = 48;
const ATTACK     = 0.8;
const DECAY      = 0.12;
const PEAK_HOLD  = 18;
const PEAK_DECAY = 0.04;

function hexToHue(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  let h;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    default: h = ((r - g) / d + 4) / 6;
  }
  return Math.round(h * 360);
}

export default function AudioBars({ analyser, isPlaying, accentColor = '#4FA8FF' }) {
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const smoothRef  = useRef(new Float32Array(NUM_BARS).fill(0));
  const peakRef    = useRef(new Float32Array(NUM_BARS).fill(0));
  const peakHoldRef = useRef(new Int32Array(NUM_BARS).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const baseHue = hexToHue(accentColor);

    if (!analyser || !isPlaying) {
      const fade = () => {
        const smooth = smoothRef.current;
        const peaks  = peakRef.current;
        let stillActive = false;
        for (let i = 0; i < NUM_BARS; i++) {
          smooth[i] *= 0.85;
          peaks[i]  *= 0.85;
          if (smooth[i] > 0.002) stillActive = true;
        }
        draw(ctx, canvas, smooth, peaks, baseHue);
        if (stillActive) rafRef.current = requestAnimationFrame(fade);
      };
      rafRef.current = requestAnimationFrame(fade);
      return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
    }

    const bufLen  = analyser.frequencyBinCount;
    const data    = new Uint8Array(bufLen);
    const step    = bufLen / NUM_BARS;
    const smooth  = smoothRef.current;
    const peaks   = peakRef.current;
    const holds   = peakHoldRef.current;

    const tick = () => {
      analyser.getByteFrequencyData(data);

      for (let i = 0; i < NUM_BARS; i++) {
        const start = Math.floor(i * step);
        const end   = Math.floor((i + 1) * step);
        let sum = 0;
        for (let j = start; j < end; j++) sum += data[j];
        const raw = (sum / (end - start)) / 255;

        if (raw > smooth[i]) {
          smooth[i] = smooth[i] + (raw - smooth[i]) * ATTACK;
        } else {
          smooth[i] = smooth[i] * (1 - DECAY);
        }

        if (smooth[i] >= peaks[i]) {
          peaks[i] = smooth[i];
          holds[i] = PEAK_HOLD;
        } else {
          if (holds[i] > 0) {
            holds[i]--;
          } else {
            peaks[i] = Math.max(0, peaks[i] - PEAK_DECAY);
          }
        }
      }

      draw(ctx, canvas, smooth, peaks, baseHue);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [analyser, isPlaying, accentColor]);

  return <canvas ref={canvasRef} className="ab-canvas" />;
}

function draw(ctx, canvas, smooth, peaks, baseHue = 215) {
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const barW   = W / NUM_BARS;
  const gap    = Math.max(1, barW * 0.15);
  const bw     = barW - gap;

  for (let i = 0; i < NUM_BARS; i++) {
    const energy = smooth[i];
    const x      = i * barW + gap / 2;
    const barH   = Math.max(2, energy * H);
    const y      = H - barH;

    const hue  = (baseHue + (i / NUM_BARS) * 20) % 360;
    const sat  = Math.round(60 + energy * 40);
    const lit  = Math.round(30 + energy * 50);

    // Bar gradient — brighter at top
    const grad = ctx.createLinearGradient(0, y, 0, H);
    grad.addColorStop(0, `hsla(${hue}, ${sat}%, ${Math.min(90, lit + 30)}%, 1)`);
    grad.addColorStop(1, `hsla(${hue}, ${sat}%, ${lit}%, 0.6)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, bw, barH, [2, 2, 0, 0]);
    ctx.fill();

    // Glow on active bars
    if (energy > 0.1) {
      ctx.shadowColor = `hsla(${hue}, 90%, 65%, ${energy * 0.8})`;
      ctx.shadowBlur  = 8 + energy * 16;
      ctx.fillStyle   = `hsla(${hue}, ${sat}%, ${lit + 20}%, ${energy * 0.4})`;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }

    // Peak dot
    const peakH = peaks[i];
    if (peakH > 0.02) {
      const py = H - peakH * H - 2;
      ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${Math.min(1, peakH * 2)})`;
      ctx.beginPath();
      ctx.roundRect(x, py, bw, 2, 1);
      ctx.fill();
    }
  }
}
