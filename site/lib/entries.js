import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: false, typographer: false });

const ROOT = path.resolve(process.cwd(), "..");
const ENTRY_DIR = path.join(ROOT, "entries");

export const BASE = process.env.SITE_BASE || "";
export const u = (p) => BASE + p;

// Category key -> display label. "Bodies" for institutions is deliberate.
export const CATEGORIES = [
  ["world", "Worlds"],
  ["people", "Peoples"],
  ["location", "Places"],
  ["institution", "Bodies"],
  ["event", "Events"],
  ["practice", "Rites"],
  ["technology", "Objects"],
  ["material", "Materials"],
  ["flora-fauna", "Flora"],
  ["language", "Tongues"],
];

export const TIERS = ["INTACT", "RECOVERED", "TESTIMONY", "CONTESTED", "INFERRED"];

const GHOST_NAMES = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "ghost-names.json"), "utf8")
);

const FIELD = /^\*\*([^*]+?):\*\* +(.+)$/;
const GAP = /\[(?:…|\.\.\.|[A-Z][A-Z' -]{3,})\]/g;

export function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

// Wrap every bracketed gap marker so it renders in --absence.
function markGaps(html) {
  return html.replace(GAP, (m) => `<span class="gap">${m}</span>`);
}

function noteClass(html) {
  return html
    .replace(/<p><em>\[Compiler's note:/g, "<p class=\"compiler\"><em>[Compiler's note:")
    // A CONTESTED tag named in running text is still a failure of the record.
    .replace(/<code>CONTESTED<\/code>/g, '<code class="gap">CONTESTED</code>')
    // Wide tables scroll inside their own box; the page never scrolls sideways.
    .replace(/<table>/g, '<div class="scroll-x"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

// A population the archive cannot narrow is a failure of the record, not a fact.
function isUnnarrowed(label, value) {
  return (
    /population|casualt|dead|missing|displaced/i.test(label) &&
    /\bbetween\b|\brange\b|estimate|not established|not filed|not published/i.test(value)
  );
}

function parseEntry(slug, raw) {
  const { data, content } = matter(raw);
  const lines = content.split("\n");

  let i = lines.findIndex((l) => l.startsWith("# "));
  i = i < 0 ? 0 : i + 1;

  let subtitle = null;
  for (; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;
    if (/^`[A-Z]+`$/.test(l)) { i++; break; }
    if (/^\*[^*].*\*$/.test(l)) { subtitle = l.slice(1, -1); continue; }
    break;
  }

  const rest = lines.slice(i).filter((l) => !l.startsWith("*Cross-ref:"));

  // Metadata is the first contiguous run of two or more "**Label:** value" lines.
  const fields = [];
  for (let j = 0; j < rest.length; j++) {
    if (!FIELD.test(rest[j])) continue;
    let k = j;
    const run = [];
    while (k < rest.length && FIELD.test(rest[k])) {
      const m = rest[k].match(FIELD);
      run.push({ label: m[1], value: m[2] });
      k++;
    }
    if (run.length >= 2) {
      fields.push(...run);
      rest.splice(j, k - j);
    }
    break;
  }

  return {
    slug,
    title: data.title,
    subtitle,
    category: data.category,
    tier: data.tier,
    crossRefs: data.cross_refs || [],
    fields: fields.map((f) => ({
      label: f.label,
      html: markGaps(md.renderInline(f.value)),
      absent: isUnnarrowed(f.label, f.value),
    })),
    body: markGaps(noteClass(md.render(rest.join("\n").trim()))),
  };
}

let cache = null;

export function loadEntries() {
  if (cache) return cache;
  const entries = fs
    .readdirSync(ENTRY_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseEntry(f.slice(0, -3), fs.readFileSync(path.join(ENTRY_DIR, f), "utf8")))
    .sort((a, b) => a.title.localeCompare(b.title));

  const bySlug = new Map(entries.map((e) => [e.slug, e]));

  // Every cross-reference that resolves to nothing, and who points at it.
  const gaps = new Map();
  for (const e of entries) {
    for (const ref of e.crossRefs) {
      if (bySlug.has(ref)) continue;
      if (!gaps.has(ref)) gaps.set(ref, []);
      gaps.get(ref).push(e);
    }
  }

  const gapList = [...gaps.entries()]
    .map(([slug, from]) => ({
      slug,
      name: GHOST_NAMES[slug] || slug.replace(/-/g, " "),
      from: from.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => b.from.length - a.from.length || a.name.localeCompare(b.name));

  cache = { entries, bySlug, gaps: gapList };
  return cache;
}

export function resolveRefs(entry, bySlug, gapList) {
  const ghost = new Map(gapList.map((g) => [g.slug, g.name]));
  return entry.crossRefs.map((ref) => {
    const hit = bySlug.get(ref);
    return hit
      ? { ok: true, slug: ref, title: hit.title }
      : { ok: false, slug: ref, title: ghost.get(ref) || ref.replace(/-/g, " ") };
  });
}

export function readRoot(file) {
  return matter(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

export function renderMarkdown(text) {
  return markGaps(noteClass(md.render(text)));
}
