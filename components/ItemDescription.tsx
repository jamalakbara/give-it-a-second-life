"use client";

// Renders a plain-text item description with structure: blank-line-separated
// paragraphs, `HEADER:` section titles, and `•`/`-` bullet lists. The stored
// text keeps its newlines and bullets — this parses them into real markup so a
// raw `<p>{description}` no longer collapses everything into one flat block.
// Long descriptions collapse to `COLLAPSED_MAX` with a gradient fade + a
// "Read full description" toggle; the toggle only appears when it overflows.

import { useLayoutEffect, useRef, useState } from "react";

// Collapsed height cap in px — roughly the intro paragraph + first section.
const COLLAPSED_MAX = 320;

type Block =
  | { kind: "heading"; text: string }
  | { kind: "para"; text: string }
  | { kind: "list"; items: string[] };

const BULLET = /^\s*[•\-*]\s+/;
// A heading is a short, all-caps-ish line ending with a colon (e.g. "WHY BUY:").
const HEADING = /^[^a-z]{2,40}:$/;

function parseDescription(raw: string): Block[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length) blocks.push({ kind: "para", text: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ kind: "list", items: list });
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      flushPara();
      continue;
    }
    if (BULLET.test(trimmed)) {
      flushPara();
      list.push(trimmed.replace(BULLET, ""));
      continue;
    }
    flushList();
    if (HEADING.test(trimmed)) {
      flushPara();
      blocks.push({ kind: "heading", text: trimmed.replace(/:$/, "") });
      continue;
    }
    para.push(trimmed);
  }
  flushList();
  flushPara();
  return blocks;
}

export function ItemDescription({ text }: { text: string }) {
  const blocks = parseDescription(text);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollHeight > COLLAPSED_MAX + 24);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  const collapsed = overflows && !expanded;

  return (
    <div className="mt-7">
      <div
        ref={contentRef}
        style={collapsed ? { maxHeight: COLLAPSED_MAX } : undefined}
        className={
          "space-y-4 text-[16px] leading-[1.7] text-fg-muted" +
          (collapsed
            ? " overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
            : "")
        }
      >
        {blocks.map((block, i) => {
        if (block.kind === "heading") {
          return (
            <h2
              key={i}
              className="tracked pt-2 text-[11px] text-fg-faint first:pt-0"
            >
              {block.text}
            </h2>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={i} className="space-y-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden className="text-fg-faint">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
          return <p key={i}>{block.text}</p>;
        })}
      </div>

      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="tracked mt-4 text-[11px] text-fg-faint transition-colors hover:text-fg"
        >
          {expanded ? "Show less ▴" : "Read full description ▾"}
        </button>
      )}
    </div>
  );
}
