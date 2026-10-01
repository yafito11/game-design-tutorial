import { Link, useNavigate } from 'react-router-dom';
import { getAllLessons, PHASES } from '../lib/course';
import { useProgress } from '../lib/progress';
import { useTheme } from '../lib/theme';
import { useState } from 'react';
import { searchLessons } from '../lib/course';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="theme-btn" onClick={toggle} aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'} title="Mode terang/gelap">
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" /></svg>
      )}
    </button>
  );
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lessons = getAllLessons();
  const { progress } = useProgress();
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="side-head">
          <span className="logo">◉ AI Game Academy</span>
          <button className="icon-btn only-mobile" onClick={onClose}>✕</button>
        </div>
        <nav>
          <Link to="/" className="side-link" onClick={onClose}>📊 Dashboard</Link>
          <Link to="/roadmap" className="side-link" onClick={onClose}>🗺 Roadmap</Link>
          <Link to="/glossary" className="side-link" onClick={onClose}>📖 Glossary</Link>
          <Link to="/settings" className="side-link" onClick={onClose}>⚙ Settings AI</Link>
          {PHASES.filter(p => p.id !== 'general').map(ph => {
            const items = lessons.filter(l => l.phase === ph.id);
            if (!items.length) return null;
            return (
              <div key={ph.id} className="phase-group">
                <div className="phase-label">{ph.label} <span className="count">{items.filter(i => progress.completed.includes(i.id)).length}/{items.length}</span></div>
                {items.map(l => (
                  <Link key={l.id} to={`/learn/${l.id}`} title={l.title} className={`side-link sub ${progress.completed.includes(l.id) ? 'done' : ''}`} onClick={onClose}>
                    <span className="check">{progress.completed.includes(l.id) ? '✓' : '○'}</span><span className="side-title">{l.title}</span>
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const results = searchLessons(q);
  return (
    <header className="topbar">
      <button className="icon-btn only-mobile" onClick={onMenu}>☰</button>
      <Link to="/" className="brand">◉ AI Game Dev Academy</Link>
      <div className="search-wrap">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && results[0]) { nav(`/learn/${results[0].id}`); setQ(''); } }}
          placeholder="Search: collision, sprite, opencode…"
        />
        {q && (
          <div className="search-drop">
            {results.length === 0 && <div className="search-empty">Tidak ditemukan.</div>}
            {results.map(r => {
              const phaseLabel = PHASES.find(p => p.id === r.phase)?.label || r.phase;
              return (
                <Link key={r.id} to={`/learn/${r.id}`} onClick={() => setQ('')}>
                  <b>{r.title}</b><small>{phaseLabel}{r.tags.length ? `, ${r.tags.slice(0, 3).join(', ')}` : ''}</small>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <ThemeToggle />
      <Link className="gh" to="/settings">Pengaturan AI</Link>
    </header>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="pbar"><div className="pfill" style={{ width: `${value}%` }} /></div>;
}
