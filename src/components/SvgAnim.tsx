import { useRef, useState } from 'react';

// Spesifikasi deklaratif dari blok ```svg-anim di markdown:
//   nodes: [A, B, C]
//   flow: A -> B -> C -> A
//   highlight: B   (opsional)
export interface FlowSpec { nodes: string[]; edges: [string, string][]; highlight?: string }

export function parseFlowSpec(src: string): FlowSpec | null {
  try {
    const nodesM = src.match(/nodes:\s*\[([^\]]+)\]/);
    const flowM = src.match(/flow:\s*(.+)/);
    if (!nodesM || !flowM) return null;
    const nodes = nodesM[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    const hl = src.match(/highlight:\s*(\S+)/)?.[1]?.replace(/['"]/g, '');
    const names = flowM[1].split('->').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
    const edges: [string, string][] = [];
    for (let i = 0; i < names.length - 1; i++) edges.push([names[i], names[i + 1]]);
    if (!nodes.length || !edges.length) return null;
    return { nodes, edges, highlight: hl };
  } catch { return null; }
}

// Auto-generate dari mermaid sederhana: kumpulkan "A --> B" / "A -->|label| B"
export function flowFromMermaid(chart: string): FlowSpec | null {
  const edges: [string, string][] = [];
  for (const line of chart.split('\n')) {
    const m = line.match(/(\w[\w ]*?)\s*-->(\|[^|]*\|)?\s*(\w[\w ]*)/);
    if (m) {
      const a = m[1].trim().slice(0, 18), b = m[3].trim().slice(0, 18);
      if (a && b && a !== b) edges.push([a, b]);
    }
  }
  if (!edges.length) return null;
  const nodes = [...new Set(edges.flat())].slice(0, 6);
  return { nodes, edges: edges.filter(([a, b]) => nodes.includes(a) && nodes.includes(b)).slice(0, 8) };
}

export default function SvgFlow({ spec, title }: { spec: FlowSpec; title?: string }) {
  const [paused, setPaused] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const toggle = () => {
    setPaused(p => {
      const next = !p;
      const svg = svgRef.current as unknown as SVGSVGElement & { pauseAnimations?: () => void; unpauseAnimations?: () => void };
      try { next ? svg?.pauseAnimations?.() : svg?.unpauseAnimations?.(); } catch {}
      return next;
    });
  };
  const n = spec.nodes.length;
  const W = 640, H = 150;
  const pos = spec.nodes.map((_, i) => ({
    x: 70 + (i * (W - 140)) / Math.max(n - 1, 1),
    y: H / 2 + (i % 2 === 0 ? -22 : 22),
  }));
  const idx = new Map(spec.nodes.map((v, i) => [v, i]));
  const dur = 2.2;

  return (
    <figure className={`svgflow ${paused ? 'paused' : ''}`}>
      {title && <figcaption>{title}</figcaption>}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.nodes.join(' ke ')}>
        <defs>
          <marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" fill="none" stroke="#6e9fff" strokeWidth="1.6" />
          </marker>
        </defs>
        {spec.edges.map(([a, b], k) => {
          const i = idx.get(a), j = idx.get(b);
          if (i === undefined || j === undefined) return null;
          const p1 = pos[i], p2 = pos[j];
          const id = `fp-${k}`;
          return (
            <g key={k}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="flow-line" markerEnd="url(#ah)" />
              <circle r="5" className="flow-dot">
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${-k * (dur / spec.edges.length)}s`}>
                  <mpath href={`#${id}`} />
                </animateMotion>
              </circle>
              <path id={id} d={`M${p1.x},${p1.y} L${p2.x},${p2.y}`} fill="none" />
            </g>
          );
        })}
        {spec.nodes.map((v, i) => (
          <g key={v} className={spec.highlight === v ? 'node hot' : 'node'}>
            <rect x={pos[i].x - 62} y={pos[i].y - 20} width="124" height="40" rx="12" />
            <text x={pos[i].x} y={pos[i].y + 5} textAnchor="middle">{v.length > 16 ? v.slice(0, 15) + '…' : v}</text>
          </g>
        ))}
      </svg>
      <button className="btn" onClick={toggle}>{paused ? '▶ Putar' : '⏸ Jeda'}</button>
    </figure>
  );
}
