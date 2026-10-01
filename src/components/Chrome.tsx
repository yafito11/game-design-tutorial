import { Link, useNavigate } from 'react-router-dom';
import { getAllLessons, PHASES } from '../lib/course';
import { useProgress } from '../lib/progress';
import { useState } from 'react';
import { searchLessons } from '../lib/course';

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
                  <b>{r.title}</b><small>{phaseLabel} · {r.tags.join(', ')}</small>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <a className="gh" href="https://github.com" target="_blank" rel="noreferrer">Docs</a>
      <Link className="gh" to="/settings">⚙ AI</Link>
    </header>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="pbar"><div className="pfill" style={{ width: `${value}%` }} /></div>;
}
