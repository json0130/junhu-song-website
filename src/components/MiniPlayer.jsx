import { AnimatePresence, motion } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { TRACKS } from '../data/tracks';
import { trackLabel } from '../data/trackLabel';
import './MiniPlayer.css';

// Small pop-up, top right of every page except Home: a Home button, plus the current song once
// something is playing. Clicking the song title opens the full playlist page.
export default function MiniPlayer({ activePage, onNavigate }) {
  const { activeId, isPlaying, handlePlayPause, handleNext } = useAudio() || {};
  const track = trackLabel(TRACKS.find((t) => t.id === activeId));
  const showSong = track && activePage !== 'music';

  return (
    <AnimatePresence>
      {activePage !== 'home' && (
        <motion.div
          key="mini"
          className={`mini ${isPlaying ? 'is-playing' : ''}`}
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <button type="button" className="mini-home" onClick={() => onNavigate('home')} aria-label="Back to home" title="Home">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1h-3.5v-5h-5v5H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </button>

          <AnimatePresence initial={false}>
            {showSong && (
              <motion.div
                key="song"
                className="mini-song"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className="mini-eq" aria-hidden="true"><i /><i /><i /></div>
                <button type="button" className="mini-title" onClick={() => onNavigate('music')} title="Open playlist">
                  <span className="mini-name">{track.title}</span>
                  {track.artist && <span className="mini-artist">{track.artist}</span>}
                </button>
                <button type="button" className="mini-btn" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? '❙❙' : '▶'}
                </button>
                <button type="button" className="mini-btn" onClick={handleNext} aria-label="Next song">▶▶</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
