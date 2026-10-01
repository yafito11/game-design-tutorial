import { useState } from 'react';
import { Link } from 'react-router-dom';
import { retrieve, MIN_SCORE } from '../lib/rag';
import { loadLlmConfig, canGenerate } from '../lib/settings';
import { generateAnswer } from '../lib/llm';

interface Msg { role: 'user' | 'ai'; text: string; sources?: { id: string; title: string }[] }

export default function Assistant({ lessonId, lessonTitle }: { lessonId?: string; lessonTitle?: string }) {
  const [q, setQ] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  const ask = async (preset?: string) => {
    const question = (preset ?? q).trim();
    if (!question || busy) return;
    setQ('');
    setMsgs(m => [...m, { role: 'user', text: question }]);
    setBusy(true);
    try {
      const hits = retrieve(question, { topK: 3, focusLessonId: lessonId });
      if (!hits.length || hits[0].score < MIN_SCORE) {
        setMsgs(m => [...m, {
          role: 'ai',
          text: `Tidak ada di materi. Coba kata kunci lain atau cari di search — misal lesson "${lessonTitle ?? 'Game Loop'}". Saya tidak mau mengarang.`,
        }]);
        return;
      }
      const cfg = loadLlmConfig();
      const sources = [...new Map(hits.map(h => [h.lessonId, { id: h.lessonId, title: h.lessonTitle }])).values()];
      if (!canGenerate(cfg)) {
        // Mode Kutipan: tanpa LLM, nol asumsi — tampilkan teks asli + sumber
        const quote = hits.map(h => `**[${h.lessonId}] ${h.lessonTitle} / ${h.heading}:** ${h.text.slice(0, 280)}…`).join('\n\n');
        setMsgs(m => [...m, { role: 'ai', text: `(Mode Kutipan — isi key di Settings untuk jawaban generatif)\n\n${quote}`, sources }]);
        return;
      }
      const answer = await generateAnswer(cfg, hits, question);
      setMsgs(m => [...m, { role: 'ai', text: answer, sources }]);
    } catch (e) {
      setMsgs(m => [...m, { role: 'ai', text: `Gagal memanggil LLM: ${String(e).slice(0, 150)}. Cek Settings (baseUrl/model/key).` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="assistant">
      <h2>✦ Tanya AI <span className="pill ghost">RAG — berbasis materi, tanpa asumsi</span></h2>
      <div className="chips">
        <button className="btn" onClick={() => ask('Jelaskan materi ini dengan sederhana')}>Jelaskan materi ini</button>
        <button className="btn" onClick={() => ask('Beri contoh kode paling penting dari materi ini')}>Contoh penting</button>
        <button className="btn" onClick={() => ask('Apa kesalahan umum di materi ini?')}>Kesalahan umum</button>
      </div>
      <div className="chat">
        {msgs.length === 0 && <p className="muted small">Tanya apa pun tentang materi. Jawaban selalu mencantumkan sumber lesson — jika tidak ada di materi, saya akan bilang terus terang. <Link to="/settings">Isi key di Settings</Link> untuk mode generatif.</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
            {m.sources && (
              <div className="sources">Sumber: {m.sources.map(s => <Link key={s.id} to={`/learn/${s.id}`}>[{s.id}] {s.title}</Link>).reduce<React.ReactNode[]>((a, b, k) => k === 0 ? [b] : [...a, ' · ', b], [])}</div>
            )}
          </div>
        ))}
        {busy && <div className="bubble ai"><p>Berpikir…</p></div>}
      </div>
      <div className="askrow">
        <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') ask(); }} placeholder={`Tanya tentang ${lessonTitle ?? 'materi'}…`} />
        <button className="btn primary" onClick={() => ask()} disabled={busy}>Tanya</button>
      </div>
    </section>
  );
}
