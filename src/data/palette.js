export const PALETTE = [
  { gradient: 'linear-gradient(135deg, #0d0221 0%, #4FA8FF 100%)', disc: ['#0d0221', '#1a3a6e', '#4FA8FF'] },
  { gradient: 'linear-gradient(135deg, #1a0033 0%, #c084fc 100%)', disc: ['#1a0033', '#3b1063', '#c084fc'] },
  { gradient: 'linear-gradient(135deg, #001a1a 0%, #00d4aa 100%)', disc: ['#001a1a', '#003d38', '#00d4aa'] },
  { gradient: 'linear-gradient(135deg, #2a0000 0%, #ff6b6b 100%)', disc: ['#2a0000', '#5a1010', '#ff6b6b'] },
  { gradient: 'linear-gradient(135deg, #0a1a00 0%, #a3e635 100%)', disc: ['#0a1a00', '#1e3d00', '#a3e635'] },
  { gradient: 'linear-gradient(135deg, #1a0d00 0%, #fb923c 100%)', disc: ['#1a0d00', '#3d2000', '#fb923c'] },
  { gradient: 'linear-gradient(135deg, #00091a 0%, #38bdf8 100%)', disc: ['#00091a', '#002040', '#38bdf8'] },
  { gradient: 'linear-gradient(135deg, #1a001a 0%, #f472b6 100%)', disc: ['#1a001a', '#3d003d', '#f472b6'] },
];

export function conicGrad(colors) {
  const [dark, mid, accent] = colors;
  return `conic-gradient(from 0deg,
    ${dark} 0deg 30deg, ${mid} 30deg 60deg, ${accent} 60deg 90deg,
    ${dark} 90deg 120deg, ${mid} 120deg 150deg, ${accent} 150deg 180deg,
    ${dark} 180deg 210deg, ${mid} 210deg 240deg, ${accent} 240deg 270deg,
    ${dark} 270deg 300deg, ${mid} 300deg 330deg, ${accent} 330deg 360deg)`;
}

export const DEFAULT_DISC = conicGrad(['#1a1a2e', '#16213e', '#0f3460']);
