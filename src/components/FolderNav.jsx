import { useState, useEffect } from 'react';
import { motion, useAnimate } from 'framer-motion';
import './FolderNav.css';

const TABS = [
  { id: 'home',         label: 'HOME',     code: 'FILE_00//', sub: 'Landing'  },
  { id: 'about',        label: 'ABOUT',    code: 'FILE_01//', sub: 'Profile'  },
  { id: 'achievements', label: 'ARCHIVE',  code: 'FILE_02//', sub: 'Awards'   },
  { id: 'projects',     label: 'PROJECTS', code: 'FILE_03//', sub: 'Works'    },
  { id: 'experience',   label: 'LOG',      code: 'FILE_04//', sub: 'Timeline' },
  { id: 'photos',       label: 'GALLERY',  code: 'FILE_05//', sub: 'Photos'   },
];

const EAR_TOPS = [8, 22, 36, 50, 69, 78];
const STACK_OFFSETS = [0, 21, 7, 35, 14, 28];
const STACK_Z = [6, 3, 5, 1, 4, 2];

function FolderTab({ tab, i, isActive, isHovered, isExiting, onMouseEnter, onMouseLeave, onClick }) {
  const [scope, animate] = useAnimate();

  // Fire slide-out-and-back when this tab becomes active
  useEffect(() => {
    if (!isActive) return;
    animate(scope.current, { x: '-100vw' }, { duration: 0.5, ease: [0.76, 0, 0.24, 1] })
      .then(() => animate(scope.current, { x: 0 }, { duration: 0.5, ease: [0.76, 0, 0.24, 1] }));
  }, [isActive]);

  const zIndex = isExiting ? 35 : isHovered ? 1 : STACK_Z[i];

  return (
    <motion.div
      ref={scope}
      className={`folder-tab ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}
      style={{ zIndex, right: STACK_OFFSETS[i] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      initial={{ x: 90 }}
      animate={{
        x: isExiting ? 300 : 0,
        rotate: isHovered && !isActive ? -8 : 0,
      }}
      transition={{ delay: i * 0.04, duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className={`f-folder tab-${i} ${isActive ? 'active' : ''}`}>
        <div
          className={`f-ear tab-${i} ${isActive ? 'active' : ''}`}
          style={{ top: `${EAR_TOPS[i]}%` }}
        >
          <span className="f-ear-label">{tab.label}</span>
          {isActive && <span className="f-ear-dot" />}
        </div>
      </div>
    </motion.div>
  );
}

export default function FolderNav({ activePage, onNavigate }) {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [exiting,    setExiting]    = useState(null);

  const handleClick = (tabId) => {
    if (tabId === activePage) return;
    setExiting(tabId);
    setTimeout(() => { onNavigate(tabId); setExiting(null); }, 600);
  };

  return (
    <div className="folder-nav" data-page={activePage}>
      {TABS.map((tab, i) => (
        <FolderTab
          key={tab.id}
          tab={tab}
          i={i}
          isActive={tab.id === activePage}
          isHovered={hoveredTab === tab.id}
          isExiting={exiting === tab.id}
          onMouseEnter={() => setHoveredTab(tab.id)}
          onMouseLeave={() => setHoveredTab(null)}
          onClick={() => handleClick(tab.id)}
        />
      ))}
    </div>
  );
}
