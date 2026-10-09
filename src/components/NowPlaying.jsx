import { useAudio } from '../context/AudioContext';
import { TRACKS } from '../data/tracks';
import { trackLabel } from '../data/trackLabel';
import './NowPlaying.css';

// "What's playing" bar: title, artist, transport and a link to the full playlist page.
export default function NowPlaying({ onNavigate }) {
  const audio = useAudio();
  const { activeId, isPlaying, progress, handlePlayPause, handlePrev, handleNext } = audio || {};
  const track = trackLabel(TRACKS.find((t) => t.id === activeId));

  return (
    <div className={`np ${isPlaying ? 'is-playing' : ''}`}>
      <div className="np-eq" aria-hidden="true"><i /><i /><i /><i /></div>

      <div className="np-text">
        <span className="np-label mono-tiny">{track ? (isPlaying ? 'NOW PLAYING' : 'PAUSED') : 'NOTHING PLAYING'}</span>
        <span className="np-title">{track ? track.title : 'Press play, or click the object above'}</span>
        {track?.artist && <span className="np-artist">{track.artist}</span>}
      </div>

      <div className="np-ctrl">
        <button type="button" onClick={handlePrev} aria-label="Previous track">◀◀</button>
        <button type="button" className="is-main" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? '❙❙' : '▶'}</button>
        <button type="button" onClick={handleNext} aria-label="Next track">▶▶</button>
      </div>

      <button type="button" className="np-open mono-tiny" onClick={() => onNavigate?.('music')}>PLAYLIST →</button>
      <div className="np-progress" aria-hidden="true"><i style={{ width: `${(progress || 0) * 100}%` }} /></div>
    </div>
  );
}
