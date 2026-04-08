import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Photos.css';

// Placeholder photo data - user can replace with real photos
const PHOTOS = [
  { id: 1, label: 'NUS Exchange – Singapore', sub: 'Jul–Dec 2024', span: 'wide', color: '#2D3A4A' },
  { id: 2, label: 'CARES Robotics Lab', sub: 'Research 2024', span: 'tall', color: '#1A2A3A' },
  { id: 3, label: 'WRO Robotics Competition', sub: 'Oct 2022', span: 'normal', color: '#2A3A2A' },
  { id: 4, label: 'IEEE RO-MAN 2025', sub: 'Netherlands', span: 'normal', color: '#3A2A1A' },
  { id: 5, label: 'Graduation & Ceremony', sub: '2025', span: 'normal', color: '#1A1A3A' },
  { id: 6, label: 'Robotics Olympiad Coaching', sub: '2022–2024', span: 'wide', color: '#2A1A3A' },
  { id: 7, label: 'Auckland City', sub: 'Home Base', span: 'normal', color: '#1A3A3A' },
  { id: 8, label: 'Kaggle Hackathon', sub: '2023', span: 'tall', color: '#3A3A1A' },
];

export default function Photos() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="photos-page section-page">
      <div className="photos-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="photos-header"
        >
          <div className="section-label">FILE_05 // PHOTOS</div>
          <h2 className="section-title">Gallery.</h2>
          <p className="photos-note">Moments from research, competitions, and travels. Photos coming soon!</p>
        </motion.div>

        <div className="photo-grid">
          {PHOTOS.map((p, i) => (
            <motion.div
              key={p.id}
              className={`photo-item photo-${p.span}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              onClick={() => setSelected(p)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="photo-placeholder" style={{ background: p.color }}>
                <div className="photo-placeholder-grid" />
                <div className="photo-info">
                  <div className="photo-label">{p.label}</div>
                  <div className="photo-sub">{p.sub}</div>
                </div>
                <div className="photo-hover-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-9 9M3 21l9-9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="lightbox-card"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="lightbox-img" style={{ background: selected.color }}>
                <div className="photo-placeholder-grid" />
                <div className="lightbox-placeholder-text">Photo Placeholder</div>
              </div>
              <div className="lightbox-info">
                <div className="lightbox-title">{selected.label}</div>
                <div className="lightbox-sub">{selected.sub}</div>
              </div>
              <button className="lightbox-close" onClick={() => setSelected(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
