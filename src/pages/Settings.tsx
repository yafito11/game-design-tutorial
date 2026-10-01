import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadLlmConfig, saveLlmConfig, clearLlmConfig, PRESETS, canGenerate } from '../lib/settings';
import { testConnection } from '../lib/llm';

export default function Settings() {
  const [cfg, setCfg] = useState(loadLlmConfig);
  const [status, setStatus] = useState('');
  const [testing, setTesting] = useState(false);
  const set = (k: 'baseUrl' | 'apiKey' | 'model', v: string) => setCfg(c => ({ ...c, [k]: v }));

  const save = () => { saveLlmConfig(cfg); setStatus('Tersimpan di perangkat ini ✓ (tidak dikirim ke mana pun)'); };
  const test = async () => {
    saveLlmConfig(cfg);
    setTesting(true); setStatus('Mengetes…');
    const r = await testConnection({ ...cfg, baseUrl: cfg.baseUrl.trim().replace(/\/$/, '') });
    setStatus(r.msg); setTesting(false);
  };

  return (
    <div className="page">
      <nav className="crumbs"><Link to="/">Home</Link> / <b>Settings AI</b></nav>
      <h1>Settings AI (per murid)</h1>
      <p className="muted">Isi sendiri sesuai akun masing-masing. Key hanya tersimpan di <b>localStorage perangkat ini</b> dan dikirim langsung ke baseUrl milikmu — tidak pernah masuk repo/bundle. Tanpa ini, asisten tetap jalan dalam <b>Mode Kutipan</b> (gratis, tanpa LLM).</p>

      <div className="stat-card" style={{ maxWidth: 640 }}>
        <label className="fld">Preset baseUrl
          <select onChange={e => { const p = PRESETS.find(x => x.label === e.target.value); if (p) setCfg(c => ({ ...c, baseUrl: p.baseUrl, model: p.model })); }} defaultValue="">
            <option value="" disabled>Pilih preset…</option>
            {PRESETS.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
          </select>
        </label>
        <label className="fld">Base URL
          <input value={cfg.baseUrl} onChange={e => set('baseUrl', e.target.value)} placeholder="https://api.openai.com/v1" />
        </label>
        <label className="fld">API Key
          <input type="password" value={cfg.apiKey} onChange={e => set('apiKey', e.target.value)} placeholder="sk-… (kosongkan untuk Ollama lokal)" />
        </label>
        <label className="fld">Model
          <input value={cfg.model} onChange={e => set('model', e.target.value)} placeholder="gpt-4o-mini" />
        </label>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={save}>Simpan</button>
          <button className="btn" onClick={test} disabled={testing}>{testing ? 'Mengetes…' : 'Simpan & Tes'}</button>
          <button className="btn" onClick={() => { clearLlmConfig(); setCfg({ baseUrl: '', apiKey: '', model: '' }); setStatus('Dihapus dari perangkat ini.'); }}>Hapus key</button>
        </div>
        {status && <p className="small" style={{ marginTop: 10 }}>{status}</p>}
        <p className="small muted">Status: {canGenerate(cfg) ? 'siap generatif (dengan sitasi RAG)' : 'mode kutipan saja'}</p>
      </div>

      <h2>Cara isi (5 menit)</h2>
      <ol className="timeline">
        <li>Minta baseUrl + nama model ke pengajar, buat API key di akun provider masing-masing.</li>
        <li>Tempel ketiganya di atas → Simpan & Tes → hijau berarti siap.</li>
        <li>Buka lesson → panel <b>Tanya AI</b> → tanya apa pun, jawaban selalu mencantumkan sumber lesson.</li>
      </ol>
    </div>
  );
}
