import { getAllLessons } from '../lib/course';
import MarkdownView from '../components/MarkdownView';

function findDoc(name: string) {
  const all = getAllLessons();
  return all.find(l => l.path.endsWith(`/${name}`) || l.path.endsWith(name));
}

export function RoadmapPage() {
  const doc = findDoc('roadmap.md');
  if (!doc) return <div className="page"><h1>roadmap.md belum ada</h1></div>;
  return <div className="page"><h1>Roadmap</h1><MarkdownView body={doc.body} /></div>;
}

export function GlossaryPage() {
  const doc = findDoc('glossary.md');
  if (!doc) return <div className="page"><h1>glossary.md belum ada</h1></div>;
  return <div className="page"><h1>Glossary</h1><MarkdownView body={doc.body} /></div>;
}
