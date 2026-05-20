import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TRACKS } from '../data/tracks';
import { PALETTE, conicGrad, DEFAULT_DISC } from '../data/palette';
import AudioBars from './AudioBars';
import { useAudio } from '../context/AudioContext';
import './Playlist.css';

const fmt = (s) => {
  if (!s || !isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
};

export default function Playlist({ onNavigate }) {
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
  const discBg        = activePalette ? conicGrad(activePalette.disc) : DEFAULT_DISC;
  const accentColor   = activePalette?.disc[2] ?? '#4FA8FF';

  return (
    <div className="pl-wrap">
      {/* ── CD disc ── */}
      <div className="pl-disc-area">
        <motion.div
          className="pl-disc"
          animate={spinControls}
          initial={{ rotate: 0 }}
          style={{ background: discBg }}
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
        <div className="pl-seek-row">
          <span className="pl-time">{fmt(progress * duration)}</span>
          <input
            className="pl-seek"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
          />
          <span className="pl-time">{fmt(duration)}</span>
        </div>

        <div className="pl-transport">
          <button className="pl-nav-btn" onClick={handlePrev} aria-label="Previous">◀◀</button>
          <button className="pl-play-btn" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '❙❙' : '▶'}
          </button>
          <button className="pl-nav-btn" onClick={handleNext} aria-label="Next">▶▶</button>
          <button className={`pl-loop-btn ${isLooping ? 'pl-loop-btn--active' : ''}`} onClick={toggleLoop} aria-label="Loop">⟳</button>
        </div>

        <AudioBars analyser={analyser} isPlaying={isPlaying} accentColor={accentColor} />
      </div>
    </div>
  );
}
