import { useEffect, useState } from 'react';

const KEY = 'ai-game-learning:v1';

export interface Progress {
  completed: string[];
  current: string | null;
  lastVisited: string | null;
  updatedAt: number;
}

const empty: Progress = { completed: [], current: null, lastVisited: null, updatedAt: Date.now() };

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch { return empty; }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress));
  }, [progress]);

  const toggleComplete = (id: string) =>
    setProgress(p => ({
      ...p,
      completed: p.completed.includes(id) ? p.completed.filter(x => x !== id) : [...p.completed, id],
      updatedAt: Date.now(),
    }));

  const markComplete = (id: string) =>
    setProgress(p => p.completed.includes(id) ? p : { ...p, completed: [...p.completed, id], updatedAt: Date.now() });

  const setCurrent = (id: string) =>
    setProgress(p => ({ ...p, current: id, lastVisited: id, updatedAt: Date.now() }));

  const pct = (total: number) => total === 0 ? 0 : Math.round((progress.completed.length / total) * 100);

  return { progress, toggleComplete, markComplete, setCurrent, pct };
}

export function getProgressSnapshot(): Progress { return load(); }
