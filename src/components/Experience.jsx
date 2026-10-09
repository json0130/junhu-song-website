import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
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
    role: 'PhD (Robotics & AI)',
    org: 'University of Auckland',
    period: 'Mar 2026 – Present',
    type: 'EDUCATION',
    items: ['Pursuing a PhD in Robotics & AI at the University of Auckland', 'Focus on human-robot interaction and advanced ML systems'],
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
// The whole timeline is one A4-portrait sheet (1 : √2). The cards snake down it in three
// columns, and a smooth curve winds through them. A camera pans/zooms over the sheet:
// PREV/NEXT glide the camera straight (and gently) from card to card while a glowing cursor
// runs along the curve in step with it, then the next card opens.

const CARD_W  = 440;
const CARD_H  = 240;                      // nominal height — used for routing
const PAGE_W  = 2400;
const PAGE_H  = Math.round(PAGE_W * Math.SQRT2);   // A4 portrait
const PAD_X   = 140;                      // breathing room around a card when fitting the viewport

const COL_X  = [560, 1200, 1840];         // card-centre columns
const ROW_Y0 = 520;                       // first row
const ROW_DY = 575;                       // row spacing (5 rows fill the sheet)
// Small offsets so the snake isn't a rigid grid
const WOBBLE = [
  [-30,  0], [ 40, -70], [-20,  50],
  [ 30, 60], [-50, -40], [ 20,  80],
  [-40, -30], [ 50,  70], [-20, -60],
  [ 30,  40], [-30, -80], [ 40,  30],
  [-50, -50], [ 30,  60], [-10, -20],
];

const NODES = TIMELINE.map((e, i) => {
  const row = Math.floor(i / 3);
  const k = i % 3;
  const col = row % 2 === 0 ? k : 2 - k;               // boustrophedon: left→right, then right→left
  const cx = COL_X[col] + WOBBLE[i][0];
  const cy = ROW_Y0 + row * ROW_DY + WOBBLE[i][1];
  return {
    ...e,
    cx, cy,
    cardX: cx - CARD_W / 2,
    cardY: cy - CARD_H / 2,
    showYear: i === 0 || TIMELINE[i - 1].year !== e.year,
  };
});
const N = NODES.length;

// Catmull-Rom → cubic Béziers through the card centres, with a short lead-in and lead-out
const ANCHORS = (() => {
  const a = NODES.map(n => [n.cx, n.cy]);
  const head = [a[0][0] + (a[0][0] - a[1][0]) * 0.35, a[0][1] + (a[0][1] - a[1][1]) * 0.35];
  const tail = [a[N - 1][0] + (a[N - 1][0] - a[N - 2][0]) * 0.35, a[N - 1][1] + (a[N - 1][1] - a[N - 2][1]) * 0.35];
  return [head, ...a, tail];
})();

const CURVES = [];      // [p0, c1, c2, p1] per segment
for (let i = 0; i < ANCHORS.length - 1; i++) {
  const p0 = ANCHORS[i], p1 = ANCHORS[i + 1];
  const pm = ANCHORS[Math.max(i - 1, 0)], pn = ANCHORS[Math.min(i + 2, ANCHORS.length - 1)];
  CURVES.push([
    p0,
    [p0[0] + (p1[0] - pm[0]) / 6, p0[1] + (p1[1] - pm[1]) / 6],
    [p1[0] - (pn[0] - p0[0]) / 6, p1[1] - (pn[1] - p0[1]) / 6],
    p1,
  ]);
}
const SPINE_D = `M ${CURVES[0][0][0]} ${CURVES[0][0][1]} ` + CURVES.map(([, c1, c2, p]) => `C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p[0]} ${p[1]}`).join(' ');

// Sample the curve so we can ask "where is arc-length s?"
const SAMPLES = [];     // { x, y, s }
const NODE_S = [];      // arc length at each card centre
{
  const STEPS = 60;
  let acc = 0;
  let prev = null;
  CURVES.forEach(([p0, c1, c2, p1], seg) => {
    if (seg >= 1 && seg <= N) NODE_S[seg - 1] = acc;      // segment `seg` starts at anchor `seg` = card `seg-1`
    for (let k = 0; k < STEPS; k++) {
      const t = k / STEPS, u = 1 - t;
      const x = u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0];
      const y = u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1];
      if (prev) acc += Math.hypot(x - prev[0], y - prev[1]);
      SAMPLES.push({ x, y, s: acc });
      prev = [x, y];
    }
  });
  const end = CURVES[CURVES.length - 1][3];
  acc += Math.hypot(end[0] - prev[0], end[1] - prev[1]);
  SAMPLES.push({ x: end[0], y: end[1], s: acc });
}
const SPINE_LEN = SAMPLES[SAMPLES.length - 1].s;

function pointAt(s) {
  const d = Math.min(Math.max(s, 0), SPINE_LEN);
  let lo = 0, hi = SAMPLES.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (SAMPLES[mid].s <= d) lo = mid; else hi = mid;
  }
  const a = SAMPLES[lo], b = SAMPLES[hi];
  const t = b.s === a.s ? 0 : (d - a.s) / (b.s - a.s);
  return [a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t];
}

// Where the curve crosses each card's edge on the way in — that's where the dot sits
NODES.forEach((n, i) => {
  let entry = [n.cx, n.cardY];
  for (let d = 0; d < 500; d += 3) {
    const [x, y] = pointAt(NODE_S[i] - d);
    if (Math.abs(x - n.cx) > CARD_W / 2 + 4 || Math.abs(y - n.cy) > CARD_H / 2 + 4) { entry = [x, y]; break; }
  }
  n.entry = entry;
});

// A direction chevron halfway along every connection
const CHEVRONS = NODES.slice(0, -1).map((_, i) => {
  const s = (NODE_S[i] + NODE_S[i + 1]) / 2;
  const [x, y] = pointAt(s);
  const [x2, y2] = pointAt(s + 4);
  const [x1, y1] = pointAt(s - 4);
  return { x, y, deg: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI };
});

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const focusScale    = (w)    => clamp(w / 1150, 0.55, 1.15);
const overviewScale = (w, h) => Math.min(w / PAGE_W, h / PAGE_H, 0.3) * 0.96;
const isStacked = () => window.matchMedia('(max-width: 768px)').matches;   // phones stack the cards

// ─── Single timeline node ──────────────────────────────────────
function TimelineNode({ node, i, isFocus, isCurrent, onClick }) {
  const color = TYPE_COLORS[node.type];
  const delay = Math.min(i * 0.04, 0.5);
  return (
    <div className="exp-vnode">
      {/* Entry dot — where the route meets the card */}
      <motion.div
        className="exp-vdot"
        style={{ left: node.entry[0], top: node.entry[1], background: color }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isCurrent ? 2.2 : 1,
          opacity: 1,
          boxShadow: isCurrent ? `0 0 22px ${color}90` : `0 0 8px ${color}40`,
        }}
        transition={{ delay, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={onClick}
      />

      {node.showYear && (
        <motion.div
          className="exp-vyear"
          style={{ top: node.cardY - 54, left: node.cardX }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
        >
          {node.year}
        </motion.div>
      )}

      <motion.div
        className={`exp-vcard card ${isFocus ? 'exp-vcard-active' : ''}`}
        style={{ left: node.cardX, top: node.cardY, borderColor: isFocus ? color : undefined }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, width: CARD_W }}
        transition={{ opacity: { delay: delay + 0.2, duration: 0.45 } }}
        onClick={onClick}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div className="exp-type-badge" style={{ color, background: color + '20', borderColor: color + '50' }}>
            {node.type}
          </div>
          <div className="htimeline-period mono-tiny" style={{ color }}>{node.period}</div>
        </div>

        <div className="htimeline-role">{node.role}</div>
        <div className="htimeline-org">{node.org}</div>
        {node.note && <div className="htimeline-note" style={{ color }}>{node.note}</div>}

        {isFocus && (
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
  // Open on a random card
  const [current, setCurrent]       = useState(() => Math.floor(Math.random() * N));
  const [focus, setFocus]           = useState(null);     // which card is expanded
  const [overview, setOverview]     = useState(false);
  const [travelling, setTravelling] = useState(false);

  const viewportRef = useRef(null);
  const baseRef     = useRef(null);
  const trailRef    = useRef(null);
  const cursorRef   = useRef(null);
  const dashK       = useRef(1);                           // SVG path length ÷ sampled length
  const anims       = useRef([]);                          // running animations, stopped on unmount
  const live        = useRef({});                          // latest state for callbacks/listeners
  live.current = { current, overview, travelling };

  // Camera: the world point at the viewport centre + zoom
  const vw   = useMotionValue(1200);
  const vh   = useMotionValue(700);
  const camX = useMotionValue(PAGE_W / 2);
  const camY = useMotionValue(PAGE_H / 2);
  const camS = useMotionValue(1);
  const tx = useTransform(() => vw.get() / 2 - camX.get() * camS.get());
  const ty = useTransform(() => vh.get() / 2 - camY.get() * camS.get());

  const restPose = (idx, isOverview) => {
    const w = vw.get(), h = vh.get();
    if (isOverview) return { x: PAGE_W / 2, y: PAGE_H / 2, s: overviewScale(w, h) };
    return { x: NODES[idx].cx, y: NODES[idx].cy, s: focusScale(w) };
  };

  const setTrail = (s, color) => {
    const t = trailRef.current;
    if (!t) return;
    t.setAttribute('stroke-dasharray', `${s * dashK.current} ${SPINE_LEN * dashK.current + 20}`);
    if (color) t.setAttribute('stroke', color);
  };

  const snapTo = (idx, isOverview) => {
    const p = restPose(idx, isOverview);
    camX.set(p.x); camY.set(p.y); camS.set(p.s);
  };

  const runAnimation = (...controls) => { anims.current.push(...controls); };

  // Measure the viewport before first paint, then keep it in sync
  useLayoutEffect(() => {
    const el = viewportRef.current;
    const measure = () => {
      vw.set(el.clientWidth || 1200);
      vh.set(el.clientHeight || 700);
      if (!live.current.travelling) snapTo(live.current.current, live.current.overview);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once a card has expanded, nudge the camera onto its real centre (its height depends on its text)
  useEffect(() => {
    if (focus === null || overview || travelling) return undefined;
    const t = setTimeout(() => {
      const el = viewportRef.current?.querySelector('.exp-vcard-active');
      if (!el) return;
      runAnimation(animate(camY, NODES[focus].cardY + el.offsetHeight / 2, { duration: 0.45, ease: [0.45, 0, 0.2, 1] }));
    }, 420);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  // Expand the random card shortly after the page has faded in
  useEffect(() => {
    if (baseRef.current?.getTotalLength) dashK.current = baseRef.current.getTotalLength() / SPINE_LEN;
    setTrail(NODE_S[current], TYPE_COLORS[NODES[current].type]);
    const t = setTimeout(() => setFocus(f => (f === null && !live.current.overview ? live.current.current : f)), 700);
    return () => { clearTimeout(t); anims.current.forEach(a => a.stop()); anims.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Glide the camera from card `current` to card `j`; the cursor runs along the curve in step
  const travelTo = (j) => {
    const { current: from, overview: ov, travelling: busy } = live.current;
    if (busy || ov || j === from || j < 0 || j >= N) return;
    const a = NODES[from], b = NODES[j];
    const color = TYPE_COLORS[b.type];
    const fs = focusScale(vw.get());
    const dist = Math.hypot(b.cx - a.cx, b.cy - a.cy);
    const dip = clamp(dist / 1500, 0.1, 0.3);              // zoom out a little on longer hops
    const sA = NODE_S[from], sB = NODE_S[j];
    const cursor = cursorRef.current;

    setFocus(null);
    setTravelling(true);
    live.current.travelling = true;
    setTrail(sA, color);
    cursor.setAttribute('fill', color);
    cursor.style.opacity = 1;

    runAnimation(animate(0, 1, {
      duration: clamp(dist / 650, 1.3, 3.2),
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (p) => {
        camX.set(a.cx + (b.cx - a.cx) * p);
        camY.set(a.cy + (b.cy - a.cy) * p);
        camS.set(fs * (1 - dip * Math.sin(Math.PI * p)));
        const s = sA + (sB - sA) * p;
        const [x, y] = pointAt(s);
        cursor.setAttribute('cx', x);
        cursor.setAttribute('cy', y);
        setTrail(s);
      },
      onComplete: () => {
        cursor.style.opacity = 0;
        live.current.travelling = false;
        setCurrent(j);
        setFocus(j);
        setTravelling(false);
      },
    }));
  };

  const animatePose = (p, onDone) => {
    const opts = { duration: 0.9, ease: [0.45, 0, 0.2, 1] };
    runAnimation(
      animate(camX, p.x, opts),
      animate(camY, p.y, opts),
      animate(camS, p.s, { ...opts, onComplete: onDone }),
    );
  };

  const toggleOverview = () => {
    if (live.current.travelling) return;
    if (!overview) {
      setFocus(null);
      setOverview(true);
      live.current.overview = true;
      animatePose(restPose(current, true));
    } else {
      setOverview(false);
      live.current.overview = false;
      animatePose(restPose(current, false), () => setFocus(current));
    }
  };

  const onNodeClick = (i) => {
    if (live.current.travelling) return;
    if (isStacked()) { setFocus(f => (f === i ? null : i)); return; }
    if (overview) {
      // dive into the clicked card from the overview
      setCurrent(i);
      live.current.current = i;
      live.current.overview = false;
      setTrail(NODE_S[i], TYPE_COLORS[NODES[i].type]);
      setOverview(false);
      animatePose(restPose(i, false), () => setFocus(i));
    } else if (i === current) {
      setFocus(f => (f === i ? null : i));
    } else {
      travelTo(i);
    }
  };

  // Keyboard: ← / → step through the timeline
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') travelTo(live.current.current + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') travelTo(live.current.current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

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

        <div className="exp-controls">
          {!overview && (
            <>
              <button className="exp-arrow-btn" onClick={() => travelTo(current - 1)} disabled={travelling || current === 0}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <polyline points="10,2 4,8 10,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                PREV
              </button>
              <span className="exp-arrow-index">{pad(current + 1)} / {pad(N)}</span>
              <button className="exp-arrow-btn" onClick={() => travelTo(current + 1)} disabled={travelling || current === N - 1}>
                NEXT
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <polyline points="6,2 12,8 6,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
          <button className="exp-zoom-out-btn" onClick={toggleOverview} disabled={travelling}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              {overview && <line x1="6" y1="3" x2="6" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
              <line x1="10.5" y1="10.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {overview ? 'ZOOM IN' : 'OVERVIEW'}
          </button>
        </div>

        <div className="exp-scroll" ref={viewportRef}>
          <motion.div
            className="exp-vtimeline"
            style={{ height: PAGE_H, width: PAGE_W, x: tx, y: ty, scale: camS, originX: 0, originY: 0 }}
          >
            <svg className="exp-vsvg" width={PAGE_W} height={PAGE_H} viewBox={`0 0 ${PAGE_W} ${PAGE_H}`}>
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <pattern id="exp-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path d="M120 0H0V120" fill="none" style={{ stroke: 'rgba(var(--line-rgb), 0.05)' }} strokeWidth="1" />
                </pattern>
              </defs>

              {/* The A4 sheet */}
              <rect x="0" y="0" width={PAGE_W} height={PAGE_H} rx="36" className="exp-page-sheet" />
              <rect x="0" y="0" width={PAGE_W} height={PAGE_H} rx="36" fill="url(#exp-grid)" />

              {/* Base route */}
              <motion.path
                ref={baseRef}
                d={SPINE_D}
                style={{ stroke: 'rgba(var(--line-rgb), 0.18)' }}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
              />

              {/* Direction chevrons */}
              {CHEVRONS.map((c, i) => (
                <polygon
                  key={`chev-${i}`}
                  points="-9,-7 9,0 -9,7"
                  transform={`translate(${c.x} ${c.y}) rotate(${c.deg})`}
                  style={{ fill: 'rgba(var(--line-rgb), 0.35)' }}
                />
              ))}

              {/* Highlighted stretch of the route that has been travelled */}
              <path
                ref={trailRef}
                d={SPINE_D}
                fill="none"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.6"
                strokeDasharray={`0 ${SPINE_LEN + 20}`}
              />

              {/* Glowing cursor that rides the route while travelling */}
              <circle ref={cursorRef} r="9" filter="url(#glow)" style={{ opacity: 0 }} />
            </svg>

            {NODES.map((node, i) => (
              <TimelineNode
                key={`node-${i}`}
                node={node}
                i={i}
                isFocus={focus === i}
                isCurrent={!overview && current === i}
                onClick={() => onNodeClick(i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
