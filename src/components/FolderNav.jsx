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

const EAR_TOPS = [12, 54, 22, 64, 18, 44];
const ANGLES   = [-14, -8, -2, 3, 9, 15];
const TAB_TOPS = [5, 19, 34, 50, 65, 80];

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
        const open = isHovered || isActive;
        const rad  = ANGLES[i] * (Math.PI / 180);
        const SLIDE = 30;
        const slideX = open ? -Math.cos(rad) * SLIDE : 0;
        const slideY = open ?  Math.sin(rad) * SLIDE : 0;

        return (
          <motion.div
            key={tab.id}
            className={`folder-tab ${isActive ? 'active' : ''} ${exiting === tab.id ? 'exiting' : ''}`}
            style={{ top: `${TAB_TOPS[i]}%`, zIndex: open ? 20 : 10 - i }}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            onClick={() => handleClick(tab.id)}
            initial={{ x: 90, rotate: ANGLES[i] }}
            animate={{ x: slideX, y: slideY, rotate: ANGLES[i] }}
            transition={{ delay: i * 0.05, duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Label panel — expands to the left on hover/active */}
            <motion.div
              className={`f-expanded ${isActive ? 'active' : ''}`}
              animate={{ width: open ? 220 : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
            >
              {isActive && <div className="f-active-bar" />}
              <span className="f-code">{tab.code}</span>
              <span className="f-label">{tab.label}</span>
              <span className="f-sub">{tab.sub}</span>
            </motion.div>

            {/* Folder spine + raised ear notch */}
            <div className={`f-folder ${isActive ? 'active' : ''}`}>
              <div
                className={`f-ear ${isActive ? 'active' : ''}`}
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
