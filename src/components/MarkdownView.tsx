import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import Mermaid from './Mermaid';

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  if (lang === 'mermaid') return <Mermaid chart={code} />;
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
  };
  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        <span>{lang || 'code'}</span>
        <button onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

export default function MarkdownView({ body }: { body: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code(props: any) {
            const { className, children } = props;
            const text = String(children ?? '').replace(/\n$/, '');
            const isBlock = String(className || '').includes('language-') || text.includes('\n');
            if (!isBlock) return <code className="inline-code">{children}</code>;
            const lang = (className || '').replace('language-', '').trim() || 'text';
            return <CodeBlock lang={lang} code={text} />;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pre(props: any) { return <>{props.children}</>; },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          a(props: any) { return <a {...props} target={props.href?.startsWith('http') ? '_blank' : undefined} />; },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          table(props: any) { return <div className="table-wrap"><table {...props} /></div>; },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

// re-export to satisfy fast-refresh unused check
export const __MarkdownView = React.memo(MarkdownView);
