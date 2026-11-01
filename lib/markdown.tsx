import { readFileSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";

// Reads a markdown file from content/ and returns its paragraphs.
// Paragraphs are separated by a blank line.
export function readParagraphs(file: string): string[] {
  const text = readFileSync(path.join(process.cwd(), "content", file), "utf8");
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/\n/g, " "))
    .filter(Boolean);
}

// Reads a markdown file as a single paragraph of text.
export function readText(file: string): string {
  return readParagraphs(file).join(" ");
}

// Strips inline markdown for plain-text uses such as meta descriptions.
export function stripInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g, (_, b, i, label) => b ?? i ?? label);
}

// Minimal inline markdown: **bold**, *italic*, [text](url).
const inline = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;

export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(inline)) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = match.index;
    if (match[1]) nodes.push(<strong key={key}>{match[1]}</strong>);
    else if (match[2]) nodes.push(<em key={key}>{match[2]}</em>);
    else {
      nodes.push(
        <a key={key} href={match[4]} className="text-link" target="_blank" rel="noreferrer">
          {match[3]}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
