import { useRef } from 'react';
import { motion } from 'framer-motion';
import './About.css';

/* ─── Skill icon components (inline SVG) ─── */
const SkillIcon = ({ name }) => {
  const icons = {
    PyTorch: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#EE4C2C" opacity="0.15"/>
        <path d="M16 5l-2 4.5c-3.5 1.5-6 5-6 9a8 8 0 0016 0c0-3.5-1.8-6.6-4.5-8.4L22 5" stroke="#EE4C2C" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20.5" cy="11.5" r="1.5" fill="#EE4C2C"/>
      </svg>
    ),
    TensorFlow: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#FF6F00" opacity="0.15"/>
        <path d="M8 10v12l5-3V13l3 1.5V11L8 10z" fill="#FF6F00"/>
        <path d="M16 11v3l5-2.5-5-2.5zM16 17.5l5 2.5V14.5L16 17z" fill="#FF6F00" opacity="0.7"/>
      </svg>
    ),
    Python: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#3776AB" opacity="0.15"/>
        <path d="M16 7c-4 0-5.5 1.8-5.5 4v2h5.5v1H8.5C6.5 14 5 15.8 5 18s1.5 5 5.5 5h1v-2.5c0-2 1.5-3.5 4-3.5h5c2 0 3.5-1.5 3.5-3.5v-4c0-2-1.5-3.5-3.5-3.5H16zm-1.5 2a1 1 0 110 2 1 1 0 010-2z" fill="#3776AB"/>
        <path d="M16 25c4 0 5.5-1.8 5.5-4v-2H16v-1h7c2 0 3.5-1.8 3.5-4s-1.5-5-3.5-5h-1v2.5c0 2-1.5 3.5-4 3.5h-5C11 15 9.5 16.5 9.5 18.5v4C9.5 24.5 11 26 13 26l3-1zm1.5-2a1 1 0 110-2 1 1 0 010 2z" fill="#FFD43B"/>
      </svg>
    ),
    React: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#61DAFB" opacity="0.15"/>
        <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(0 16 16)"/>
        <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 16 16)"/>
        <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 16 16)"/>
        <circle cx="16" cy="16" r="2" fill="#61DAFB"/>
      </svg>
    ),
    'Deep Learning': (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#4FA8FF" opacity="0.15"/>
        <circle cx="10" cy="10" r="2" fill="#4FA8FF"/>
        <circle cx="22" cy="10" r="2" fill="#4FA8FF"/>
        <circle cx="10" cy="22" r="2" fill="#4FA8FF"/>
        <circle cx="22" cy="22" r="2" fill="#4FA8FF"/>
        <circle cx="16" cy="16" r="2.5" fill="#4FA8FF"/>
        <path d="M10 10l6 6M22 10l-6 6M10 22l6-6M22 22l-6-6M10 10h12M10 22h12M10 10v12M22 10v12" stroke="#4FA8FF" strokeWidth="0.8" opacity="0.5"/>
      </svg>
    ),
    'Computer Vision': (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#A78BFA" opacity="0.15"/>
        <ellipse cx="16" cy="16" rx="10" ry="6" stroke="#A78BFA" strokeWidth="1.3" fill="none"/>
        <circle cx="16" cy="16" r="3.5" fill="#A78BFA"/>
        <circle cx="16" cy="16" r="1.5" fill="white"/>
      </svg>
    ),
    NLP: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#FF6B9D" opacity="0.15"/>
        <rect x="8" y="11" width="16" height="2" rx="1" fill="#FF6B9D"/>
        <rect x="8" y="15" width="12" height="2" rx="1" fill="#FF6B9D" opacity="0.7"/>
        <rect x="8" y="19" width="14" height="2" rx="1" fill="#FF6B9D" opacity="0.5"/>
      </svg>
    ),
    'Scikit-learn': (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#F89939" opacity="0.15"/>
        <path d="M8 20c2-4 4-8 8-8s6 4 8 8" stroke="#F89939" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="16" cy="16" r="3" fill="#F89939"/>
      </svg>
    ),
    OpenCV: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#5C3EE8" opacity="0.15"/>
        <circle cx="10" cy="12" r="4" fill="#5C3EE8" opacity="0.8"/>
        <circle cx="22" cy="12" r="4" fill="#A8E6A3" opacity="0.8"/>
        <circle cx="16" cy="22" r="4" fill="#FF6B6B" opacity="0.8"/>
      </svg>
    ),
    Pandas: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#150458" opacity="0.15"/>
        <rect x="12" y="8" width="4" height="16" rx="2" fill="#150458"/>
        <rect x="17" y="8" width="4" height="16" rx="2" fill="#E70488"/>
        <rect x="10" y="14" width="12" height="4" rx="1" fill="#150458" opacity="0.4"/>
      </svg>
    ),
    NumPy: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#4DABCF" opacity="0.15"/>
        <path d="M8 20l4-8 4 6 4-10" stroke="#4DABCF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    Git: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#F05032" opacity="0.15"/>
        <circle cx="10" cy="22" r="2.5" stroke="#F05032" strokeWidth="1.3"/>
        <circle cx="22" cy="10" r="2.5" stroke="#F05032" strokeWidth="1.3"/>
        <circle cx="10" cy="10" r="2.5" stroke="#F05032" strokeWidth="1.3"/>
        <path d="M10 19.5v-7M12.5 10h7M12.5 22c3-2 6-6 7-10" stroke="#F05032" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    Docker: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#2496ED" opacity="0.15"/>
        <rect x="8" y="13" width="5" height="4" rx="0.5" fill="#2496ED" opacity="0.5"/>
        <rect x="14" y="13" width="5" height="4" rx="0.5" fill="#2496ED" opacity="0.7"/>
        <rect x="20" y="13" width="4" height="4" rx="0.5" fill="#2496ED"/>
        <rect x="14" y="9" width="5" height="4" rx="0.5" fill="#2496ED" opacity="0.6"/>
        <path d="M6 19c1 3 4 5 10 5s10-3 10-6" stroke="#2496ED" strokeWidth="1" fill="none"/>
      </svg>
    ),
    MongoDB: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#47A248" opacity="0.15"/>
        <path d="M16 6c0 0-6 6-6 10a6 6 0 0012 0c0-4-6-10-6-10z" fill="#47A248"/>
        <path d="M16 6v20" stroke="#47A248" strokeWidth="1" opacity="0.4"/>
      </svg>
    ),
    SQL: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#CC2927" opacity="0.15"/>
        <ellipse cx="16" cy="11" rx="7" ry="3" fill="#CC2927" opacity="0.6"/>
        <path d="M9 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" stroke="#CC2927" strokeWidth="1.2" fill="none"/>
        <path d="M9 16v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" stroke="#CC2927" strokeWidth="1.2" fill="none" opacity="0.6"/>
      </svg>
    ),
    Linux: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#FCC624" opacity="0.15"/>
        <path d="M16 7c-3 0-5 3-5 7 0 2 .5 3.5 1.5 4.5L11 22h10l-1.5-3.5C20.5 17.5 21 16 21 14c0-4-2-7-5-7z" stroke="#FCC624" strokeWidth="1.2" fill="none"/>
        <circle cx="13.5" cy="13" r="1" fill="#FCC624"/>
        <circle cx="18.5" cy="13" r="1" fill="#FCC624"/>
      </svg>
    ),
    'REST APIs': (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#4FA8FF" opacity="0.15"/>
        <path d="M8 16h16M19 12l5 4-5 4" stroke="#4FA8FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 12l-5 4 5 4" stroke="#4FA8FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      </svg>
    ),
    Matplotlib: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#11557C" opacity="0.15"/>
        <path d="M8 22l4-6 4 3 4-8" stroke="#11557C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="12" cy="16" r="1.5" fill="#11557C"/>
        <circle cx="16" cy="19" r="1.5" fill="#E24A33"/>
        <circle cx="20" cy="11" r="1.5" fill="#348ABD"/>
      </svg>
    ),
    Jupyter: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#F37726" opacity="0.15"/>
        <circle cx="16" cy="16" r="6" stroke="#F37726" strokeWidth="1.5" fill="none"/>
        <circle cx="9" cy="10" r="2" fill="#F37726"/>
        <circle cx="23" cy="10" r="2" fill="#767676"/>
        <circle cx="16" cy="25" r="2" fill="#9E9E9E"/>
      </svg>
    ),
    Kaggle: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#20BEFF" opacity="0.15"/>
        <path d="M11 8v16M11 16l8-8M11 16l8 8" stroke="#20BEFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'Data Visualization': (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#FF9F43" opacity="0.15"/>
        <rect x="8" y="18" width="4" height="6" rx="1" fill="#FF9F43"/>
        <rect x="14" y="13" width="4" height="11" rx="1" fill="#FF9F43" opacity="0.7"/>
        <rect x="20" y="9" width="4" height="15" rx="1" fill="#FF9F43" opacity="0.5"/>
      </svg>
    ),
    TypeScript: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <rect x="1" y="1" width="30" height="30" rx="4" fill="#3178C6" opacity="0.15"/>
        <text x="6" y="22" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#3178C6">TS</text>
      </svg>
    ),
  };

  const icon = icons[name];
  if (icon) return icon;

  const colors = ['#4FA8FF','#FF9F43','#A8E6A3','#C8A8FF','#FF6B9D','#FFD93D'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
      <circle cx="10" cy="10" r="9" fill={color} opacity="0.2"/>
      <text x="10" y="14" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold" fontFamily="monospace">
        {name.charAt(0)}
      </text>
    </svg>
  );
};

const SKILLS = {
  'ML & AI': ['PyTorch', 'TensorFlow', 'Scikit-learn', 'OpenCV', 'Computer Vision', 'NLP', 'Deep Learning'],
  'Data Science': ['Pandas', 'NumPy', 'Matplotlib', 'Jupyter', 'Kaggle', 'Data Visualization'],
  'Engineering': ['Python', 'SQL', 'Git', 'Docker', 'Linux', 'MongoDB', 'REST APIs', 'React', 'TypeScript'],
};

const EDU = [
  {
    school: 'University of Auckland',
    degree: 'Master of Engineering (Robotics & AI)',
    period: 'Mar 2026 – Nov 2026',
  },
  {
    school: 'National University of Singapore',
    degree: 'Exchange – Computer Science',
    period: 'Jul 2024 – Dec 2024',
  },
  {
    school: 'University of Auckland',
    degree: 'BE(Hons) Software Engineering',
    period: 'Mar 2022 – Nov 2025',
    note: "Dean's List 2022, 2023 · GPA 92%",
  },
];

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { delay, duration: 0.55, ease: [0.76, 0, 0.24, 1] } },
});

export default function About() {
  const canvasRef = useRef(null);

  return (
    <div className="about-canvas" ref={canvasRef}>
      {/* Background grid */}
      <div className="ac-grid-bg" />

      {/*
        SVG connector layer — angled bracket-style connectors like the reference:
        each line goes from a node corner toward the center, with a sharp elbow
        (two segments: horizontal then diagonal, or diagonal direct).
        Arrowheads on the center end.
      */}
      <svg className="ac-connectors" viewBox="0 0 1000 700" preserveAspectRatio="none">
        <defs>
          <marker id="arr" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="rgba(13,14,16,0.35)" />
          </marker>
        </defs>

        {/* Name (top-left) → Center: two-segment elbow — right then down-right */}
        <polyline
          points="200,110 280,110 310,270"
          fill="none"
          stroke="rgba(13,14,16,0.15)"
          strokeWidth="1"
          markerEnd="url(#arr)"
        />

        {/* Stats (mid-top) → Center: diagonal down-left */}
        <polyline
          points="440,145 440,200 380,270"
          fill="none"
          stroke="rgba(13,14,16,0.15)"
          strokeWidth="1"
          markerEnd="url(#arr)"
        />

        {/* Education (top-right) → Center: left then down-left */}
        <polyline
          points="690,120 560,120 530,270"
          fill="none"
          stroke="rgba(13,14,16,0.15)"
          strokeWidth="1"
          markerEnd="url(#arr)"
        />

        {/* Contact (bottom-left) → Center: right then up-right */}
        <polyline
          points="170,490 280,490 300,420"
          fill="none"
          stroke="rgba(13,14,16,0.15)"
          strokeWidth="1"
          markerEnd="url(#arr)"
        />

        {/* Skills (bottom-right) → Center: left then up-left */}
        <polyline
          points="640,460 540,460 530,410"
          fill="none"
          stroke="rgba(13,14,16,0.15)"
          strokeWidth="1"
          markerEnd="url(#arr)"
        />

        {/* Small dot at each node origin */}
        <circle cx="200" cy="110" r="3" fill="rgba(13,14,16,0.2)"/>
        <circle cx="440" cy="145" r="3" fill="rgba(13,14,16,0.2)"/>
        <circle cx="690" cy="120" r="3" fill="rgba(13,14,16,0.2)"/>
        <circle cx="170" cy="490" r="3" fill="rgba(13,14,16,0.2)"/>
        <circle cx="640" cy="460" r="3" fill="rgba(13,14,16,0.2)"/>
      </svg>

      {/* ── CENTER FOCAL: WHO AM I ── */}
      <motion.div
        className="ac-node ac-center"
        variants={fadeIn(0)}
        initial="hidden"
        animate="show"
      >
        <div className="ac-center-inner">
          <span className="ac-file-label">FILE_01 //</span>
          <h1 className="ac-graffiti">WHO AM I</h1>
          <div className="ac-center-dot-row">
            <span className="ac-dot" /><span className="ac-dot" /><span className="ac-dot" />
          </div>
        </div>
      </motion.div>

      {/* ── TOP-LEFT: Name + Role ── */}
      <motion.div
        className="ac-node ac-name"
        variants={fadeIn(0.1)}
        initial="hidden"
        animate="show"
      >
        <div className="ac-bracket-label">[ IDENTITY ]</div>
        <div className="ac-name-big">JUNHU<br />SONG</div>
        <div className="ac-role-line">Software Engineer · ML & AI</div>
        <div className="ac-role-line ac-muted">Research Assistant · UoA</div>
        <div className="ac-chevrons">&gt;&gt;&gt;</div>
      </motion.div>

      {/* ── MID-TOP: Stats cluster ── */}
      <motion.div
        className="ac-node ac-stats"
        variants={fadeIn(0.15)}
        initial="hidden"
        animate="show"
      >
        <div className="ac-stat-row">
          <div className="ac-stat-item">
            <span className="ac-stat-val">&lt;92%&gt;</span>
            <span className="ac-stat-lbl">GPA</span>
          </div>
          <div className="ac-stat-item">
            <span className="ac-stat-val">&lt;5+&gt;</span>
            <span className="ac-stat-lbl">Scholarships</span>
          </div>
          <div className="ac-stat-item">
            <span className="ac-stat-val">&lt;3+&gt;</span>
            <span className="ac-stat-lbl">Yrs Research</span>
          </div>
        </div>
        <div className="ac-stat-sub">Quality that withstands time and effort.</div>
      </motion.div>

      {/* ── TOP-RIGHT: Education ── */}
      <motion.div
        className="ac-node ac-edu"
        variants={fadeIn(0.2)}
        initial="hidden"
        animate="show"
      >
        <div className="ac-bracket-label">[ EDUCATION ]</div>
        {EDU.map((e, i) => (
          <div className="ac-edu-item" key={i}>
            <div className="ac-edu-school">{e.school}</div>
            <div className="ac-edu-degree">{e.degree}</div>
            <div className="ac-edu-period">{e.period}</div>
            {e.note && <div className="ac-edu-note">{e.note}</div>}
            {i < EDU.length - 1 && <div className="ac-edu-divider" />}
          </div>
        ))}
      </motion.div>

      {/* ── BOTTOM-LEFT: Contact ── */}
      <motion.div
        className="ac-node ac-contact"
        variants={fadeIn(0.25)}
        initial="hidden"
        animate="show"
      >
        <div className="ac-bracket-label">[ CONTACT ]</div>
        <div className="ac-contact-list">
          <div className="ac-contact-row">
            <span className="ac-contact-key">EMAIL</span>
            <span className="ac-contact-sep">•</span>
            <a href="mailto:jaysong.0130@gmail.com" className="ac-contact-val">jaysong.0130@gmail.com</a>
          </div>
          <div className="ac-contact-row">
            <span className="ac-contact-key">PHONE</span>
            <span className="ac-contact-sep">•</span>
            <span className="ac-contact-val">021-152-0262</span>
          </div>
          <div className="ac-contact-row">
            <span className="ac-contact-key">GITHUB</span>
            <span className="ac-contact-sep">•</span>
            <a href="https://github.com/json0130" target="_blank" rel="noreferrer" className="ac-contact-val ac-link">github.com/json0130</a>
          </div>
          <div className="ac-contact-row">
            <span className="ac-contact-key">LINKEDIN</span>
            <span className="ac-contact-sep">•</span>
            <a href="https://linkedin.com/in/junhu-song-762682257" target="_blank" rel="noreferrer" className="ac-contact-val ac-link">linkedin.com/junhu-song</a>
          </div>
        </div>
        <div className="ac-crosshair">
          <span className="ac-ch-h" /><span className="ac-ch-v" />
        </div>
      </motion.div>

      {/* ── BOTTOM-RIGHT: Skills ── */}
      <motion.div
        className="ac-node ac-skills"
        variants={fadeIn(0.3)}
        initial="hidden"
        animate="show"
      >
        <div className="ac-bracket-label">[ SKILLS ]</div>
        {Object.entries(SKILLS).map(([cat, skills]) => (
          <div className="ac-skill-group" key={cat}>
            <div className="ac-skill-cat">{cat}</div>
            <div className="ac-skill-chips">
              {skills.map(s => (
                <div className="ac-skill-chip" key={s} title={s}>
                  <SkillIcon name={s} />
                  <span className="ac-chip-label">{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Decorative scattered elements ── */}
      <div className="ac-deco ac-deco-1">•</div>
      <div className="ac-deco ac-deco-2">[ ]</div>
      <div className="ac-deco ac-deco-3">&gt;&gt;&gt; &lt;&lt;&lt;</div>
      <div className="ac-deco ac-deco-4">•</div>
      <div className="ac-deco ac-deco-5">// 01</div>
      <div className="ac-deco ac-deco-6">[ ]</div>
      <div className="ac-deco-barcode">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className={`ac-bar ${i % 3 === 0 ? 'ac-bar-wide' : i % 5 === 0 ? 'ac-bar-thin' : ''}`} />
        ))}
      </div>

      {/* Mobile fallback */}
      <div className="ac-mobile-fallback">
        <div className="section-label">FILE_01 // ABOUT ME</div>
        <h2 className="ac-graffiti-mobile">WHO AM I</h2>
        <div className="ac-mb-section">
          <div className="ac-bracket-label">[ IDENTITY ]</div>
          <div className="ac-mb-name">JUNHU SONG</div>
          <p className="ac-mb-body">Software Engineer · ML & AI · Research Assistant at UoA</p>
        </div>
        <div className="ac-mb-section">
          <div className="ac-bracket-label">[ STATS ]</div>
          <div className="ac-stat-row">
            {[['92%','GPA'],['5+','Scholarships'],['3+','Yrs Research']].map(([v,l]) => (
              <div className="ac-stat-item" key={l}>
                <span className="ac-stat-val">&lt;{v}&gt;</span>
                <span className="ac-stat-lbl">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ac-mb-section">
          <div className="ac-bracket-label">[ EDUCATION ]</div>
          {EDU.map((e, i) => (
            <div className="ac-edu-item" key={i}>
              <div className="ac-edu-school">{e.school}</div>
              <div className="ac-edu-degree">{e.degree}</div>
              <div className="ac-edu-period">{e.period}</div>
              {e.note && <div className="ac-edu-note">{e.note}</div>}
              {i < EDU.length - 1 && <div className="ac-edu-divider" />}
            </div>
          ))}
        </div>
        <div className="ac-mb-section">
          <div className="ac-bracket-label">[ CONTACT ]</div>
          <div className="ac-contact-list">
            {[
              ['EMAIL','jaysong.0130@gmail.com','mailto:jaysong.0130@gmail.com'],
              ['GITHUB','github.com/json0130','https://github.com/json0130'],
              ['LINKEDIN','linkedin.com/junhu-song','https://linkedin.com/in/junhu-song-762682257'],
            ].map(([k,v,href]) => (
              <div className="ac-contact-row" key={k}>
                <span className="ac-contact-key">{k}</span>
                <span className="ac-contact-sep">•</span>
                <a href={href} target="_blank" rel="noreferrer" className="ac-contact-val ac-link">{v}</a>
              </div>
            ))}
          </div>
        </div>
        <div className="ac-mb-section">
          <div className="ac-bracket-label">[ SKILLS ]</div>
          {Object.entries(SKILLS).map(([cat, skills]) => (
            <div className="ac-skill-group" key={cat}>
              <div className="ac-skill-cat">{cat}</div>
              <div className="ac-skill-chips">
                {skills.map(s => (
                  <div className="ac-skill-chip" key={s} title={s}>
                    <SkillIcon name={s} />
                    <span className="ac-chip-label">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
