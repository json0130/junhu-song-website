import { useState, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './Playlist.css';

const TRACKS = [
  { id: 1, title: 'Blinding Lights',  artist: 'The Weeknd'    },
  { id: 2, title: 'Levitating',        artist: 'Dua Lipa'      },
  { id: 3, title: 'Stay',             artist: 'Kid LAROI'      },
  { id: 4, title: 'Peaches',          artist: 'Justin Bieber'  },
  { id: 5, title: 'good 4 u',         artist: 'Olivia Rodrigo' },
  { id: 6, title: 'Heat Waves',       artist: 'Glass Animals'  },
  { id: 7, title: 'Levitating',       artist: 'Dua Lipa'       },
];

export default function Playlist({ onAnalyserReady }) {
  const [activeId,  setActiveId]  = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const ctxRef       = useRef(null);
  const sourceRef    = useRef(null);
  const analyserRef  = useRef(null);
  const activeIdRef  = useRef(null);
  const isPlayingRef = useRef(false);
  const spinControls = useAnimation();
  const rotationRef  = useRef(0);

  const initAudio = useCallback(() => {
    if (ctxRef.current) return;
    const AudioCtx = window.AudioContext || /** @type {any} */ (window).webkitAudioContext;
    const ctx      = new AudioCtx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(ctx.destination);
    ctxRef.current      = ctx;
    analyserRef.current = analyser;
    onAnalyserReady?.(analyser);
  }, [onAnalyserReady]);

  const startSpin = () => {
    spinControls.start({
      rotate: rotationRef.current - 3600,
      transition: { duration: 100, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
    });
  };

  const pauseSpin = async () => {
    await spinControls.stop();
  };

  const handlePlay = (track) => {
    initAudio();
    const ctx      = ctxRef.current;
    const analyser = analyserRef.current;

    // Toggle off if same track is already playing
    if (activeIdRef.current === track.id && isPlayingRef.current) {
      sourceRef.current?.disconnect();
      sourceRef.current = null;
      isPlayingRef.current = false;
      setIsPlaying(false);
      pauseSpin();
      return;
    }

    // Stop whatever is currently playing
    sourceRef.current?.disconnect();
    sourceRef.current = null;

    const osc   = ctx.createOscillator();
    const gain  = ctx.createGain();
    const freqs = [80, 440, 1200, 3000, 6000, 220, 880];
    osc.frequency.value = freqs[(track.id - 1) % freqs.length];
    osc.type = ['sine','square','triangle','sawtooth','sine','sine','square'][(track.id - 1) % 7];
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(analyser);
    osc.start();
    sourceRef.current = { disconnect: () => { try { osc.stop(); } catch(_){} osc.disconnect(); gain.disconnect(); } };

    if (ctx.state === 'suspended') ctx.resume();

    activeIdRef.current  = track.id;
    isPlayingRef.current = true;
    setActiveId(track.id);
    setIsPlaying(true);
    startSpin();
  };

  const handleStop = () => {
    sourceRef.current?.disconnect();
    sourceRef.current    = null;
    activeIdRef.current  = null;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setActiveId(null);
    pauseSpin();
    onAnalyserReady?.(null);
  };

  const activeTrack = TRACKS.find(t => t.id === activeId);

  return (
    <div className="pl-wrap">
      {/* ── CD disc — half visible, transparent bg ── */}
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

        {/* Play / stop button centred on the visible disc */}
        <button
          className={`pl-disc-btn ${isPlaying ? 'pl-disc-btn--playing' : ''}`}
          onClick={() => {
            if (isPlaying) handleStop();
            else handlePlay(TRACKS.find(t => t.id === activeId) || TRACKS[0]);
          }}
          aria-label={isPlaying ? 'Stop' : 'Play'}
        >
          {isPlaying ? '■' : '▶'}
        </button>
      </div>

      {/* ── Track list ── */}
      <div className="pl-body">
        <div className="pl-title-row">
          <span className="pl-main-title">PLAY LIST</span>
        </div>

        <div className="pl-list">
          {TRACKS.map((track, i) => {
            const isActive = activeId === track.id;
            return (
              <div
                key={track.id}
                className={`pl-row ${isActive ? 'pl-row--active' : ''}`}
                onClick={() => handlePlay(track)}
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
          {activeTrack ? (
            <>
              <button className="pl-stop-btn" onClick={handleStop}>■ STOP</button>
              <div className="pl-track-info">
                <span className="pl-track-num">TRACK #{activeId}</span>
                <span className="pl-track-name">{activeTrack.artist.toUpperCase()}</span>
              </div>
            </>
          ) : (
            <div className="pl-track-info">
              <span className="pl-track-num">TRACK #—</span>
              <span className="pl-track-name">SELECT A TRACK</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
