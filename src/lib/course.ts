import matter from 'gray-matter';

export type PhaseId =
  | 'fundamentals' | 'ai-coding' | 'opencode' | 'programming'
  | 'game-programming' | 'game-design' | 'architecture'
  | 'assets' | 'ui-ux' | 'ai-workflow' | 'projects' | 'general';

export interface LessonMeta {
  id: string;
  title: string;
  phase: PhaseId | string;
  difficulty: string;
  duration: number;
  prerequisites: string[];
  tags: string[];
  path: string;
  order: number;
}

export interface Lesson extends LessonMeta {
  body: string;
}

export const PHASES: { id: string; label: string; desc: string }[] = [
  { id: 'fundamentals', label: 'Fundamentals', desc: 'Game dev sebagai sistem' },
  { id: 'ai-coding', label: 'AI Coding', desc: 'Pair programmer + prompt' },
  { id: 'opencode', label: 'OpenCode', desc: 'Agent workflow' },
  { id: 'programming', label: 'Programming', desc: 'TS untuk game' },
  { id: 'game-programming', label: 'Game Programming', desc: 'Loop, input, collision' },
  { id: 'game-design', label: 'Game Design', desc: 'Core loop & balancing' },
  { id: 'architecture', label: 'Architecture', desc: 'Modular & ECS' },
  { id: 'assets', label: 'Asset Pipeline', desc: 'Sprite, audio, optimasi' },
  { id: 'ui-ux', label: 'UI/UX', desc: 'HUD, menu, aksesibilitas' },
  { id: 'ai-workflow', label: 'AI Workflow', desc: 'Design→code→debug→polish' },
  { id: 'projects', label: 'Projects', desc: 'Build real games' },
  { id: 'general', label: 'General', desc: 'Roadmap & glossary' },
];

// import all course md as raw
const modules = import.meta.glob('../../course/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function phaseFromPath(path: string): string {
  if (path.includes('00-fundamentals')) return 'fundamentals';
  if (path.includes('01-ai-coding')) return 'ai-coding';
  if (path.includes('02-opencode')) return 'opencode';
  if (path.includes('03-programming')) return 'programming';
  if (path.includes('04-game-programming')) return 'game-programming';
  if (path.includes('05-game-design')) return 'game-design';
  if (path.includes('06-architecture')) return 'architecture';
  if (path.includes('07-assets')) return 'assets';
  if (path.includes('08-ui-ux')) return 'ui-ux';
  if (path.includes('09-ai-workflow')) return 'ai-workflow';
  if (path.includes('10-projects')) return 'projects';
  return 'general';
}

function humanize(name: string): string {
  const base = name.split('/').pop()?.replace(/\.md$/, '') || name;
  const stripped = base.replace(/^\d+[-_.]+/, '').replace(/[-_]+/g, ' ').trim();
  if (!stripped) return base;
  return stripped.replace(/\b\w/g, c => c.toUpperCase());
}

let cache: Lesson[] | null = null;

export function getAllLessons(): Lesson[] {
  if (cache) return cache;
  const entries = Object.entries(modules);
  const lessons: Lesson[] = entries.map(([path, raw], idx) => {
    try {
      const parsed = matter(raw as string);
      const d = parsed.data as Record<string, unknown>;
      const id = (d.id as string) || path.split('/').pop()?.replace('.md', '') || `lesson-${idx}`;
      return {
        id,
        title: (d.title as string) || humanize(id),
        phase: (d.phase as string) || phaseFromPath(path),
        difficulty: (d.difficulty as string) || 'beginner',
        duration: Number(d.duration) || 20,
        prerequisites: (d.prerequisites as string[]) || [],
        tags: (d.tags as string[]) || [],
        path,
        order: idx,
        body: parsed.content,
      };
    } catch {
      return {
        id: `lesson-${idx}`, title: humanize(path), phase: phaseFromPath(path),
        difficulty: 'beginner', duration: 20, prerequisites: [], tags: [], path, order: idx,
        body: raw as string,
      };
    }
  });
  // sort: general (README, roadmap, glossary) last, projects last-but-one, else by path
  const weight = (p: string) => {
    const order = ['fundamentals','ai-coding','opencode','programming','game-programming','game-design','architecture','assets','ui-ux','ai-workflow','projects','general'];
    return order.indexOf(p);
  };
  lessons.sort((a, b) => weight(a.phase) - weight(b.phase) || a.path.localeCompare(b.path));
  cache = lessons;
  return lessons;
}

export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find(l => l.id === id);
}

export function getPrevNext(id: string): { prev?: Lesson; next?: Lesson } {
  const all = getAllLessons().filter(l => !['README','roadmap','glossary'].includes(titleKey(l)));
  const i = all.findIndex(l => l.id === id);
  if (i < 0) return {};
  return { prev: all[i - 1], next: all[i + 1] };
}

function titleKey(l: Lesson): string {
  return l.path.split('/').pop()?.replace('.md', '') || '';
}

export function searchLessons(q: string): Lesson[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return getAllLessons().filter(l =>
    l.title.toLowerCase().includes(query) ||
    l.body.toLowerCase().includes(query) ||
    l.tags.join(' ').toLowerCase().includes(query) ||
    l.id.toLowerCase().includes(query)
  ).slice(0, 20);
}
