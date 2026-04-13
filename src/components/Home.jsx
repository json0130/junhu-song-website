import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import MusicLED from './MusicLED';
import Playlist from './Playlist';
import './Home.css';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
};

const STATS = [
  { value: '92%', label: 'GPA' },
  { value: '5+', label: 'Scholarships' },
  { value: '3+', label: 'Years Research' },
  { value: '2026', label: 'Masters' },
];

export default function Home({ onNavigate }) {
  const [analyser, setAnalyser] = useState(null);
  const handleAnalyser = useCallback((node) => setAnalyser(node), []);

  return (
    <div className="home-page">
      {/* Decorative background grid */}
      <div className="home-grid-bg" />

      {/* Blue glow blob */}
      <div className="home-blob" />

      <div className="home-content">
        <motion.div
          className="home-left"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="home-eyebrow">
            <span className="mono-tag">JUNHU SONG</span>
            <span className="dot-sep" />
            <span className="mono-tag">AUCKLAND, NZ</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="home-title">
            AI & Robotics<br />
            Engineer<span className="title-accent">.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="home-subtitle">
            BE(Hons) Software Engineering @ UoA<br />
            Research Assistant · ML & AI · Robotics
          </motion.p>

          <motion.div variants={fadeUp} className="home-tags">
            {['PyTorch', 'Computer Vision', 'React', 'Deep Learning', 'NLP'].map(t => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="home-stats">
            {STATS.map(s => (
              <div className="stat-item" key={s.label}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>

        {/* Right side — scatter canvas */}
        <motion.div
          className="home-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Card stack — top-left, unchanged */}
          <div className="home-card-stack">
            {/* LinkedIn card */}
            <a
              href="https://linkedin.com/in/junhu-song"
              target="_blank"
              rel="noopener noreferrer"
              className="preview-card card-1 pc-link"
            >
              <div className="pc-label mono-tiny">CONNECT //</div>
              <div className="pc-icon-row">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="6" fill="#0A66C2"/>
                  <path d="M8 11h2.8v9H8v-9zm1.4-4.5a1.6 1.6 0 110 3.2 1.6 1.6 0 010-3.2zM13 11h2.7v1.2h.04C16.17 11.45 17.2 11 18.4 11c2.9 0 3.4 1.9 3.4 4.4V20h-2.8v-4c0-1-.02-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2V20H13v-9z" fill="white"/>
                </svg>
                <div className="pc-link-text">
                  <div className="pc-link-name">Junhu Song</div>
                  <div className="pc-link-handle">linkedin.com/in/junhu-song</div>
                </div>
              </div>
              <div className="pc-bar blue" style={{ marginTop: 10 }} />
              <div className="pc-cta mono-tiny">VIEW PROFILE →</div>
            </a>

            {/* GitHub card */}
            <a
              href="https://github.com/json0130"
              target="_blank"
              rel="noopener noreferrer"
              className="preview-card card-2 pc-link"
            >
              <div className="pc-label mono-tiny">CODE //</div>
              <div className="pc-icon-row">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#24292e"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 3C7.03 3 3 7.03 3 12c0 3.97 2.58 7.35 6.16 8.54.45.08.61-.2.61-.43v-1.52c-2.5.54-3.03-1.2-3.03-1.2-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.37 2.1.97 2.61.74.08-.58.31-.97.57-1.19-1.99-.23-4.09-1-4.09-4.44 0-.98.35-1.78.93-2.41-.09-.23-.4-1.14.09-2.37 0 0 .76-.24 2.5.93a8.7 8.7 0 012.27-.3c.77 0 1.55.1 2.27.3 1.74-1.17 2.5-.93 2.5-.93.49 1.23.18 2.14.09 2.37.58.63.93 1.43.93 2.41 0 3.45-2.1 4.2-4.1 4.43.32.28.61.82.61 1.65v2.45c0 .24.16.52.62.43C18.42 19.35 21 15.97 21 12c0-4.97-4.03-9-9-9z" fill="white"/>
                </svg>
                <div className="pc-link-text">
                  <div className="pc-link-name">json0130</div>
                  <div className="pc-link-handle">github.com/json0130</div>
                </div>
              </div>
              <div className="pc-bar" style={{ marginTop: 10 }} />
              <div className="pc-lines" style={{ marginTop: 6 }}>
                <div className="pc-line w-70" />
                <div className="pc-line w-50" />
              </div>
              <div className="pc-cta mono-tiny">VIEW REPOS →</div>
            </a>

            {/* Contact / Email card */}
            <a
              href="mailto:jaysong.0130@gmail.com"
              className="preview-card card-3 pc-link"
            >
              <div className="pc-label mono-tiny">CONTACT //</div>
              <div className="pc-icon-row">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="6" fill="var(--blue)"/>
                  <path d="M6 9.5l8 5.5 8-5.5M6 9.5h16v10H6V9.5z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="pc-link-text">
                  <div className="pc-link-name">Say Hello</div>
                  <div className="pc-link-handle">jaysong.0130@gmail.com</div>
                </div>
              </div>
              <div className="pc-bar" style={{ marginTop: 10, background: 'var(--blue)' }} />
              <div className="pc-cta mono-tiny">SEND EMAIL →</div>
            </a>
          </div>

          {/* Playlist — pinned card, top-right */}
          <div className="scattered-playlist">
            <div className="scatter-tape" />
            <Playlist onAnalyserReady={handleAnalyser} />
          </div>

          {/* LED strips — floating device, below playlist */}
          <div className="scattered-led">
            <MusicLED analyser={analyser} />
          </div>

          {/* View Projects — editorial dark stamp */}
          <button className="scatter-stamp scatter-stamp--projects" onClick={() => onNavigate('projects')}>
            <span className="scatter-stamp-text">VIEW<br />PROJECTS</span>
            <span className="scatter-stamp-sub">///</span>
          </button>

          {/* About Me — bordered pill label */}
          <button className="scatter-label scatter-label--about" onClick={() => onNavigate('about')}>
            ABOUT ME →
          </button>
        </motion.div>
      </div>

      {/* Bottom strip */}
      <div className="home-footer-strip">
        <span className="mono-tiny">jaysong.0130@gmail.com</span>
        <span className="mono-tiny grey">·</span>
        <span className="mono-tiny">github.com/json0130</span>
        <span className="mono-tiny grey">·</span>
        <span className="mono-tiny">linkedin.com/junhu-song</span>
      </div>
    </div>
  );
}
