import { useEffect, useRef, useState } from 'react';
import './MusicLED.css';

/**
 * MusicLED — a narrow vertical LED strip that reacts to audio in real time.
 * Pass an AnalyserNode via `analyser` prop when audio is playing.
 * Falls back to a slow idle hue-cycle animation when no audio is active.
 */
export default function MusicLED({ analyser }) {
  const rafRef = useRef(null);
  const [hue, setHue] = useState(210);
  const [sat, setSat] = useState(70);
  const [lit, setLit] = useState(55);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!analyser) {
      setActive(false);
      return;
    }

    setActive(true);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const sampleRate = analyser.context.sampleRate;

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);

      // Split into bands: bass / mid / treble
      const bassEnd   = Math.floor((200  / (sampleRate / 2)) * bufferLength);
      const midEnd    = Math.floor((2000 / (sampleRate / 2)) * bufferLength);

      const avg = (arr, start, end) => {
        let s = 0;
        for (let i = start; i < end; i++) s += arr[i];
        return s / (end - start);
      };

      const bass   = avg(dataArray, 0,       bassEnd);
      const mid    = avg(dataArray, bassEnd,  midEnd);
      const treble = avg(dataArray, midEnd,   bufferLength);

      // Find dominant band → hue
      let targetHue;
      if (bass >= mid && bass >= treble)        targetHue = 10;   // red-orange
      else if (mid >= bass && mid >= treble)    targetHue = 100;  // green
      else                                       targetHue = 220;  // blue-purple

      // Blend toward treble/mid mix
      const blendedHue = Math.round(
        targetHue * 0.7 +
        (treble > mid ? 240 : 80) * 0.3
      );

      // Overall energy → saturation + lightness
      const energy = (bass + mid + treble) / 3;
      const targetSat = Math.min(100, 40 + (energy / 255) * 60);
      const targetLit = Math.min(70, 30 + (energy / 255) * 40);

      setHue(blendedHue);
      setSat(Math.round(targetSat));
      setLit(Math.round(targetLit));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  const style = active
    ? {
        background: `hsl(${hue}, ${sat}%, ${lit}%)`,
        boxShadow: `0 0 18px 5px hsla(${hue}, ${sat}%, ${lit}%, 0.5)`,
      }
    : {};

  return (
    <div
      className={`music-led ${active ? 'music-led--active' : 'music-led--idle'}`}
      style={style}
      title="Music reactive LED"
    />
  );
}
