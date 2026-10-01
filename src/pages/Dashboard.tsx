import { Link } from 'react-router-dom';
import { getAllLessons } from '../lib/course';
import { useProgress } from '../lib/progress';
import { ProgressBar } from '../components/Chrome';

export default function Dashboard() {
  const lessons = getAllLessons().filter(l => !l.path.includes('/README') && !l.path.includes('roadmap') && !l.path.includes('glossary'));
  const { progress, pct } = useProgress();
  const percent = pct(lessons.length);
  const current = lessons.find(l => l.id === progress.current) || lessons.find(l => !progress.completed.includes(l.id));
  const next = lessons.find(l => !progress.completed.includes(l.id));

  const totalMinutes = lessons.reduce((s, l) => s + l.duration, 0);

  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">INTERACTIVE GAME-DEV ACADEMY</p>
          <h1>Learn Game Dev.<br />Build Games with AI.</h1>
          <p className="muted">Konsep → desain → coding → asset → gameplay → testing → build. Pola: PLAN → ASK AI → IMPLEMENT → RUN → DEBUG → ITERATE.</p>
          <div className="hero-actions">
            {next ? <Link className="btn primary" to={`/learn/${next.id}`}>▶ Continue: {next.title}</Link> : <span className="btn">🎉 Semua selesai!</span>}
            <Link className="btn" to="/roadmap">Lihat Roadmap</Link>
          </div>
        </div>
        <div className="stat-card">
          <h3>Progress</h3>
          <div className="big">{percent}%</div>
          <ProgressBar value={percent} />
          <p className="muted small">{progress.completed.length}/{lessons.length} lessons · ~{totalMinutes} mnt total</p>
          {current && <p className="small">📍 Current: <Link to={`/learn/${current.id}`}>{current.title}</Link></p>}
          <div className="stats-grid">
            <div><b>{lessons.length}</b><span>lessons</span></div>
            <div><b>11</b><span>phases</span></div>
            <div><b>1</b><span>project</span></div>
          </div>
        </div>
      </div>

      <h2>Learning Path</h2>
      <div className="cards">
        {[
          { t: 'Fundamentals', d: 'Game loop, mechanics, pipeline', to: '/learn/fund-gamedev-101' },
          { t: 'AI Coding', d: 'Pair programmer + prompt', to: '/learn/ai-coding-201' },
          { t: 'OpenCode', d: 'Agent workflow idea→build', to: '/learn/oc-setup-301' },
          { t: 'Game Programming', d: 'dt, input, collision', to: '/learn/gprog-dt-501' },
          { t: 'Game Design', d: 'Core loop yang fun', to: '/learn/gdesign-core-601' },
          { t: 'Project 01', d: 'Breakout playable', to: '/learn/project-breakout-01' },
        ].map(c => (
          <Link key={c.t} className="card" to={c.to}>
            <h3>{c.t}</h3><p>{c.d}</p><span className="go">Mulai →</span>
          </Link>
        ))}
      </div>

      <h2>Milestones</h2>
      <ol className="timeline">
        <li className={progress.completed.includes('fund-gameloop-102') ? 'hit' : ''}><b>M1</b> Paham game loop + dt</li>
        <li className={progress.completed.includes('oc-workflow-302') ? 'hit' : ''}><b>M2</b> Workflow OpenCode jalan</li>
        <li className={progress.completed.includes('gprog-collision-503') ? 'hit' : ''}><b>M3</b> Movement + collision stabil</li>
        <li className={progress.completed.includes('project-breakout-01') ? 'hit' : ''}><b>M4</b> Breakout playable 60 detik</li>
      </ol>
    </div>
  );
}
