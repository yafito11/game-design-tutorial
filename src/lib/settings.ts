// LLM config milik murid — disimpan di localStorage perangkat masing-masing.
// Tidak ada secret di repo/bundle. Key hanya dikirim ke baseUrl milik murid.
export interface LlmConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

const KEY = 'ai-game-learning:llm:v1';

export const PRESETS: { label: string; baseUrl: string; model: string }[] = [
  { label: 'Custom (OpenAI-compatible)', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { label: 'Ollama lokal', baseUrl: 'http://localhost:11434/v1', model: 'llama3.1' },
];

export function loadLlmConfig(): LlmConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { baseUrl: '', apiKey: '', model: '', ...JSON.parse(raw) };
  } catch {}
  return { baseUrl: '', apiKey: '', model: '' };
}

export function saveLlmConfig(cfg: LlmConfig) {
  localStorage.setItem(KEY, JSON.stringify({
    baseUrl: cfg.baseUrl.trim().replace(/\/$/, ''),
    apiKey: cfg.apiKey.trim(),
    model: cfg.model.trim(),
  }));
}

export function clearLlmConfig() {
  localStorage.removeItem(KEY);
}

export function hasLlmConfig(cfg: LlmConfig): boolean {
  return Boolean(cfg.baseUrl && cfg.model);
}
// apiKey boleh kosong untuk server lokal seperti Ollama.
export function canGenerate(cfg: LlmConfig): boolean {
  return Boolean(cfg.baseUrl && cfg.model);
}
