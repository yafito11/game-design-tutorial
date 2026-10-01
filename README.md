# ◉ AI Game Dev Academy

Interactive Game Development learning platform — belajar sebagai **sistem**: konsep → desain → coding → asset → gameplay → testing → build → deploy, dengan AI Coding + OpenCode.

Built: React + TypeScript + Vite + React Router + Markdown + Mermaid.

## Jalankan

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # output dist/
npm run check   # tsc --noEmit
```

## Konten (`course/`)

- `README.md`, `roadmap.md`, `glossary.md` (30 istilah)
- `00-fundamentals/` (3): what-is-game-dev, game-loop, mechanics
- `01-ai-coding/` (2): pair-programmer, prompt-engineering
- `02-opencode/` (2): setup, workflow idea→build
- `03-programming/` (2): variables-state, functions-arrays
- `04-game-programming/` (3): delta-time, input-movement, collision AABB
- `05-game-design/` (1): core-loop
- `10-projects/project-01.md`: Breakout clone playable

Semua lesson ikut format baku: frontmatter + Objectives → Concept → Why → Mermaid → Example → OpenCode Prompt → Exercise → Challenge → Mistakes → Debugging → Summary → Next.

## Fitur App

- Dashboard (progress, continue, milestones), Sidebar explorer 11 fase, Lesson viewer (breadcrumb, meta, copy-button, Mermaid), Search global, Progress localStorage (`ai-game-learning:v1`), Responsive + drawer mobile.

## Pola

```text
PLAN → ASK AI → IMPLEMENT → RUN → OBSERVE → DEBUG → ITERATE
```

Lihat `prd.md` untuk PRD penuh dan `course/roadmap.md` untuk jalur belajar.
