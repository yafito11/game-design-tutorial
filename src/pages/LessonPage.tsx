import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getLessonById, getPrevNext } from '../lib/course';
import { useProgress } from '../lib/progress';
import MarkdownView from '../components/MarkdownView';
import Assistant from '../components/Assistant';

export default function LessonPage() {
  const { id } = useParams();
  const lesson = id ? getLessonById(id) : undefined;
  const { progress, toggleComplete, markComplete, setCurrent } = useProgress();

  useEffect(() => {
    if (id) setCurrent(id);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!lesson) return <div className="page"><h1>Lesson tidak ditemukan</h1><Link to="/">← Dashboard</Link></div>;

  const { prev, next } = getPrevNext(lesson.id);
  const done = progress.completed.includes(lesson.id);

  return (
    <div className="page lesson">
      <nav className="crumbs">
        <Link to="/">Home</Link> / <span>{lesson.phase}</span> / <b>{lesson.title}</b>
      </nav>
      <div className="lesson-head">
        <div>
          <h1>{lesson.title}</h1>
          <div className="meta">
            <span className={`pill ${lesson.difficulty}`}>{lesson.difficulty}</span>
            <span className="pill">⏱ {lesson.duration} min</span>
            <span className="pill">{lesson.phase}</span>
            {lesson.tags.map(t => <span key={t} className="pill ghost">#{t}</span>)}
          </div>
        </div>
        <div className="lesson-actions">
          <button className={done ? 'btn primary' : 'btn'} onClick={() => toggleComplete(lesson.id)}>
            {done ? '✓ Completed' : 'Mark as Complete'}
          </button>
          {next && <button className="btn" onClick={() => { markComplete(lesson.id); }}>Selesai & Lanjut →</button>}
        </div>
      </div>

      {lesson.prerequisites.length > 0 && (
        <div className="callout warn">Prerequisites: {lesson.prerequisites.join(', ')}. Selesaikan dulu agar tidak bingung.</div>
      )}

      <MarkdownView body={lesson.body} />

      <Assistant lessonId={lesson.id} lessonTitle={lesson.title} />

      <div className="prevnext">
        {prev ? <Link to={`/learn/${prev.id}`} className="pn">← {prev.title}</Link> : <span />}
        {next ? <Link to={`/learn/${next.id}`} className="pn right">{next.title} →</Link> : <span />}
      </div>
    </div>
  );
}
