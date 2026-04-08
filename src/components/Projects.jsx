import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Projects.css';

const PROJECTS = [
  {
    id: 'chatbox',
    code: 'PRJ_001',
    title: 'ChatBox V2',
    subtitle: 'Emotion Understanding Companion Robot',
    desc: 'Developed an EfficientNet V2-S emotion classifier achieving 81% validation accuracy across 7 emotion categories for child-robot interaction. Features distributed processing via Jetson Nano and real-time WebSocket communication.',
    tags: ['PyTorch', 'EfficientNet', 'WebSocket', 'Jetson Nano', 'Computer Vision'],
    type: 'RESEARCH',
    year: '2024',
  },
  {
    id: 'sign-lang',
    code: 'PRJ_002',
    title: 'Sign Language AI',
    subtitle: 'Real-time ASL Recognition with GUI',
    desc: 'Built a PyQt training platform with model selection and real-time webcam testing. Achieved 97%+ accuracy across CNN architectures with data augmentation. Features live probability distribution overlay.',
    tags: ['CNN', 'PyQt', 'OpenCV', 'Python', 'Deep Learning'],
    type: 'RESEARCH',
    year: '2023',
  },
  {
    id: 'rag-pipeline',
    code: 'PRJ_003',
    title: 'Multi-Robot RAG System',
    subtitle: 'Scalable Multi-Client Communication',
    desc: 'Redesigned server infrastructure for multi-robot deployment with dedicated client instances. Built scalable RAG pipeline with FAISS vector DB enabling personalized interactions. PostgreSQL/Supabase backend.',
    tags: ['FAISS', 'RAG', 'PostgreSQL', 'WebSocket', 'Supabase'],
    type: 'RESEARCH',
    year: '2024',
  },
  {
    id: 'ring',
    code: 'PRJ_004',
    title: 'RING Platform',
    subtitle: 'University Club & Event Management',
    desc: 'Full-stack MERN web application for university club and event management. Features Google OAuth authentication, real-time updates, and an intuitive event discovery interface.',
    tags: ['React', 'Node.js', 'MongoDB', 'Google OAuth', 'Express'],
    type: 'WEB APP',
    year: '2024',
  },
  {
    id: 'cpnz',
    code: 'PRJ_005',
    title: 'CPNZ Patrol App',
    subtitle: 'WDCC x Community Patrol NZ',
    desc: 'Full-stack web application for CPNZ patrol services with responsive UI/UX built in React and Tailwind. Integrated Supabase for authentication and real-time data syncing.',
    tags: ['React', 'Tailwind', 'Supabase', 'TypeScript'],
    type: 'WEB APP',
    year: '2024',
  },
  {
    id: 'leetcode',
    code: 'PRJ_006',
    title: 'LeetCode with Peer',
    subtitle: 'Real-time Coding Collaboration',
    desc: 'Real-time coding collaboration web app featuring ChatGPT integration and live peer chat. Built for pair programming and competitive coding preparation with synchronized code editors.',
    tags: ['React', 'WebSocket', 'ChatGPT API', 'Node.js'],
    type: 'WEB APP',
    year: '2023',
  },
];

export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next) => {
    const n = (next + PROJECTS.length) % PROJECTS.length;
    setDir(next > activeIdx || (activeIdx === PROJECTS.length - 1 && next === 0) ? 1 : -1);
    setActiveIdx(n);
  };

  const selectCard = (i) => {
    setDir(i > activeIdx ? 1 : -1);
    setActiveIdx(i);
  };

  const active = PROJECTS[activeIdx];

  return (
    <div className="projects-page section-page">
      <div className="projects-inner">
        {/* Left: info panel */}
        <div className="projects-info">
          <div className="section-label">FILE_03 // PROJECTS</div>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active.id}
              custom={dir}
              initial={{ opacity: 0, y: dir * 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dir * -30 }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="project-detail"
            >
              <div className="project-meta">
                <span className="tag">{active.type}</span>
                <span className="mono-tiny">{active.year}</span>
              </div>
              <div className="project-code mono-tiny blue-t">{active.code}</div>
              <h2 className="section-title" style={{ marginBottom: 8 }}>{active.title}</h2>
              <div className="project-subtitle">{active.subtitle}</div>
              <p className="project-desc">{active.desc}</p>
              <div className="project-tags">
                {active.tags.map(t => <span className="tag" key={t}>{t}</span>)}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="reel-controls">
            <button className="reel-btn" onClick={() => go(activeIdx - 1)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="reel-counter">
              <span className="reel-num">{String(activeIdx + 1).padStart(2, '0')}</span>
              <span className="reel-sep">/</span>
              <span className="reel-total">{String(PROJECTS.length).padStart(2, '0')}</span>
            </div>
            <button className="reel-btn" onClick={() => go(activeIdx + 1)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Right: film reel */}
        <div className="reel-stage">
          <div className="reel-clip">
            <div className="reel-wheel">
              {/* Decorative rings — visible white/grey concentric circles */}
              <div className="reel-ring reel-ring-1" />
              <div className="reel-ring reel-ring-2" />
              <div className="reel-ring reel-ring-3" />
              <div className="reel-ring reel-ring-4" />
              <div className="reel-ring reel-ring-5" />

              {/* Center hub */}
              <div className="reel-hub">
                <div className="reel-hub-inner" />
                <div className="reel-hub-ring" />
                <div className="reel-hub-ring reel-hub-ring-2" />
              </div>

              {/* Spoke lines */}
              {PROJECTS.map((p, i) => {
                const angle = (i / PROJECTS.length) * 360 - (activeIdx / PROJECTS.length) * 360;
                const rad = (angle * Math.PI) / 180;
                const r = 360;
                const x = Math.sin(rad) * r;
                const y = -Math.cos(rad) * r;
                const spokeAngle = (Math.atan2(x, -y) * 180) / Math.PI;

                return (
                  <motion.div
                    key={`spoke-${p.id}`}
                    className="reel-spoke"
                    animate={{ rotate: spokeAngle, scaleY: Math.hypot(x, y) / 360 }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    style={{ height: r }}
                  />
                );
              })}

              {/* Cards */}
              {PROJECTS.map((p, i) => {
                const angle = (i / PROJECTS.length) * 360 - (activeIdx / PROJECTS.length) * 360;
                const rad = (angle * Math.PI) / 180;
                const r = 360;
                const x = Math.sin(rad) * r;
                const y = -Math.cos(rad) * r;
                const isActive = i === activeIdx;
                const dist = Math.min(Math.abs(i - activeIdx), PROJECTS.length - Math.abs(i - activeIdx));
                const opacity = dist === 0 ? 1 : dist === 1 ? 0.75 : 0.45;
                const scale = isActive ? 1.1 : dist === 1 ? 0.92 : 0.82;

                return (
                  <motion.div
                    key={p.id}
                    className={`reel-card ${isActive ? 'reel-card-active' : ''}`}
                    animate={{ x, y, opacity, scale }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    onClick={() => selectCard(i)}
                  >
                    <div className="reel-card-inner">
                      <div className="reel-card-code">{p.code}</div>
                      <div className="reel-card-title">{p.title}</div>
                      <div className="reel-card-subtitle">{p.subtitle}</div>
                      <div className="reel-card-type">{p.type}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="reel-hint">
            <span className="mono-tiny">CLICK A CARD OR TURN THE REEL</span>
            <div className="reel-dots">
              {PROJECTS.map((_, i) => (
                <div
                  key={i}
                  className={`reel-dot ${i === activeIdx ? 'reel-dot-active' : ''}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
