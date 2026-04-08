import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FolderNav.css';

const TABS = [
  { id: 'home',         label: 'HOME',          code: 'FILE_00//', sub: 'Landing' },
  { id: 'about',        label: 'ABOUT ME',       code: 'FILE_01//', sub: 'Profile' },
  { id: 'achievements', label: 'ACHIEVEMENTS',   code: 'FILE_02//', sub: 'Awards' },
  { id: 'projects',     label: 'PROJECTS',       code: 'FILE_03//', sub: 'Works' },
  { id: 'experience',   label: 'EXPERIENCE',     code: 'FILE_04//', sub: 'Timeline' },
  { id: 'photos',       label: 'PHOTOS',         code: 'FILE_05//', sub: 'Gallery' },
];

// Per-tab stacking rotations — gives the "pile of folders" look
const STACK_ROTATES = [-2.5, 1.8, -1.5, 0.8, -1.2, 1.5];
const STACK_DX = [0, 2, -2, 1, -1, 2];

export default function FolderNav({ activePage, onNavigate }) {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [exiting, setExiting] = useState(null);

  const handleClick = (tabId) => {
    if (tabId === activePage) return;
    setExiting(tabId);
    setTimeout(() => {
      onNavigate(tabId);
      setExiting(null);
    }, 600);
  };

  return (
    <div className="folder-nav">
      {TABS.map((tab, i) => {
        const isActive = tab.id === activePage;
        const isHovered = hoveredTab === tab.id;
        const isExiting = exiting === tab.id;
        const rotate = (isHovered || isActive) ? 0 : STACK_ROTATES[i];
        const dx = (isHovered || isActive) ? 0 : STACK_DX[i];

        return (
          <motion.div
            key={tab.id}
            className={`folder-tab ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            onClick={() => handleClick(tab.id)}
            initial={{ x: 80, rotate: 0 }}
            animate={{ x: dx, rotate }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Slide-out label panel */}
            <motion.div
              className="folder-slide"
              animate={{ x: isHovered || isActive ? 0 : '100%' }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
            >
              <span className="folder-code">{tab.code}</span>
              <span className="folder-label">{tab.label}</span>
              <span className="folder-sub">{tab.sub}</span>
              {isActive && <div className="folder-active-bar" />}
            </motion.div>

            {/* Always-visible tab edge — styled like a stacked card */}
            <div className="folder-edge">
              <span className="folder-edge-label">{tab.label}</span>
              {isActive && <div className="folder-edge-dot" />}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
