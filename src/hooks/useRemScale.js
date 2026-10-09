import { useEffect, useState } from 'react';

// Current root font size relative to the 16px design baseline (1 on the
// 1920x945 design viewport). Lets JS-computed pixel geometry follow the same
// fluid scale as the rem-based CSS.
const read = () => parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;

export default function useRemScale() {
  const [scale, setScale] = useState(read);

  useEffect(() => {
    const update = () => setScale(read());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return scale;
}
