import { useState, useRef, useCallback } from 'react';
import './Playlist.css';

const TRACKS = [
  { id: 1, title: 'Blinding Lights',    artist: 'The Weeknd',   duration: '3:20' },
  { id: 2, title: 'Levitating',          artist: 'Dua Lipa',     duration: '3:23' },
  { id: 3, title: 'Stay',               artist: 'Kid LAROI',     duration: '2:21' },
  { id: 4, title: 'Peaches',            artist: 'Justin Bieber', duration: '3:18' },
  { id: 5, title: 'good 4 u',           artist: 'Olivia Rodrigo','duration': '2:58' },
];

/**
 * Playlist — shows mock tracks. When a track is played it creates an
 * AudioContext source and calls onAnalyserReady(analyserNode) so the
 * parent can wire it to the MusicLED strip.
 */
export default function Playlist({ onAnalyserReady }) {
  const [activeId, setActiveId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef     = useRef(null);
  const ctxRef       = useRef(null);
  const sourceRef    = useRef(null);
  const analyserRef  = useRef(null);

  const initAudio = useCallback(() => {
    if (ctxRef.current) return; // already set up

    const ctx      = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(ctx.destination);

    ctxRef.current      = ctx;
    analyserRef.current = analyser;
    onAnalyserReady?.(analyser);
  }, [onAnalyserReady]);

  const handlePlay = (track) => {
    initAudio();

    const ctx      = ctxRef.current;
    const analyser = analyserRef.current;

    if (activeId === track.id && isPlaying) {
      // Pause current
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    // Disconnect previous source
    sourceRef.current?.disconnect();

    // For demo purposes: play a silent oscillator tied to the analyser
    // (real usage: swap for <audio src="..."> files in /public/audio/)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create a demo tone so the LED reacts visually without needing audio files
    const osc       = ctx.createOscillator();
    const gain      = ctx.createGain();
    // Vary frequency per track so LED shows different colors
    const freqs     = [80, 440, 1200, 3000, 6000];
    osc.frequency.value = freqs[(track.id - 1) % freqs.length];
    osc.type = ['sine','square','triangle','sawtooth','sine'][(track.id - 1) % 5];
    gain.gain.value = 0.04; // very quiet — just for analysis

    osc.connect(gain);
    gain.connect(analyser);
    osc.start();

    // Store osc as "source" so we can stop it later
    sourceRef.current = { disconnect: () => { osc.stop(); osc.disconnect(); gain.disconnect(); } };

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume();

    setActiveId(track.id);
    setIsPlaying(true);
  };

  const handleStop = () => {
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    setIsPlaying(false);
    setActiveId(null);
    onAnalyserReady?.(null);
  };

  return (
    <div className="playlist">
      <div className="pl-header">
        <span className="pl-label">PLAYLIST //</span>
        <span className="pl-led-hint">LED REACTIVE</span>
      </div>

      <div className="pl-tracks">
        {TRACKS.map((track, i) => {
          const isActive = activeId === track.id;
          return (
            <div
              key={track.id}
              className={`pl-track ${isActive ? 'pl-track--active' : ''}`}
              onClick={() => handlePlay(track)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handlePlay(track)}
            >
              <span className="pl-num">{String(i + 1).padStart(2, '0')}</span>

              <div className="pl-info">
                <span className="pl-title">{track.title}</span>
                <span className="pl-artist">{track.artist}</span>
              </div>

              <span className="pl-dur">{track.duration}</span>

              <div className="pl-play-icon">
                {isActive && isPlaying ? (
                  /* Pause bars */
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor"/>
                    <rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor"/>
                  </svg>
                ) : (
                  /* Play triangle */
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 1l9 5-9 5V1z" fill="currentColor"/>
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeId && (
        <div className="pl-footer">
          <span className="pl-now-label">NOW PLAYING</span>
          <span className="pl-now-title">
            {TRACKS.find(t => t.id === activeId)?.title}
          </span>
          <button className="pl-stop" onClick={handleStop} aria-label="Stop">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
