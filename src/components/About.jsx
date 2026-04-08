import { motion } from 'framer-motion';
import './About.css';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
});

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
    FAISS: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#4FA8FF" opacity="0.15"/>
        <circle cx="16" cy="16" r="5" fill="none" stroke="#4FA8FF" strokeWidth="1.3"/>
        <circle cx="10" cy="10" r="2" fill="#4FA8FF" opacity="0.6"/>
        <circle cx="22" cy="10" r="2" fill="#4FA8FF" opacity="0.6"/>
        <circle cx="22" cy="22" r="2" fill="#4FA8FF" opacity="0.6"/>
        <circle cx="10" cy="22" r="2" fill="#4FA8FF" opacity="0.6"/>
        <path d="M10 10l4.5 4.5M22 10l-4.5 4.5M22 22l-4.5-4.5M10 22l4.5-4.5" stroke="#4FA8FF" strokeWidth="0.8" opacity="0.4"/>
      </svg>
    ),
    Supabase: (
      <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
        <circle cx="16" cy="16" r="15" fill="#3ECF8E" opacity="0.15"/>
        <path d="M10 22L16 8l6 14H10z" fill="#3ECF8E" opacity="0.7"/>
        <path d="M22 10L16 24l-6-14h12z" fill="#3ECF8E" opacity="0.4"/>
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

  // Fallback: colored circle with first letter
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
    note: null,
  },
  {
    school: 'National University of Singapore',
    degree: 'Exchange – Computer Science',
    period: 'Jul 2024 – Dec 2024',
    note: null,
  },
  {
    school: 'University of Auckland',
    degree: 'BE(Hons) Software Engineering',
    period: 'Mar 2022 – Nov 2025',
    note: "Dean's Honour's List 2022, 2023 · GPA: 92%",
  },
];

export default function About() {
  return (
    <div className="about-page section-page">
      <div className="about-inner">
        {/* Left column */}
        <motion.div
          className="about-left"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={fadeUp(0)}>
            <div className="section-label">FILE_01 // ABOUT ME</div>
            <h2 className="section-title">Who I Am.</h2>
          </motion.div>

          <motion.div variants={fadeUp(0.1)} className="about-bio card">
            <div className="avatar-placeholder">
              <span>JH</span>
            </div>
            <div className="bio-text">
              <p>
                I'm <strong>Junhu Song</strong>, a Software Engineering student at the University of Auckland
                with a passion for <span className="blue-highlight">machine learning</span>, robotics, and building
                meaningful digital experiences.
              </p>
              <p>
                Currently a <strong>Research Assistant</strong> at the CARES Robotics Lab, where I develop
                emotion-understanding companion robots and multi-robot communication systems.
              </p>
              <p>
                I'm about to begin my <strong>Master of Engineering in Robotics & AI</strong> in 2026,
                continuing to push boundaries in human-robot interaction.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp(0.2)} className="about-contact card">
            <div className="contact-row">
              <span className="mono-tiny blue">EMAIL</span>
              <span>jaysong.0130@gmail.com</span>
            </div>
            <div className="contact-row">
              <span className="mono-tiny blue">PHONE</span>
              <span>021-152-0262</span>
            </div>
            <div className="contact-row">
              <span className="mono-tiny blue">GITHUB</span>
              <a href="https://github.com/json0130" target="_blank" rel="noreferrer">github.com/json0130</a>
            </div>
            <div className="contact-row">
              <span className="mono-tiny blue">LINKEDIN</span>
              <a href="https://linkedin.com/in/junhu-song-762682257" target="_blank" rel="noreferrer">linkedin.com/junhu-song</a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right column */}
        <motion.div
          className="about-right"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Education */}
          <motion.div variants={fadeUp(0.15)} className="about-section">
            <div className="section-label">EDUCATION</div>
            <div className="edu-list">
              {EDU.map((e, i) => (
                <div className="edu-item card" key={i}>
                  <div className="edu-header">
                    <div>
                      <div className="edu-school">{e.school}</div>
                      <div className="edu-degree">{e.degree}</div>
                    </div>
                    <div className="edu-period mono-tiny">{e.period}</div>
                  </div>
                  {e.note && <div className="edu-note tag">{e.note}</div>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills with icons */}
          <motion.div variants={fadeUp(0.25)} className="about-section">
            <div className="section-label">SKILLS</div>
            <div className="skills-grid">
              {Object.entries(SKILLS).map(([cat, skills]) => (
                <div className="skill-group card" key={cat}>
                  <div className="skill-cat">{cat}</div>
                  <div className="skill-icons-row">
                    {skills.map(s => (
                      <div className="skill-icon-chip" key={s} title={s}>
                        <SkillIcon name={s} />
                        <span className="skill-icon-label">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
