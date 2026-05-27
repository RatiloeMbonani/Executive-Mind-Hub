// Minimal, safe markdown renderer for AI output. No raw HTML, no eval.
// Supports: # h1, ## h2, ### h3, **bold**, *italic*, `code`, - bullets, 1. lists,
// blank-line paragraphs, > blockquotes, and [ ] task items.
import { Fragment, type ReactNode } from "react";

function renderInline(text: string) {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) nodes.push(<strong key={i++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) nodes.push(<code key={i++} className="bg-muted px-1.5 py-0.5 rounded text-[0.85em] font-mono">{tok.slice(1, -1)}</code>);
    else nodes.push(<em key={i++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Heading
    const h = /^(#{1,3})\s+(.+)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      const cls = level === 1 ? "text-2xl font-bold font-display mt-4 mb-2"
                 : level === 2 ? "text-lg font-bold font-display mt-4 mb-2"
                 : "text-base font-bold font-display mt-3 mb-1.5";
      blocks.push(
        level === 1 ? <h2 key={key++} className={cls}>{renderInline(text)}</h2>
        : level === 2 ? <h3 key={key++} className={cls}>{renderInline(text)}</h3>
        : <h4 key={key++} className={cls}>{renderInline(text)}</h4>
      );
      i++; continue;
    }

    // Bullet / task list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-5 space-y-1 my-2 text-sm">
          {items.map((it, idx) => {
            const task = /^\[( |x|X)\]\s+(.+)/.exec(it);
            if (task) {
              return (
                <li key={idx} className="list-none -ml-5 flex gap-2 items-start">
                  <input type="checkbox" readOnly checked={task[1].toLowerCase() === "x"} className="mt-1 accent-primary" />
                  <span>{renderInline(task[2])}</span>
                </li>
              );
            }
            return <li key={idx}>{renderInline(it)}</li>;
          })}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="list-decimal pl-5 space-y-1 my-2 text-sm">
          {items.map((it, idx) => <li key={idx}>{renderInline(it)}</li>)}
        </ol>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      blocks.push(<blockquote key={key++} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-2">{renderInline(line.slice(2))}</blockquote>);
      i++; continue;
    }

    // Paragraph
    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|[-*]\s|\d+\.\s|>\s)/.test(lines[i])) {
      para.push(lines[i]); i++;
    }
    blocks.push(<p key={key++} className="text-sm leading-relaxed my-2">{renderInline(para.join(" "))}</p>);
  }

  return <div className="prose-sm">{blocks.map((b, idx) => <Fragment key={idx}>{b}</Fragment>)}</div>;
}
