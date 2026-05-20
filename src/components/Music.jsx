import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TRACKS } from '../data/tracks';
import { PALETTE, conicGrad } from '../data/palette';
import AudioBars from './AudioBars';
import { useAudio } from '../context/AudioContext';
import './Music.css';

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

const fmt = (s) => {
  if (!s || !isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
};

export default function Music({ onNavigate }) {
  const {
    activeId, isPlaying, isLooping, progress, duration, analyser,
    playTrack, handlePlayPause, handlePrev, handleNext, toggleLoop, handleSeek,
  } = useAudio();

  const spinControls = useAnimation();

  useEffect(() => {
    if (isPlaying) {
      spinControls.start({
        rotate: [null, -3600],
        transition: { duration: 20, ease: 'linear', repeat: Infinity },
      });
    } else {
      spinControls.stop();
    }
  }, [isPlaying]);

  const activeTrack   = TRACKS.find(t => t.id === activeId);
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
              value={progress} onChange={(e) => handleSeek(parseFloat(e.target.value))} />
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
        <AudioBars analyser={analyser} isPlaying={isPlaying} accentColor={activePalette?.disc[2] ?? '#4FA8FF'} />
      </div>
    </div>
  );
}
