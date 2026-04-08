import { motion } from 'framer-motion';
import './Achievements.css';

const AWARDS = [
  {
    title: 'IEEE RO-MAN 2025 Robot Design Competition',
    location: 'Netherlands',
    year: '2025',
    type: 'COMPETITION',
    note: 'Accepted',
    highlight: true,
  },
  {
    title: "Engineering Dean's Honour's List",
    location: 'University of Auckland',
    year: '2022, 2023',
    type: 'ACADEMIC',
    note: 'GPA: 92%',
    highlight: true,
  },
  {
    title: 'IEEE NZ North R&A Society Service Award',
    location: 'New Zealand',
    year: '2022, 2023, 2024',
    type: 'SERVICE',
    note: '3 consecutive years',
    highlight: false,
  },
  {
    title: 'WRO – Future Innovator Category',
    location: 'World Robot Olympiad',
    year: '2022',
    type: 'COMPETITION',
    note: '2nd Place',
    highlight: false,
  },
  {
    title: 'Kaggle Competitions',
    location: 'Kaggle',
    year: '2023, 2024',
    type: 'ML',
    note: 'Multiple Bronze Medals',
    highlight: false,
  },
];

const SCHOLARSHIPS = [
  {
    title: 'International Secondary School Leaver Scholarship',
    location: 'University of Auckland',
    year: '2022',
    type: 'SCHOLARSHIP',
    note: '$20,000',
    highlight: true,
  },
  {
    title: 'Summer Research Scholarship',
    location: 'University of Auckland',
    year: '2023',
    type: 'SCHOLARSHIP',
    note: '$7,000 – Sign Language Project',
    highlight: true,
  },
  {
    title: '360 International Exchange Award',
    location: 'NUS Singapore',
    year: '2024',
    type: 'SCHOLARSHIP',
    note: '$1,800',
    highlight: false,
  },
  {
    title: 'Engineering Student Support Scholarship',
    location: 'University of Auckland',
    year: '2022',
    type: 'SCHOLARSHIP',
    note: '$1,750',
    highlight: false,
  },
];

const TYPE_COLORS = {
  COMPETITION: '#FF9F43',
  ACADEMIC: '#4FA8FF',
  SERVICE: '#A8E6A3',
  SCHOLARSHIP: '#C8A8FF',
  ML: '#FF6B9D',
};

function AchCard({ a, delay }) {
  return (
    <motion.div
      className={`ach-card card ${a.highlight ? 'ach-highlight' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="ach-top">
        <div
          className="ach-type"
          style={{ color: TYPE_COLORS[a.type], borderColor: TYPE_COLORS[a.type] + '40', background: TYPE_COLORS[a.type] + '14' }}
        >
          {a.type}
        </div>
        <div className="ach-year mono-tiny">{a.year}</div>
      </div>
      <div className="ach-title">{a.title}</div>
      <div className="ach-location">{a.location}</div>
      {a.note && <div className="ach-note">{a.note}</div>}
    </motion.div>
  );
}

export default function Achievements() {
  return (
    <div className="ach-page section-page">
      <div className="ach-inner">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="ach-header"
        >
          <div className="section-label">FILE_02 // ACHIEVEMENTS</div>
          <h2 className="section-title">Awards &<br />Scholarships.</h2>
        </motion.div>

        {/* Awards Section */}
        <div className="ach-section">
          <motion.div
            className="ach-section-header"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="ach-section-label">AWARDS &amp; RECOGNITION</span>
          </motion.div>
          <div className="ach-grid">
            {AWARDS.map((a, i) => (
              <AchCard key={a.title} a={a} delay={i * 0.06} />
            ))}
          </div>
        </div>

        {/* Scholarships Section */}
        <div className="ach-section">
          <motion.div
            className="ach-section-header"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <span className="ach-section-label">SCHOLARSHIPS</span>
            <span className="ach-section-meta">Total: <strong>~$30,550</strong></span>
          </motion.div>
          <div className="ach-grid ach-grid-scholar">
            {SCHOLARSHIPS.map((a, i) => (
              <AchCard key={a.title} a={a} delay={0.3 + i * 0.06} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
