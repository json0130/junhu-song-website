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
      {/* Music LED strip — fixed right edge */}
      <MusicLED analyser={analyser} />

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
            Software<br />
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

          <motion.div variants={fadeUp} className="home-actions">
            <button className="btn btn-primary" onClick={() => onNavigate('projects')}>
              View Projects
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn btn-outline" onClick={() => onNavigate('about')}>
              About Me
            </button>
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

        {/* Right side — Playlist */}
        <motion.div
          className="home-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <Playlist onAnalyserReady={handleAnalyser} />

          <div className="home-scroll-hint" style={{ marginTop: 16 }}>
            <span className="mono-tiny">SELECT A FOLDER TO EXPLORE →</span>
          </div>
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
