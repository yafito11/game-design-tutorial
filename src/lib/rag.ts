import { getAllLessons } from './course';

export interface Chunk {
  lessonId: string;
  lessonTitle: string;
  phase: string;
  heading: string;
  text: string;
}

let cache: Chunk[] | null = null;

function splitBody(lessonId: string, title: string, phase: string, body: string): Chunk[] {
  const parts = body.split(/^##\s+/m);
  const chunks: Chunk[] = [];
  for (const part of parts) {
    const t = part.trim();
    if (!t) continue;
    const nl = t.indexOf('\n');
    const heading = nl > 0 && parts.indexOf(part) > 0 ? t.slice(0, nl).trim() : 'Ringkasan';
    const text = (nl > 0 && parts.indexOf(part) > 0 ? t.slice(nl) : t)
      .replace(/```[\s\S]*?```/g, ' ') // buang code block dari skor teks
      .replace(/[#>*`]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1500);
    if (text.length < 40) continue;
    chunks.push({ lessonId, lessonTitle: title, phase, heading: heading.slice(0, 60), text });
  }
  return chunks;
}

export function getChunks(): Chunk[] {
  if (cache) return cache;
  const lessons = getAllLessons().filter(l =>
    !l.path.endsWith('/README.md') && !l.path.endsWith('roadmap.md') && !l.path.endsWith('glossary.md'));
  cache = lessons.flatMap(l => splitBody(l.id, l.title, l.phase, l.body));
  return cache;
}

function tokens(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
}

export interface Hit extends Chunk { score: number }

export function retrieve(query: string, opts?: { topK?: number; focusLessonId?: string }): Hit[] {
  const topK = opts?.topK ?? 3;
  const q = tokens(query);
  if (!q.length) return [];
  const qset = new Set(q);
  const hits: Hit[] = [];
  for (const c of getChunks()) {
    const titleT = tokens(c.lessonTitle);
    const headT = tokens(c.heading);
    const bodyT = tokens(c.text);
    const bodySet = new Set(bodyT);
    let score = 0;
    for (const w of qset) {
      if (titleT.includes(w)) score += 3;
      if (headT.includes(w)) score += 2;
      if (bodySet.has(w)) score += 1;
      // dukung istilah Indonesia umum: samakan awalan (lompat/lompatan, serang/serangan)
      if (w.length > 4) {
        for (const b of bodySet) { if (b.startsWith(w.slice(0, 5)) && b !== w) { score += 0.3; break; } }
      }
    }
    if (opts?.focusLessonId === c.lessonId) score += 2; // prioritaskan lesson sedang dibaca
    if (score > 0) hits.push({ ...c, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, topK);
}

export const MIN_SCORE = 2;
