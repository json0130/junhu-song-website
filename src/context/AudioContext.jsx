import { createContext, useContext, useRef, useState, useCallback } from 'react';
import { TRACKS } from '../data/tracks';

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const [activeId,  setActiveId]  = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [duration,  setDuration]  = useState(0);
  const [analyser,  setAnalyser]  = useState(null);

  const ctxRef       = useRef(null);
  const audioRef     = useRef(null);
  const sourceRef    = useRef(null);
  const analyserRef  = useRef(null);
  const activeIdRef  = useRef(null);
  const isPlayingRef = useRef(false);
  const isLoopingRef = useRef(false);
  const rafRef       = useRef(null);

  const initAudio = () => {
    if (ctxRef.current) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const an = ctx.createAnalyser();
    an.fftSize = 256;
    an.connect(ctx.destination);
    ctxRef.current      = ctx;
    analyserRef.current = an;
    setAnalyser(an);
  };

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

  const playTrack = useCallback((track) => {
    initAudio();
    const ctx      = ctxRef.current;
    const analyser = analyserRef.current;

    // Same track playing → pause
    if (activeIdRef.current === track.id && isPlayingRef.current) {
      audioRef.current.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
      stopProgressTick();
      return;
    }

    // Same track paused → resume
    if (activeIdRef.current === track.id && !isPlayingRef.current && audioRef.current) {
      if (ctx.state === 'suspended') ctx.resume();
      audioRef.current.play();
      isPlayingRef.current = true;
      setIsPlaying(true);
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
      stopProgressTick();
      setProgress(0);
      if (isLoopingRef.current) {
        const idx = TRACKS.findIndex(t => t.id === activeIdRef.current);
        playTrack(TRACKS[idx >= TRACKS.length - 1 ? 0 : idx + 1]);
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
  }, []);

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

  const toggleLoop = () => {
    const next = !isLoopingRef.current;
    isLoopingRef.current = next;
    setIsLooping(next);
  };

  const handleSeek = (val) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = val * a.duration;
    setProgress(val);
  };

  return (
    <AudioCtx.Provider value={{
      activeId, isPlaying, isLooping, progress, duration, analyser,
      playTrack, handlePlayPause, handlePrev, handleNext, toggleLoop, handleSeek,
    }}>
      {children}
    </AudioCtx.Provider>
  );
}

export const useAudio = () => useContext(AudioCtx);
