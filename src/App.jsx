import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';

import FolderNav from './components/FolderNav';
import Home from './components/Home';
import About from './components/About';
import Achievements from './components/Achievements';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Photos from './components/Photos';

const PAGES = {
  home: Home,
  about: About,
  achievements: Achievements,
  projects: Projects,
  experience: Experience,
  photos: Photos,
};

function FolderSweep({ isAnimating }) {
  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--black)',
            zIndex: 200,
            transformOrigin: 'right center',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0, transformOrigin: 'left center' }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div style={{
            position: 'absolute',
            right: 80,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'flex-end',
          }}>
            {['FILE_00//', 'FILE_01//', 'FILE_02//', 'FILE_03//', 'FILE_04//', 'FILE_05//'].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.35, x: 0 }}
                transition={{ delay: i * 0.045, duration: 0.3 }}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'rgba(79,168,255,0.8)',
                  textTransform: 'uppercase',
                }}
              >
                {f}
              </motion.div>
            ))}
          </div>
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(to bottom, transparent, #4FA8FF, transparent)',
              boxShadow: '0 0 24px #4FA8FF',
            }}
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [displayPage, setDisplayPage] = useState('home');
  const [isSweeping, setIsSweeping] = useState(false);

  const navigate = (pageId) => {
    if (pageId === activePage || isSweeping) return;
    setIsSweeping(true);
    setActivePage(pageId);
    setTimeout(() => setDisplayPage(pageId), 320);
    setTimeout(() => setIsSweeping(false), 800);
  };

  const PageComponent = PAGES[displayPage];

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={displayPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ width: '100%', minHeight: '100vh' }}
        >
          <PageComponent onNavigate={navigate} />
        </motion.div>
      </AnimatePresence>

      <FolderNav activePage={activePage} onNavigate={navigate} />
      <FolderSweep isAnimating={isSweeping} />
    </div>
  );
}
