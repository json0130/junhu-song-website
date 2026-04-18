import { useState } from 'react';
import { motion } from 'framer-motion';
import './FolderNav.css';

const TABS = [
  { id: 'home',         label: 'HOME',     code: 'FILE_00//', sub: 'Landing'  },
  { id: 'about',        label: 'ABOUT',    code: 'FILE_01//', sub: 'Profile'  },
  { id: 'achievements', label: 'ARCHIVE',  code: 'FILE_02//', sub: 'Awards'   },
  { id: 'projects',     label: 'PROJECTS', code: 'FILE_03//', sub: 'Works'    },
  { id: 'experience',   label: 'LOG',      code: 'FILE_04//', sub: 'Timeline' },
  { id: 'photos',       label: 'GALLERY',  code: 'FILE_05//', sub: 'Photos'   },
];

const EAR_TOPS = [8, 22, 36, 50, 64, 78];
// Random stack offsets — fixed so they don't re-randomise on re-render
const STACK_OFFSETS = [0, 18, 6, 30, 12, 24];

export default function FolderNav({ activePage, onNavigate }) {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [exiting,    setExiting]    = useState(null);

  const handleClick = (tabId) => {
    if (tabId === activePage) return;
    setExiting(tabId);
    setTimeout(() => { onNavigate(tabId); setExiting(null); }, 600);
  };

  return (
    <div className="folder-nav">
      {TABS.map((tab, i) => {
        const isActive  = tab.id === activePage;
        const isHovered = hoveredTab === tab.id;

        const zIndex = exiting === tab.id ? 35
                     : isActive            ? 25
                     : isHovered           ? 1
                     : 10 - i;

        // HOME (i=0) closest to screen edge (right:0), GALLERY (i=5) furthest left
        const stackOffset = STACK_OFFSETS[i];

        return (
          <motion.div
            key={tab.id}
            className={`folder-tab ${isActive ? 'active' : ''} ${exiting === tab.id ? 'exiting' : ''}`}
            style={{ zIndex, right: stackOffset }}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            onClick={() => handleClick(tab.id)}
            initial={{ x: 90 }}
            animate={{
              x: exiting === tab.id ? 300 : 0,
              rotate: isHovered && !isActive ? -8 : 0,
            }}
            transition={{ delay: i * 0.04, duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Label panel — expands to the left on active only */}
            <motion.div
              className={`f-expanded ${isActive ? 'active' : ''}`}
              animate={{ width: isActive ? 220 : 0, opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
            >
              {isActive && <div className="f-active-bar" />}
              <span className="f-code">{tab.code}</span>
              <span className="f-label">{tab.label}</span>
              <span className="f-sub">{tab.sub}</span>
            </motion.div>

            {/* Folder spine + raised ear notch */}
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
      })}
    </div>
  );
}
