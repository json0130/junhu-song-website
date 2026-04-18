import { useEffect, useRef, useState } from 'react';
import './MusicLED.css';

/**
 * MusicLED — a panel of vertical LED strips that react to audio in real time.
 * Each strip represents a frequency band (sub-bass, bass, low-mid, mid, high-mid, treble).
 * Pass an AnalyserNode via `analyser` prop when audio is playing.
 * Falls back to a slow idle rainbow animation when no audio is active.
 */

// Each strip covers a frequency range and has a base hue
const BANDS = [
  { label: 'SUB',  freqMax: 60,   baseHue: 215 },   // deep blue
  { label: 'BASS', freqMax: 200,  baseHue: 210 },   // blue
  { label: 'LMD',  freqMax: 600,  baseHue: 205 },   // blue
  { label: 'MID',  freqMax: 2000, baseHue: 200 },   // blue-cyan
  { label: 'HMD',  freqMax: 6000, baseHue: 195 },   // cyan
  { label: 'TRB',  freqMax: 20000,baseHue: 190 },   // light cyan
];

export default function MusicLED({ analyser }) {
  const rafRef = useRef(null);
  const [strips, setStrips] = useState(
    BANDS.map((b) => ({ hue: b.baseHue, sat: 60, lit: 45, energy: 0 }))
  );
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!analyser) {
      setActive(false);
      return;
    }

    setActive(true);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const nyquist = analyser.context.sampleRate / 2;

    const freqToIndex = (hz) => Math.floor((hz / nyquist) * bufferLength);

    const avg = (arr, start, end) => {
      let s = 0;
      const len = Math.max(1, end - start);
      for (let i = start; i < end; i++) s += arr[i];
      return s / len;
    };

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);

      let prevIdx = 0;
      const next = BANDS.map((band) => {
        const endIdx = Math.min(bufferLength, freqToIndex(band.freqMax));
        const energy = avg(dataArray, prevIdx, endIdx) / 255;
        prevIdx = endIdx;

        const sat = Math.round(30 + energy * 70);
        const lit = Math.round(20 + energy * 50);
        return { hue: band.baseHue, sat, lit, energy };
      });

      setStrips(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  return (
    <div className={`music-led-panel ${active ? 'music-led-panel--active' : 'music-led-panel--idle'}`}>
      <div className="mlp-label">LED</div>
      <div className="mlp-strips">
        {strips.map((s, i) => {
          const style = active
            ? {
                background: `hsl(${s.hue}, ${s.sat}%, ${s.lit}%)`,
                boxShadow: `0 0 10px 3px hsla(${s.hue}, ${s.sat}%, ${s.lit}%, ${0.3 + s.energy * 0.5})`,
                height: `${40 + s.energy * 60}%`,
              }
            : {};

          return (
            <div key={i} className="mlp-strip-wrapper">
              <div
                className={`mlp-strip ${active ? 'mlp-strip--active' : ''}`}
                style={{ ...style, '--idle-hue': `${BANDS[i].baseHue}` }}
              />
              <span className="mlp-band-label">{BANDS[i].label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
