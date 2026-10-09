import { motion } from 'framer-motion';
import { SKILLS, EDU, STATS, CONTACT } from '../data/profile';
import './About.css';

const BIO = 'Software engineer and researcher working where machine learning meets robotics. '
  + 'Research Assistant at the CARES Robotics Lab, and a PhD student in Robotics & AI at the University of Auckland, '
  + 'focused on human-robot interaction and advanced ML systems.';

// Notes drop onto the board one after another
const drop = (i = 0, rot = 0) => ({
  initial: { opacity: 0, y: -26, rotate: rot - 6, scale: 0.94 },
  animate: { opacity: 1, y: 0, rotate: rot, scale: 1 },
  transition: { delay: 0.12 * i, duration: 0.7, ease: [0.34, 1.3, 0.64, 1] },
});

const linkProps = (href) => (href && !href.startsWith('mailto:') ? { target: '_blank', rel: 'noreferrer' } : {});

// Red strings between pins. Coordinates are tenths of a rem and match the note positions in
// About.css (the board is 96rem × 50rem), so they stay attached at every screen size.
const STRINGS = [
  'M145 160 Q305 232 470 160',     // about → education
  'M470 160 Q640 226 810 160',     // education → skills
  'M815 8 Q850 90 810 160',        // stats → skills
  'M270 408 Q380 270 470 160',     // contact → education
];

// A slightly wobbly hand-drawn ring
const RING = 'M8 34 C6 10 70 2 98 18 C124 33 92 66 46 62 C14 60 4 44 18 26';

export default function About() {
  return (
    <div className="section-page ab-page">
      <div className="ab-board">
        <svg className="ab-strings" viewBox="0 0 960 500" aria-hidden="true">
          {STRINGS.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              className="ab-string"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.9 + i * 0.15, duration: 0.9, ease: 'easeInOut' }}
            />
          ))}
        </svg>

        {/* ── Title, written straight onto the board ── */}
        <motion.header className="ab-title-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="ab-kicker">FILE_01 / ABOUT ME</div>
          <h1 className="ab-title">Junhu Song</h1>
          <svg className="ab-underline" viewBox="0 0 420 26" aria-hidden="true">
            <motion.path
              d="M4 16 C60 4 110 24 170 12 C230 0 280 22 340 10 C370 5 395 12 416 8"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
            />
          </svg>
          <div className="ab-aside">
            <svg viewBox="0 0 60 40" aria-hidden="true"><path d="M4 6 C20 2 44 12 52 32 M44 26 L53 34 L58 22" /></svg>
            <span>that's me!</span>
          </div>
        </motion.header>

        {/* ── Sticker ── */}
        <motion.div className="ab-sticker" {...drop(5, 9)}>
          <span className="ab-sticker-top">right now</span>
          <span className="ab-sticker-main">PhD</span>
          <span className="ab-sticker-sub">Robotics &amp; AI<br />@ UoA</span>
        </motion.div>

        {/* ── Stats (pink) ── */}
        <motion.section className="ab-note ab-stats" style={{ '--note': '#FFB9CB' }} {...drop(0, -1.5)}>
          <span className="ab-pin" />
          <h2>the numbers</h2>
          <div className="ab-stat-row">
            {STATS.map((s, i) => (
              <div className="ab-stat" key={s.label}>
                <svg className="ab-ring" viewBox="0 0 130 70" aria-hidden="true" style={{ transform: `rotate(${i * 7 - 6}deg)` }}>
                  <path d={RING} />
                </svg>
                <span className="ab-stat-val">{s.value}</span>
                <span className="ab-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── About (yellow) ── */}
        <motion.section className="ab-note ab-about" style={{ '--note': '#FFE680' }} {...drop(1, -2.2)}>
          <span className="ab-pin" />
          <h2>about me</h2>
          <p>{BIO}</p>
          <p className="ab-sign">— Jay</p>
        </motion.section>

        {/* ── Education (blue) ── */}
        <motion.section className="ab-note ab-edu" style={{ '--note': '#B9DDFF' }} {...drop(2, 1.6)}>
          <span className="ab-pin" />
          <h2>where I studied</h2>
          <ol>
            {EDU.map((e, i) => (
              <li key={e.degree} className={i === 0 ? 'is-now' : ''}>
                <span className="ab-edu-degree">{i === 0 && <b className="ab-now">now ★</b>}{e.degree}</span>
                <span className="ab-edu-school">{e.school}</span>
                <span className="ab-edu-meta">{e.period}{e.note ? ` · ${e.note}` : ''}</span>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* ── Skills (ruled paper, no icons) ── */}
        <motion.section className="ab-note ab-skills" style={{ '--note': '#FBF8EE' }} {...drop(3, -1)}>
          <span className="ab-pin" />
          <h2>things I use</h2>
          {Object.entries(SKILLS).map(([cat, list]) => (
            <div className="ab-skill-group" key={cat}>
              <h3><mark>{cat}</mark></h3>
              <p>{list.join(' · ')}</p>
            </div>
          ))}
        </motion.section>

        {/* ── Contact (index card with tape) ── */}
        <motion.section className="ab-note ab-contact" style={{ '--note': '#FFFFFF' }} {...drop(4, 1)}>
          <span className="ab-pin" />
          <span className="ab-tape" />
          <h2>say hello</h2>
          <ul>
            {CONTACT.map(c => (
              <li key={c.key}>
                <span className="ab-contact-key">{c.key.toLowerCase()}</span>
                {c.href
                  ? <a href={c.href} {...linkProps(c.href)}>{c.label} ↗</a>
                  : <span>{c.label}</span>}
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
