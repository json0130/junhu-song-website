import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TRACKS } from '../data/tracks';
import AudioBars from './AudioBars';
import './Music.css';

// Per-track colour palettes — cycles if more tracks than entries
const PALETTE = [
  { gradient: 'linear-gradient(135deg, #0d0221 0%, #4FA8FF 100%)', disc: ['#0d0221', '#1a3a6e', '#4FA8FF'] },
  { gradient: 'linear-gradient(135deg, #1a0033 0%, #c084fc 100%)', disc: ['#1a0033', '#3b1063', '#c084fc'] },
  { gradient: 'linear-gradient(135deg, #001a1a 0%, #00d4aa 100%)', disc: ['#001a1a', '#003d38', '#00d4aa'] },
  { gradient: 'linear-gradient(135deg, #2a0000 0%, #ff6b6b 100%)', disc: ['#2a0000', '#5a1010', '#ff6b6b'] },
  { gradient: 'linear-gradient(135deg, #0a1a00 0%, #a3e635 100%)', disc: ['#0a1a00', '#1e3d00', '#a3e635'] },
  { gradient: 'linear-gradient(135deg, #1a0d00 0%, #fb923c 100%)', disc: ['#1a0d00', '#3d2000', '#fb923c'] },
  { gradient: 'linear-gradient(135deg, #00091a 0%, #38bdf8 100%)', disc: ['#00091a', '#002040', '#38bdf8'] },
  { gradient: 'linear-gradient(135deg, #1a001a 0%, #f472b6 100%)', disc: ['#1a001a', '#3d003d', '#f472b6'] },
];

function conicGrad(colors) {
  const [dark, mid, accent] = colors;
  return `conic-gradient(from 0deg,
    ${dark} 0deg 30deg, ${mid} 30deg 60deg, ${accent} 60deg 90deg,
    ${dark} 90deg 120deg, ${mid} 120deg 150deg, ${accent} 150deg 180deg,
    ${dark} 180deg 210deg, ${mid} 210deg 240deg, ${accent} 240deg 270deg,
    ${dark} 270deg 300deg, ${mid} 300deg 330deg, ${accent} 330deg 360deg)`;
}

function CoverCard({ track, palette, isActive, isPlaying, onClick }) {
  const { gradient, disc } = palette;
  return (
    <div
      className={`cover-card ${isActive ? 'cover-card--active' : ''}`}
      onClick={onClick}
    >
      <div className="cover-sleeve" style={{ background: gradient }}>
        <span className="cover-num">{String(track.id).padStart(2, '0')}</span>
        <span className="cover-title">{track.title}</span>
        {isActive && isPlaying && <span className="cover-playing">▶</span>}
      </div>
      <div className={`cover-disc-wrap ${isActive ? 'cover-disc-wrap--out' : ''}`}>
        <div className="cover-disc-circle" style={{ background: conicGrad(disc) }}>
          <div className="cover-disc-rings" />
          <div className="cover-disc-label"><div className="cover-disc-hole" /></div>
        </div>
      </div>
    </div>
  );
}

export default function Music({ onNavigate }) {
  const [activeId,  setActiveId]  = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [duration,  setDuration]  = useState(0);

  const ctxRef       = useRef(null);
  const audioRef     = useRef(null);
  const sourceRef    = useRef(null);
  const analyserRef  = useRef(null);
  const activeIdRef  = useRef(null);
  const isPlayingRef = useRef(false);
  const isLoopingRef = useRef(false);
  const rafRef       = useRef(null);
  const spinControls = useAnimation();

  const initAudio = () => {
    if (ctxRef.current) return;
    const AudioCtx = window.AudioContext || (window).webkitAudioContext;
    const ctx      = new AudioCtx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(ctx.destination);
    ctxRef.current      = ctx;
    analyserRef.current = analyser;
  };

  const startSpin = () => spinControls.start({
    rotate: [null, -3600],
    transition: { duration: 20, ease: 'linear', repeat: Infinity },
  });
  const stopSpin = () => spinControls.stop();

  const startProgressTick = () => {
    const tick = () => {
      const a = audioRef.current;
      if (a && a.duration) { setProgress(a.currentTime / a.duration); setDuration(a.duration); }
      rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };
  const stopProgressTick = () => { cancelAnimationFrame(rafRef.current); rafRef.current = null; };

  const tearDown = () => {
    stopProgressTick();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.onended = null; audioRef.current = null; }
    if (sourceRef.current) { try { sourceRef.current.disconnect(); } catch (_) {} sourceRef.current = null; }
    setProgress(0); setDuration(0);
  };

  const playTrack = (track) => {
    initAudio();
    const ctx      = ctxRef.current;
    const analyser = analyserRef.current;

    if (activeIdRef.current === track.id && isPlayingRef.current) {
      audioRef.current.pause();
      isPlayingRef.current = false; setIsPlaying(false); stopSpin(); stopProgressTick(); return;
    }
    if (activeIdRef.current === track.id && !isPlayingRef.current && audioRef.current) {
      if (ctx.state === 'suspended') ctx.resume();
      audioRef.current.play();
      isPlayingRef.current = true; setIsPlaying(true); startSpin(); startProgressTick(); return;
    }

    tearDown();
    const audio = new Audio('/music/' + track.file);
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;
    const src = ctx.createMediaElementSource(audio);
    src.connect(analyser);
    sourceRef.current = src;

    audio.onended = () => {
      stopSpin(); stopProgressTick(); setProgress(0);
      if (isLoopingRef.current) {
        const idx = TRACKS.findIndex(t => t.id === activeIdRef.current);
        playTrack(TRACKS[idx >= TRACKS.length - 1 ? 0 : idx + 1]);
      } else {
        isPlayingRef.current = false; activeIdRef.current = null;
        setIsPlaying(false); setActiveId(null);
      }
    };

    if (ctx.state === 'suspended') ctx.resume();
    audio.play(); startProgressTick();
    activeIdRef.current = track.id; isPlayingRef.current = true;
    setActiveId(track.id); setIsPlaying(true); startSpin();
  };

  const handlePlayPause = () => {
    if (!TRACKS.length) return;
    playTrack(TRACKS.find(t => t.id === activeIdRef.current) || TRACKS[0]);
  };
  const handlePrev = () => {
    if (!TRACKS.length) return;
    const idx = TRACKS.findIndex(t => t.id === activeIdRef.current);
    playTrack(TRACKS[idx <= 0 ? TRACKS.length - 1 : idx - 1]);
  };
  const handleNext = () => {
    if (!TRACKS.length) return;
    const idx = TRACKS.findIndex(t => t.id === activeIdRef.current);
    playTrack(TRACKS[idx === -1 || idx >= TRACKS.length - 1 ? 0 : idx + 1]);
  };
  const toggleLoop = () => { const n = !isLoopingRef.current; isLoopingRef.current = n; setIsLooping(n); };
  const handleSeek = (e) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const val = parseFloat(e.target.value);
    a.currentTime = val * a.duration; setProgress(val);
  };
  const fmt = (s) => {
    if (!s || !isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  useEffect(() => () => tearDown(), []);

  const activeTrack  = TRACKS.find(t => t.id === activeId);
  const activePalette = activeId != null ? PALETTE[(activeId - 1) % PALETTE.length] : null;

  return (
    <div className="music-page">
      <div className="music-grid-bg" />
      <button className="music-back" onClick={() => onNavigate?.('home')}>← HOME</button>

      <div className="music-layout">

        {/* ── Large CD ── */}
        <div className="music-disc-col">
          <motion.div
            className="music-disc"
            animate={spinControls}
            initial={{ rotate: 0 }}
            style={{ background: activePalette ? conicGrad(activePalette.disc) : conicGrad(['#1a1a2e', '#16213e', '#0f3460']) }}
          >
            <div className="music-disc-rings" />
            <div className="music-disc-label"><div className="music-disc-hole" /></div>
          </motion.div>

          <div className="music-now-playing">
            {activeTrack ? (
              <>
                <span className="music-np-title">{activeTrack.title}</span>
                <span className="music-np-artist">{activeTrack.artist}</span>
              </>
            ) : (
              <span className="music-np-artist">SELECT A TRACK</span>
            )}
          </div>

          {/* Seek */}
          <div className="music-seek-row">
            <span className="music-time">{fmt(progress * duration)}</span>
            <input className="music-seek" type="range" min={0} max={1} step={0.001}
              value={progress} onChange={handleSeek} />
            <span className="music-time">{fmt(duration)}</span>
          </div>

          {/* Transport */}
          <div className="music-transport">
            <button className="music-nav-btn" onClick={handlePrev}>◀◀</button>
            <button className="music-play-btn" onClick={handlePlayPause}>{isPlaying ? '❙❙' : '▶'}</button>
            <button className="music-nav-btn" onClick={handleNext}>▶▶</button>
            <button className={`music-loop-btn ${isLooping ? 'music-loop-btn--active' : ''}`} onClick={toggleLoop}>⟳</button>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="music-controls-col">
          <h1 className="music-heading">PLAY LIST</h1>

          {/* Cover grid */}
          <div className="music-cover-grid">
            {TRACKS.map((track) => (
              <CoverCard
                key={track.id}
                track={track}
                palette={PALETTE[(track.id - 1) % PALETTE.length]}
                isActive={activeId === track.id}
                isPlaying={isPlaying}
                onClick={() => playTrack(track)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Freq bar — full width, below the entire layout */}
      <div className="music-bars-row">
        <AudioBars analyser={analyserRef.current} isPlaying={isPlaying} accentColor={activePalette?.disc[2] ?? '#4FA8FF'} />
      </div>
    </div>
  );
}
