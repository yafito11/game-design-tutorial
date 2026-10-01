import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'ai-game-learning:theme';

export function getTheme(): Theme {
  if (typeof document !== 'undefined') {
    const t = document.documentElement.dataset.theme;
    if (t === 'dark' || t === 'light') return t;
  }
  try {
    const s = localStorage.getItem(KEY);
    if (s === 'dark' || s === 'light') return s;
  } catch {}
  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(KEY, theme); } catch {}
  }, [theme]);
  return { theme, toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) };
}
