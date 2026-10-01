import type { LlmConfig } from './settings';
import type { Chunk } from './rag';

const SYSTEM = `Kamu asisten belajar Game Development. Aturan WAJIB:
1. Jawab HANYA dari KONTEKS materi yang diberikan. Jangan pakai pengetahuan luar.
2. Setiap fakta WAJIB disertai sitasi [lessonId] yang ada di konteks.
3. Jika konteks tidak cukup, katakan "Tidak ada di materi" dan arahkan ke lesson/global search yang paling dekat. Jangan mengarang.
4. Bahasa: Indonesia santai, rujuk bagian materi (heading) bila relevan.
5. Maksimal 250 kata kecuali diminta detail.`;

export function buildPrompt(chunks: Chunk[], question: string): { system: string; user: string } {
  const ctx = chunks.map((c, i) =>
    `--- SUMBER ${i + 1} [${c.lessonId}] "${c.lessonTitle}" / ${c.heading} ---\n${c.text.slice(0, 1200)}`
  ).join('\n\n');
  return {
    system: SYSTEM,
    user: `KONTEKS:\n${ctx}\n\nPERTANYAAN: ${question}\n\nJawab dengan sitasi [lessonId] di tiap poin. Jika tidak ada di konteks, katakan terus terang.`,
  };
}

export async function testConnection(cfg: LlmConfig): Promise<{ ok: boolean; msg: string }> {
  try {
    const res = await fetch(`${cfg.baseUrl}/models`, {
      headers: cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {},
    });
    if (!res.ok) return { ok: false, msg: `HTTP ${res.status} — cek baseUrl / key` };
    return { ok: true, msg: 'Terhubung ✓' };
  } catch (e) {
    return { ok: false, msg: `Gagal: ${String(e).slice(0, 120)}` };
  }
}

export async function generateAnswer(cfg: LlmConfig, chunks: Chunk[], question: string): Promise<string> {
  const { system, user } = buildPrompt(chunks, question);
  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.2,
      max_tokens: 600,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Respons LLM kosong');
  return text;
}
