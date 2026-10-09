import { useEffect, useState } from 'react';
import './ThemeSwitcher.css';

// Colour-scheme picker. Midnight is the default; the other palettes stay available here.
// The choice is saved in localStorage and applied before first paint by a script in index.html.
const DEFAULT_THEME = 'c';
const THEMES = [
  { id: 'c',       label: 'Midnight',         swatch: ['#0A0F1E', '#5AA9FF', '#B28CFF'] },
  { id: 'current', label: 'Light (original)', swatch: ['#ECEEF1', '#4FA8FF', '#0D0E10'] },
  { id: 'a',       label: 'A · Ice & cobalt', swatch: ['#EEF2F7', '#2F7BFF', '#00C2F0'] },
  { id: 'b',       label: 'B · Warm paper',   swatch: ['#F3F1EC', '#3B82F6', '#FF7A3D'] },
];

const readTheme = () => document.documentElement.dataset.theme || DEFAULT_THEME;

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(readTheme);
  const [open, setOpen] = useState(false);

  const apply = (id) => {
    setTheme(id);
    setOpen(false);
  };

  // Keep <html data-theme>, the saved choice and the 3D scene in sync with the selection
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch { /* private mode */ }
    window.dispatchEvent(new Event('themechange'));   // the 3D scene re-reads its colours
  }, [theme]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const current = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className={`theme-switcher ${open ? 'is-open' : ''}`} role="group" aria-label="Colour scheme">
      <button
        type="button"
        className="ts-toggle"
        aria-expanded={open}
        aria-label="Colour scheme"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ts-swatch">
          {current.swatch.map((c) => <i key={c} style={{ background: c }} />)}
        </span>
        <span className="ts-title mono-tiny">THEME</span>
      </button>
      {open && THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`ts-opt ${theme === t.id ? 'is-active' : ''}`}
          aria-pressed={theme === t.id}
          onClick={() => apply(t.id)}
        >
          <span className="ts-swatch">
            {t.swatch.map((c) => <i key={c} style={{ background: c }} />)}
          </span>
          <span className="ts-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
