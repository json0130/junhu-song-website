import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import './Experience.css';

const TIMELINE = [
  {
    year: 2022,
    role: 'BE(Hons) Software Engineering',
    org: 'University of Auckland',
    period: 'Mar 2022 – Nov 2025',
    type: 'EDUCATION',
    note: "Dean's Honour's List 2022, 2023 · GPA: 92%",
    items: ['Specialised in software engineering with ML & AI focus', "Dean's Honour's List for academic excellence"],
  },
  {
    year: 2022,
    role: 'Research Assistant',
    org: 'CARES Robotics Lab – University of Auckland',
    period: 'Feb 2022 – Present',
    type: 'RESEARCH',
    items: [
      'Designed Multi-Client Communication System for multi-robot deployment',
      'Built scalable RAG pipeline with FAISS vector DB',
      'Developed EfficientNet V2-S emotion classifier at 81% accuracy',
      'Created real-time ASL recognition system with 97%+ accuracy',
    ],
  },
  {
    year: 2022,
    role: "Dean's Honour's List",
    org: 'University of Auckland',
    period: '2022, 2023',
    type: 'AWARD',
    note: 'GPA: 92%',
    items: ['Top academic performance in the Faculty of Engineering', 'Awarded consecutively in 2022 and 2023'],
  },
  {
    year: 2022,
    role: 'International Secondary School Leaver Scholarship',
    org: 'University of Auckland',
    period: '2022',
    type: 'SCHOLARSHIP',
    note: '$20,000',
    items: ['Awarded $20,000 for outstanding academic achievement as an international student'],
  },
  {
    year: 2022,
    role: 'WRO – Future Innovator Category',
    org: 'World Robot Olympiad',
    period: '2022',
    type: 'COMPETITION',
    note: '2nd Place',
    items: ['Achieved 2nd Place in the Future Innovator category at the World Robot Olympiad'],
  },
  {
    year: 2022,
    role: 'Staff / Coach – Robotics Olympiad',
    org: 'International Robotics Olympiad',
    period: '2022 – 2024',
    type: 'EXTRA',
    items: [
      'Coached student teams across 3 consecutive years',
      'WRO Future Innovator Category: 2nd Place (2022)',
      'Mentored students in robotics design and programming',
    ],
  },
  {
    year: 2023,
    role: 'Summer Research Scholarship',
    org: 'University of Auckland',
    period: '2023',
    type: 'SCHOLARSHIP',
    note: '$7,000 – Sign Language Project',
    items: ['Funded to develop real-time ASL recognition system using CNN architectures', 'Achieved 97%+ recognition accuracy with data augmentation'],
  },
  {
    year: 2023,
    role: 'Kaggle Competitions',
    org: 'Kaggle',
    period: '2023, 2024',
    type: 'COMPETITION',
    note: 'Multiple Bronze Medals',
    items: ['Competed in multiple ML competitions on Kaggle', 'Earned Bronze Medals in image classification and NLP tasks'],
  },
  {
    year: 2024,
    role: 'Exchange – Computer Science',
    org: 'National University of Singapore',
    period: 'Jul 2024 – Dec 2024',
    type: 'EDUCATION',
    items: ['Studied advanced CS topics at a top-10 global university', 'Focused on AI, systems and distributed computing modules'],
  },
  {
    year: 2024,
    role: 'Frontend Developer',
    org: 'WDCC x Community Patrol NZ',
    period: 'Mar 2024 – Oct 2024',
    type: 'INDUSTRY',
    items: [
      'Built full-stack web application for CPNZ patrol services using React and Tailwind',
      'Integrated Supabase for authentication and real-time data syncing',
      'Designed responsive UI/UX with seamless user interactions',
    ],
  },
  {
    year: 2024,
    role: '360 International Exchange Award',
    org: 'NUS Singapore',
    period: '2024',
    type: 'SCHOLARSHIP',
    note: '$1,800',
    items: ['Awarded $1,800 to support international exchange study at NUS Singapore'],
  },
  {
    year: 2025,
    role: 'IEEE RO-MAN 2025 Robot Design Competition',
    org: 'Netherlands',
    period: '2025',
    type: 'COMPETITION',
    note: 'Accepted',
    items: ['Accepted to compete at the IEEE RO-MAN international robotics conference in the Netherlands'],
  },
  {
    year: 2025,
    role: 'Teaching Assistant – Deep Neural Networks',
    org: 'COMPSYS 302 – University of Auckland',
    period: '2025',
    type: 'TEACHING',
    items: [
      'Assisted students with deep learning concepts, assignments, and lab sessions',
      'Topics: CNNs, RNNs, Transformers, PyTorch implementation',
    ],
  },
  {
    year: 2025,
    role: 'Teaching Assistant – Digital Systems',
    org: 'ENGGEN 299 – University of Auckland',
    period: '2025',
    type: 'TEACHING',
    items: [
      'Supported students in hardware programming and digital systems design',
      'Conducted lab sessions on FPGA programming and circuit design',
    ],
  },
  {
    year: 2026,
    role: 'Master of Engineering (Robotics & AI)',
    org: 'University of Auckland',
    period: 'Mar 2026 – Nov 2026',
    type: 'EDUCATION',
    items: ['Pursuing specialisation in Robotics & AI at the University of Auckland', 'Focus on human-robot interaction and advanced ML systems'],
  },
];

const TYPE_COLORS = {
  EDUCATION:   '#A78BFA',
  RESEARCH:    '#4FA8FF',
  INDUSTRY:    '#A8E6A3',
  TEACHING:    '#C8A8FF',
  EXTRA:       '#FF9F43',
  AWARD:       '#4FA8FF',
  SCHOLARSHIP: '#FFD93D',
  COMPETITION: '#FF6B9D',
};

// ─── Layout ────────────────────────────────────────────────────────
// The spine passes THROUGH each card — the card sits astride the path.
// Each node: spine enters the card from one edge, exits the other edge.
// Entry point = left edge of card (or right edge for left-side cards).
// Exit point  = right edge of card (or left edge for left-side cards).
// The dot is placed at the card's entry edge on the spine.

const CARD_W  = 440;  // doubled from 220
const CARD_H  = 240;  // doubled — used for spine routing midpoint
const SVG_W   = 2400; // extra wide for exaggerated spread
const STEP_Y  = 300;  // vertical gap between cards
const START_Y = 80;

// LEFT edge of each card — organic, non-alternating placement across a 2400px canvas.
// Max cardX = SVG_W - CARD_W = 1960. Exaggerated swings for dramatic animations.
const CARD_LEFTS = [
  20,    // 0  — far left (start)
  1400,  // 1  — huge jump right
  800,   // 2  — drift left (mid-right)
  1700,  // 3  — far right
  1500,  // 4  — nudge left (still far right)
  100,   // 5  — giant swing left
  500,   // 6  — drift right (mid-left)
  1850,  // 7  — extreme right
  50,    // 8  — far left
  950,   // 9  — mid
  1600,  // 10 — far right
  250,   // 11 — left-ish
  1100,  // 12 — right-ish
  30,    // 13 — far left
  1900,  // 14 — extreme right (end)
];

// Build nodes — spine enters card at left or right edge depending on approach direction
const NODES = TIMELINE.map((e, i) => {
  const cardX    = CARD_LEFTS[i];
  const cardY    = START_Y + i * STEP_Y - CARD_H / 2;
  const dotY     = cardY + CARD_H / 2; // spine crosses card at vertical midpoint
  const showYear = i === 0 || TIMELINE[i - 1].year !== e.year;

  // Determine which side the spine approaches from
  // If next card is to the right of this one → spine exits right → entry from left
  // We'll compute entry/exit x as left and right edges of card
  const entryX = cardX;           // spine enters card at left edge
  const exitX  = cardX + CARD_W; // spine exits card at right edge

  return { ...e, cardX, cardY, dotY, entryX, exitX, dotX: entryX, showYear };
});

// Build spine waypoints — path goes through each card (entry → exit),
// then connects to next card's entry with L-shaped segments
const SPINE_PTS = (() => {
  const pts = [];
  // Start above the first card
  pts.push([NODES[0].entryX, START_Y - 30]);

  NODES.forEach((n, i) => {
    const prevExit = i === 0 ? [n.entryX, START_Y - 30] : [NODES[i - 1].exitX, NODES[i - 1].dotY];

    // Connect from previous exit to this card's entry with L-shape:
    // horizontal to entry X, then vertical to dotY
    if (prevExit[0] !== n.entryX) {
      // Drop vertically from prev exit to this dotY, then go horizontal
      pts.push([prevExit[0], n.dotY]);  // vertical segment
      pts.push([n.entryX, n.dotY]);     // horizontal to entry
    } else {
      pts.push([n.entryX, n.dotY]);
    }

    // Pass through the card: entry → exit (horizontal line through card)
    pts.push([n.exitX, n.dotY]);
  });

  // Tail below last card
  pts.push([NODES[NODES.length - 1].exitX, NODES[NODES.length - 1].dotY + 60]);
  return pts;
})();

const TOTAL_H = NODES[NODES.length - 1].dotY + 220;

function buildSpinePath() {
  return SPINE_PTS.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
}

// Build a sub-path: same shape as spine but shifted by dx horizontally and dy vertically
function buildSubPath(dx = 0, dy = 12) {
  return SPINE_PTS.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x + dx} ${y + dy}`).join(' ');
}

// All decorative parallel lines — each with distinct offset, color, width, dash
const SUB_LINES = [
  // offset [dx, dy], stroke, width, dasharray, delay, opacity
  { dx:  0,  dy:  16, stroke: 'rgba(79,168,255,0.18)',  width: 1,   dash: '6 10',  delay: 0.15, opacity: 1   },
  { dx:  0,  dy: -14, stroke: 'rgba(79,168,255,0.10)',  width: 1,   dash: '3 12',  delay: 0.25, opacity: 1   },
  { dx:  8,  dy:  28, stroke: 'rgba(167,139,250,0.14)', width: 2,   dash: '8 6',   delay: 0.35, opacity: 1   },
  { dx: -8,  dy: -26, stroke: 'rgba(167,139,250,0.09)', width: 1,   dash: '2 14',  delay: 0.45, opacity: 1   },
  { dx:  0,  dy:  44, stroke: 'rgba(255,107,157,0.10)', width: 1.5, dash: '5 8',   delay: 0.55, opacity: 1   },
  { dx:  0,  dy: -42, stroke: 'rgba(255,107,157,0.07)', width: 1,   dash: '4 16',  delay: 0.65, opacity: 1   },
  { dx: 16,  dy:  60, stroke: 'rgba(168,230,163,0.12)', width: 3,   dash: '10 5',  delay: 0.75, opacity: 1   },
  { dx:-16,  dy: -58, stroke: 'rgba(168,230,163,0.07)', width: 1,   dash: '1 18',  delay: 0.85, opacity: 1   },
  { dx:  0,  dy:  80, stroke: 'rgba(255,217,61,0.09)',  width: 2,   dash: '7 9',   delay: 0.95, opacity: 1   },
  { dx:  0,  dy: -78, stroke: 'rgba(255,217,61,0.06)',  width: 1,   dash: '3 20',  delay: 1.05, opacity: 1   },
];

// Tick marks perpendicular to the spine at each node's dot position
function buildTicks() {
  return NODES.map(n => ({
    x1: n.entryX, y1: n.dotY - 10,
    x2: n.entryX, y2: n.dotY + 10,
  }));
}

// Short branch stubs jutting off the horizontal segments (above and below)
function buildStubs() {
  const stubs = [];
  NODES.forEach((n) => {
    // Mid-point of the horizontal segment through the card
    const midX = n.cardX + CARD_W / 2;
    const y    = n.dotY;
    stubs.push({ x1: midX, y1: y - 20, x2: midX, y2: y - 8 });   // stub above
    stubs.push({ x1: midX, y1: y + 8,  x2: midX, y2: y + 20 });   // stub below
    // Tiny tick at the exit point
    stubs.push({ x1: n.exitX, y1: y - 6, x2: n.exitX, y2: y + 6 });
  });
  return stubs;
}

// Grid-ruler marks: small horizontal notches along the left margin
function buildRulerMarks() {
  return NODES.map((n, i) => ({
    x1: 0, y1: n.dotY,
    x2: 18, y2: n.dotY,
    label: String(i + 1).padStart(2, '0'),
    labelX: 22, labelY: n.dotY + 4,
  }));
}

// Get spine waypoints up to and including the exit of node i
function spineWaypointsUpTo(nodeIdx) {
  // The exit of node i is the point [NODES[nodeIdx].exitX, NODES[nodeIdx].dotY]
  const targetX = NODES[nodeIdx].exitX;
  const targetY = NODES[nodeIdx].dotY;
  const pts = [];
  for (const pt of SPINE_PTS) {
    pts.push(pt);
    if (pt[0] === targetX && pt[1] === targetY) break;
  }
  return pts;
}

// ─── Single timeline node ──────────────────────────────────────
function TimelineNode({ node, i, isActive, onClick, containerRef }) {
  const ref     = useRef(null);
  const cardRef = useRef(null);
  const inView  = useInView(ref, { once: true, margin: '-50px' });
  const color = TYPE_COLORS[node.type];
  // Cards left of center shift left on active, cards right of center shift right
  const centerX = SVG_W / 2;
  const activeSideX = isActive ? (node.cardX + CARD_W / 2 < centerX ? -12 : 12) : 0;

  useEffect(() => {
    if (isActive && cardRef.current && containerRef?.current) {
      const c   = containerRef.current;
      const el  = cardRef.current;
      // Center vertically
      const topTarget  = el.offsetTop  - c.clientHeight / 2 + (CARD_H / 2);
      // Center horizontally
      const leftTarget = el.offsetLeft - c.clientWidth  / 2 + (CARD_W / 2);
      c.scrollTo({ top: topTarget, left: leftTarget, behavior: 'smooth' });
    }
  }, [isActive]);

  return (
    <div ref={ref} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>

      {/* Entry dot — where spine enters the card */}
      <motion.div
        className="exp-vdot"
        style={{ left: node.entryX, top: node.dotY, background: color, pointerEvents: 'auto' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? {
          scale: isActive ? 2.2 : 1,
          opacity: 1,
          boxShadow: isActive ? `0 0 22px ${color}90` : `0 0 8px ${color}40`,
        } : { scale: 0, opacity: 0 }}
        transition={{ delay: i * 0.06, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={onClick}
      />

      {/* Year ghost label */}
      {node.showYear && (
        <motion.div
          className="exp-vyear"
          style={{ top: node.cardY - 54, left: node.cardX }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.06 + 0.2, duration: 0.5 }}
        >
          {node.year}
        </motion.div>
      )}

      {/* Card — spine passes through it horizontally at dotY */}
      <motion.div
        ref={cardRef}
        className={`exp-vcard card ${isActive ? 'exp-vcard-active' : ''}`}
        style={{
          left: node.cardX,
          top: node.cardY,
          borderColor: isActive ? color : undefined,
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? {
          opacity: 1,
          x: activeSideX,
          y: isActive ? -16 : 0,
          width: isActive ? CARD_W * 1.4 : CARD_W,
        } : { opacity: 0, y: 12 }}
        transition={{
          opacity: { delay: i * 0.06 + 0.35, duration: 0.45, ease: [0.76, 0, 0.24, 1] },
          x:       { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
          y:       { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
          width:   { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
        }}
        onClick={onClick}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div className="exp-type-badge" style={{ color, background: color + '20', borderColor: color + '50' }}>
            {node.type}
          </div>
          <div className="htimeline-period mono-tiny" style={{ color }}>{node.period}</div>
        </div>

        <div className="htimeline-role">{node.role}</div>
        <div className="htimeline-org">{node.org}</div>
        {node.note && <div className="htimeline-note" style={{ color }}>{node.note}</div>}

        {/* Expanded detail */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="exp-divider" style={{ borderColor: color + '40' }} />
            <ul className="htimeline-items">
              {node.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────
export default function Experience() {
  const [active, setActive]   = useState(null);
  const [zoomed, setZoomed]   = useState(false);
  const containerRef          = useRef(null);
  const svgRef                = useRef(null);
  const svgInView             = useInView(svgRef, { once: true });

  const spinePath   = buildSpinePath();
  const subPaths    = SUB_LINES.map(l => buildSubPath(l.dx, l.dy));
  const ticks       = buildTicks();
  const stubs       = buildStubs();
  const rulerMarks  = buildRulerMarks();

  const handleClick = (i) => {
    const next = active === i ? null : i;
    setActive(next);
    if (next !== null) setZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomed(false);
    setActive(null);
  };

  const goNext = () => {
    const next = active === null ? 0 : Math.min(active + 1, NODES.length - 1);
    setActive(next);
    setZoomed(true);
  };

  const goPrev = () => {
    if (active === null) return;
    const prev = Math.max(active - 1, 0);
    setActive(prev);
    setZoomed(true);
  };

  // Cursor waypoints for path-follow animation
  const cursorWaypoints = active !== null ? spineWaypointsUpTo(active) : [SPINE_PTS[0]];
  const cursorColor     = active !== null ? TYPE_COLORS[NODES[active].type] : 'transparent';

  // Zoom scale: zoomed-out shows entire canvas shrunk to fit, zoomed-in = 1
  const scrollW    = containerRef.current?.clientWidth  || window.innerWidth;
  const scrollH    = containerRef.current?.clientHeight || window.innerHeight * 0.75;
  const scaleX     = scrollW  / SVG_W;
  const scaleY     = scrollH  / TOTAL_H;
  const zoomOutScale = Math.min(scaleX, scaleY, 0.28); // never bigger than 0.28

  return (
    <div className="exp-page section-page">
      <div className="exp-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="exp-header"
        >
          <div className="section-label">FILE_04 // EXPERIENCE</div>
          <h2 className="section-title">Timeline.</h2>
          <div className="exp-legend">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <span key={type} className="legend-item">
                <span className="legend-dot" style={{ background: color }} />
                <span className="legend-label">{type}</span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* Zoom-out button */}
        {zoomed && (
          <motion.button
            className="exp-zoom-out-btn"
            onClick={handleZoomOut}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="10.5" y1="10.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            ZOOM OUT
          </motion.button>
        )}

        {/* Prev / Next navigation arrows */}
        {zoomed && (
          <div className="exp-nav-arrows">
            <motion.button
              className="exp-arrow-btn"
              onClick={goPrev}
              disabled={active === 0}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <polyline points="10,2 4,8 10,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              PREV
            </motion.button>
            <span className="exp-arrow-index">
              {active !== null ? `${String(active + 1).padStart(2,'0')} / ${String(NODES.length).padStart(2,'0')}` : ''}
            </span>
            <motion.button
              className="exp-arrow-btn"
              onClick={goNext}
              disabled={active === NODES.length - 1}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              NEXT
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <polyline points="6,2 12,8 6,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        )}

        <div
          className="exp-scroll"
          ref={containerRef}
          style={{ overflow: zoomed ? 'auto' : 'hidden' }}
        >
          <motion.div
            className="exp-vtimeline"
            style={{ height: TOTAL_H, width: SVG_W, transformOrigin: 'top left' }}
            animate={{ scale: zoomed ? 1 : zoomOutScale }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >

            {/* Main spine SVG */}
            <svg
              ref={svgRef}
              className="exp-vsvg"
              width={SVG_W}
              height={TOTAL_H}
              viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
            >
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ruler marks — left-margin index notches */}
              {rulerMarks.map((m, i) => (
                <g key={`ruler-${i}`} opacity={svgInView ? 1 : 0} style={{ transition: `opacity 0.4s ${i * 0.05}s` }}>
                  <line x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  <text x={m.labelX} y={m.labelY} fontSize="8" fontFamily="IBM Plex Mono, monospace" fill="rgba(0,0,0,0.18)" letterSpacing="0.1em">{m.label}</text>
                </g>
              ))}

              {/* Decorative parallel sub-lines — multiple offsets, colors, widths */}
              {SUB_LINES.map((l, i) => (
                <motion.path
                  key={`sub-${i}`}
                  d={subPaths[i]}
                  stroke={l.stroke}
                  strokeWidth={l.width}
                  fill="none"
                  strokeDasharray={l.dash}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={svgInView ? { pathLength: 1, opacity: l.opacity } : {}}
                  transition={{ duration: 2.2 + i * 0.1, ease: 'easeInOut', delay: l.delay }}
                />
              ))}

              {/* Static spine */}
              <motion.path
                d={spinePath}
                stroke="rgba(0,0,0,0.10)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="square"
                strokeLinejoin="miter"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={svgInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />

              {/* Tick marks at each node entry point */}
              {ticks.map((t, i) => (
                <motion.line
                  key={`tick-${i}`}
                  x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                  stroke="rgba(0,0,0,0.18)"
                  strokeWidth="1"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={svgInView ? { scaleY: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.06 }}
                  style={{ transformOrigin: `${t.x1}px ${(t.y1 + t.y2) / 2}px` }}
                />
              ))}

              {/* Branch stubs off horizontal segments */}
              {stubs.map((s, i) => (
                <motion.line
                  key={`stub-${i}`}
                  x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                  stroke="rgba(0,0,0,0.10)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={svgInView ? { scaleY: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.25, delay: 1.0 + i * 0.03 }}
                  style={{ transformOrigin: `${s.x1}px ${(s.y1 + s.y2) / 2}px` }}
                />
              ))}

              {/* Glowing cursor that travels the spine to the active node */}
              <motion.circle
                r={6}
                fill={cursorColor}
                filter="url(#glow)"
                animate={{
                  cx: cursorWaypoints.map(p => p[0]),
                  cy: cursorWaypoints.map(p => p[1]),
                  opacity: active !== null ? 1 : 0,
                }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              />

              {/* Highlight trail on spine up to active node */}
              {active !== null && (
                <motion.path
                  d={cursorWaypoints.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')}
                  stroke={cursorColor}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  opacity={0.4}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                />
              )}
            </svg>

            {/* All 15 nodes */}
            {NODES.map((node, i) => (
              <TimelineNode
                key={`node-${i}`}
                node={node}
                i={i}
                isActive={active === i}
                onClick={() => handleClick(i)}
                containerRef={containerRef}
              />
            ))}

            {/* Nav arrows rendered inside the canvas pointing to next/prev card */}
            {zoomed && NODES.map((node, i) => {
              const nextNode = NODES[i + 1];
              if (!nextNode) return null;
              // Arrow drawn from exit of this card pointing toward entry of next card
              const x1 = node.cardX + CARD_W / 2;
              const y1 = node.dotY + CARD_H / 2 + 10;
              const x2 = nextNode.cardX + CARD_W / 2;
              const y2 = nextNode.dotY - CARD_H / 2 - 10;
              const mx = (x1 + x2) / 2;
              const my = (y1 + y2) / 2;
              const color = TYPE_COLORS[node.type];
              const isActiveArrow = active === i;
              return (
                <svg
                  key={`arrow-${i}`}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
                  width={SVG_W} height={TOTAL_H}
                  viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                  overflow="visible"
                >
                  <defs>
                    <marker id={`arrowhead-${i}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                      <polygon points="0 0, 7 3.5, 0 7" fill={isActiveArrow ? color : 'rgba(0,0,0,0.15)'} />
                    </marker>
                  </defs>
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isActiveArrow ? color : 'rgba(0,0,0,0.10)'}
                    strokeWidth={isActiveArrow ? 2 : 1}
                    strokeDasharray={isActiveArrow ? '6 4' : '4 6'}
                    markerEnd={`url(#arrowhead-${i})`}
                    opacity={isActiveArrow ? 0.7 : 0.35}
                  />
                  {/* Mid-label */}
                  <text
                    x={mx + 8} y={my}
                    fontSize="9" fontFamily="IBM Plex Mono, monospace"
                    fill={isActiveArrow ? color : 'rgba(0,0,0,0.2)'}
                    letterSpacing="0.12em"
                  >
                    {String(i + 2).padStart(2, '0')}
                  </text>
                </svg>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
