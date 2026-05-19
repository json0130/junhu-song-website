import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TRACKS } from '../data/tracks';
import AudioBars from './AudioBars';
import './Playlist.css';

export default function Playlist({ onAnalyserReady, onNavigate }) {
  const [activeId,  setActiveId]  = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress,  setProgress]  = useState(0);   // 0–1
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
    onAnalyserReady?.(analyser);
  };

  const startSpin = () => {
    spinControls.start({
      rotate: [null, -3600],
      transition: { duration: 20, ease: 'linear', repeat: Infinity },
    });
  };
  const stopSpin = () => spinControls.stop();

  const startProgressTick = () => {
    const tick = () => {
      const a = audioRef.current;
      if (a && a.duration) {
        setProgress(a.currentTime / a.duration);
        setDuration(a.duration);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopProgressTick = () => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const tearDown = () => {
    stopProgressTick();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current = null;
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch (_) {}
      sourceRef.current = null;
    }
    setProgress(0);
    setDuration(0);
  };

  const playTrack = (track) => {
    initAudio();
    const ctx      = ctxRef.current;
    const analyser = analyserRef.current;

    // Same track while playing → pause
    if (activeIdRef.current === track.id && isPlayingRef.current) {
      audioRef.current.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
      stopSpin();
      stopProgressTick();
      return;
    }

    // Same track while paused → resume
    if (activeIdRef.current === track.id && !isPlayingRef.current && audioRef.current) {
      if (ctx.state === 'suspended') ctx.resume();
      audioRef.current.play();
      isPlayingRef.current = true;
      setIsPlaying(true);
      startSpin();
      startProgressTick();
      return;
    }

    // New track
    tearDown();

    const audio = new Audio('/music/' + track.file);
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const src = ctx.createMediaElementSource(audio);
    src.connect(analyser);
    sourceRef.current = src;

    audio.onended = () => {
      stopSpin();
      stopProgressTick();
      setProgress(0);
      // Loop playlist: advance to next track, wrap around
      if (isLoopingRef.current) {
        const currentIdx = TRACKS.findIndex(t => t.id === activeIdRef.current);
        const nextIdx = currentIdx >= TRACKS.length - 1 ? 0 : currentIdx + 1;
        playTrack(TRACKS[nextIdx]);
      } else {
        isPlayingRef.current = false;
        activeIdRef.current  = null;
        setIsPlaying(false);
        setActiveId(null);
      }
    };

    if (ctx.state === 'suspended') ctx.resume();
    audio.play();
    startProgressTick();

    activeIdRef.current  = track.id;
    isPlayingRef.current = true;
    setActiveId(track.id);
    setIsPlaying(true);
    startSpin();
  };

  const handlePlayPause = () => {
    if (TRACKS.length === 0) return;
    const current = TRACKS.find(t => t.id === activeIdRef.current) || TRACKS[0];
    playTrack(current);
  };

  const handlePrev = () => {
    if (TRACKS.length === 0) return;
    const idx = TRACKS.findIndex(t => t.id === activeIdRef.current);
    const prevIdx = idx <= 0 ? TRACKS.length - 1 : idx - 1;
    playTrack(TRACKS[prevIdx]);
  };

  const handleNext = () => {
    if (TRACKS.length === 0) return;
    const idx = TRACKS.findIndex(t => t.id === activeIdRef.current);
    const nextIdx = idx === -1 || idx >= TRACKS.length - 1 ? 0 : idx + 1;
    playTrack(TRACKS[nextIdx]);
  };

  const handleStop = () => {
    tearDown();
    activeIdRef.current  = null;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setActiveId(null);
    stopSpin();
  };

  const toggleLoop = () => {
    const next = !isLoopingRef.current;
    isLoopingRef.current = next;
    if (audioRef.current) audioRef.current.loop = next;
    setIsLooping(next);
  };

  const handleSeek = (e) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const val = parseFloat(e.target.value);
    a.currentTime = val * a.duration;
    setProgress(val);
  };

  const fmt = (s) => {
    if (!s || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  useEffect(() => () => tearDown(), []);

  const activeTrack = TRACKS.find(t => t.id === activeId);

  return (
    <div className="pl-wrap">
      {/* ── CD disc ── */}
      <div className="pl-disc-area">
        <motion.div
          className="pl-disc"
          animate={spinControls}
          initial={{ rotate: 0 }}
        >
          <div className="pl-disc-rings" />
          <div className="pl-disc-label">
            <div className="pl-disc-hole" />
          </div>
        </motion.div>
      </div>

      {/* ── Track list ── */}
      <div className="pl-body">
        <div className="pl-title-row">
          <span
            className={`pl-main-title ${onNavigate ? 'pl-main-title--link' : ''}`}
            onClick={() => onNavigate?.('music')}
          >PLAY LIST</span>
        </div>

        <div className="pl-list">
          {TRACKS.map((track, i) => {
            const isActive = activeId === track.id;
            return (
              <div
                key={track.id}
                className={`pl-row ${isActive ? 'pl-row--active' : ''}`}
                onClick={() => playTrack(track)}
              >
                <span className="pl-row-num">{i + 1}</span>
                <span className="pl-row-title">{track.title.toUpperCase()}</span>
                {isActive && isPlaying && <span className="pl-row-playing">▶</span>}
              </div>
            );
          })}
        </div>

        {/* Bottom info */}
        <div className="pl-info-row">
          <div className="pl-track-info">
            {activeTrack ? (
              <>
                <span className="pl-track-num">TRACK #{activeId}</span>
                <span className="pl-track-name">{activeTrack.artist.toUpperCase()}</span>
              </>
            ) : (
              <>
                <span className="pl-track-num">TRACK #—</span>
                <span className="pl-track-name">SELECT A TRACK</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Transport + seek ── */}
      <div className="pl-controls">
        {/* Seek bar */}
        <div className="pl-seek-row">
          <span className="pl-time">{fmt(progress * duration)}</span>
          <input
            className="pl-seek"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={handleSeek}
          />
          <span className="pl-time">{fmt(duration)}</span>
        </div>

        {/* Buttons */}
        <div className="pl-transport">
          <button className="pl-nav-btn" onClick={handlePrev} aria-label="Previous">◀◀</button>
          <button className="pl-play-btn" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '❙❙' : '▶'}
          </button>
          <button className="pl-nav-btn" onClick={handleNext} aria-label="Next">▶▶</button>
          <button className={`pl-loop-btn ${isLooping ? 'pl-loop-btn--active' : ''}`} onClick={toggleLoop} aria-label="Loop">⟳</button>
        </div>

        {/* Visualiser */}
        <AudioBars analyser={analyserRef.current} isPlaying={isPlaying} />
      </div>
    </div>
  );
}
