import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

let counter = 0;

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef(`mmd-${++counter}`);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const { svg } = await mermaid.render(id.current, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        if (ref.current) ref.current.innerHTML = `<pre class="mermaid-error">Mermaid error: ${String(e).slice(0,200)}</pre>`;
      }
    };
    render();
    return () => { cancelled = true; };
  }, [chart]);

  return <div className="mermaid-wrap" ref={ref} />;
}
