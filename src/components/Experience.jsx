import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './Experience.css';

// Combined chronological timeline — work, education, awards, scholarships
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
      'Developed EfficientNet V2-S emotion classifier at 81% accuracy (ChatBox V2)',
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
  RESEARCH:    'var(--blue)',
  INDUSTRY:    '#A8E6A3',
  TEACHING:    '#C8A8FF',
  EXTRA:       '#FF9F43',
  AWARD:       '#4FA8FF',
  SCHOLARSHIP: '#FFD93D',
  COMPETITION: '#FF6B9D',
};

export default function Experience() {
  const [active, setActive] = useState(null);
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);

  const handleNodeClick = (i) => {
    const next = active === i ? null : i;
    setActive(next);

    if (next !== null) {
      const node = nodeRefs.current[i];
      const container = containerRef.current;
      if (node && container) {
        const nodeLeft = node.offsetLeft;
        const nodeWidth = node.offsetWidth;
        const containerWidth = container.offsetWidth;
        container.scrollTo({
          left: nodeLeft - containerWidth / 2 + nodeWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className="exp-page section-page">
      <div className="exp-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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

        {/* Horizontal Timeline */}
        <div className="htimeline-outer" ref={containerRef}>
          <div className="htimeline">
            <div className="htimeline-rail" />

            {TIMELINE.map((e, i) => {
              const isTop = i % 2 === 0;
              const isActive = active === i;
              const color = TYPE_COLORS[e.type];

              return (
                <motion.div
                  key={`${e.role}-${i}`}
                  ref={el => { nodeRefs.current[i] = el; }}
                  className="htimeline-node"
                  initial={{ opacity: 0, y: isTop ? -20 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  onClick={() => handleNodeClick(i)}
                >
                  {/* Top half */}
                  <div className="htimeline-half htimeline-half-top">
                    {isTop ? (
                      <motion.div
                        className={`htimeline-card card ${isActive ? 'htimeline-card-active' : ''}`}
                        animate={{ y: isActive ? -8 : 0, scale: isActive ? 1.03 : 1 }}
                        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{ borderColor: isActive ? color : undefined }}
                      >
                        <div className="exp-type-badge" style={{ color, background: color + '20', borderColor: color + '50' }}>
                          {e.type}
                        </div>
                        <div className="htimeline-role">{e.role}</div>
                        <div className="htimeline-org">{e.org}</div>
                        {e.note && <div className="htimeline-note" style={{ color }}>{e.note}</div>}
                        {isActive && (
                          <motion.ul
                            className="htimeline-items"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                          >
                            {e.items.map((item, j) => <li key={j}>{item}</li>)}
                          </motion.ul>
                        )}
                      </motion.div>
                    ) : (
                      <div className="htimeline-period mono-tiny" style={{ color }}>{e.period}</div>
                    )}
                    <div className="htimeline-stem" style={{ background: isActive ? color : undefined }} />
                  </div>

                  {/* Dot */}
                  <motion.div
                    className="htimeline-dot"
                    style={{ background: color }}
                    animate={{
                      scale: isActive ? 1.6 : 1,
                      boxShadow: isActive ? `0 0 22px ${color}90` : `0 0 8px ${color}50`,
                    }}
                    transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                  />

                  {/* Bottom half */}
                  <div className="htimeline-half htimeline-half-bottom">
                    <div className="htimeline-stem" style={{ background: isActive ? color : undefined }} />
                    {!isTop ? (
                      <motion.div
                        className={`htimeline-card card ${isActive ? 'htimeline-card-active' : ''}`}
                        animate={{ y: isActive ? 8 : 0, scale: isActive ? 1.03 : 1 }}
                        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{ borderColor: isActive ? color : undefined }}
                      >
                        <div className="exp-type-badge" style={{ color, background: color + '20', borderColor: color + '50' }}>
                          {e.type}
                        </div>
                        <div className="htimeline-role">{e.role}</div>
                        <div className="htimeline-org">{e.org}</div>
                        {e.note && <div className="htimeline-note" style={{ color }}>{e.note}</div>}
                        {isActive && (
                          <motion.ul
                            className="htimeline-items"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                          >
                            {e.items.map((item, j) => <li key={j}>{item}</li>)}
                          </motion.ul>
                        )}
                      </motion.div>
                    ) : (
                      <div className="htimeline-period mono-tiny" style={{ color }}>{e.period}</div>
                    )}
                  </div>

                  {/* Year marker */}
                  {(i === 0 || TIMELINE[i - 1].year !== e.year) && (
                    <div className="htimeline-year mono-tiny">{e.year}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
