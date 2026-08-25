import { BASE, u, escapeHtml, CATEGORIES } from "./entries.js";

// Out-of-world apparatus. Labelled and styled so it can never be mistaken for the
// archive's own voice.
export function readersKey(entry) {
  if (!entry.sources.length) return "";
  const links = entry.sources
    .map((n) => `<a href="${u("/sources/")}#ch-${n}">Ch. ${n}</a>`)
    .join(" &middot; ");
  return `<div class="readers-key">
<p class="rk-label">Reader's key</p>
<p class="rk-body">Seen in the manuscript at ${links}.</p>
</div>`;
}

export const CHEV =
  '<svg class="chev" viewBox="0 0 12 8" aria-hidden="true" focusable="false"><path d="M1 1.75 L6 6.25 L11 1.75"/></svg>';

export function shell({ title, bodyClass = "", nav, main, aside = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} &middot; The Wake Encyclopedia</title>
<link rel="icon" href="${u("/styles/favicon.svg")}" type="image/svg+xml">
<link rel="stylesheet" href="${u("/styles/fonts.css")}">
<link rel="stylesheet" href="${u("/styles/tokens.css")}">
<link rel="stylesheet" href="${u("/styles/main.css")}">
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to entry</a>
<button class="drawer-toggle" aria-expanded="false" aria-controls="index">Index</button>
<div class="frame">
${nav}
${main}
${aside}
</div>
<script src="${u("/styles/index.js")}" defer></script>
</body>
</html>`;
}

export function nav(entries, gaps, current) {
  const byCat = new Map();
  for (const e of entries) {
    if (!byCat.has(e.category)) byCat.set(e.category, []);
    byCat.get(e.category).push(e);
  }

  const groups = CATEGORIES.filter(([key]) => byCat.has(key))
    .map(([key, label]) => {
      const items = byCat
        .get(key)
        .map(
          (e) =>
            `<li><a href="${u(`/entry/${e.slug}/`)}"${
              e.slug === current ? ' aria-current="page"' : ""
            }>${escapeHtml(e.title)}</a></li>`
        )
        .join("");
      const here = byCat.get(key).some((e) => e.slug === current);
      return `<section class="nav-group"><details class="nav-fold"${here ? " open" : ""}>` +
        `<summary><h2>${label}</h2>${CHEV}</summary><ul>${items}</ul></details></section>`;
    })
    .join("");

  // Absences are searchable. They are not links.
  const gapItems = gaps
    .map(
      (g) =>
        `<li class="nav-gap"><span class="strike">${escapeHtml(g.name)}</span>` +
        `<span class="gap">[ENTRY NOT RECOVERED]</span>` +
        `<span class="refcount">referenced by ${g.from.length}</span></li>`
    )
    .join("");

  return `<nav class="index" id="index" aria-label="Index of entries">
<form class="search" role="search" onsubmit="return false">
<label for="q">Search the index</label>
<input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="">
</form>
<p class="nav-empty" hidden>No entry matches. No absence matches.</p>
<section class="nav-group nav-gaps" hidden><h2>Not recovered</h2><ul>${gapItems}</ul></section>
${groups}
<section class="nav-group nav-meta">
<h2>Volume</h2>
<ul>
<li><a href="${u("/index/")}">Full index</a></li>
<li><a href="${u("/plates/")}">Plates</a></li>
<li><a href="${u("/gaps/")}">Gaps</a></li>
<li><a href="${u("/sources/")}">Reader\'s key</a></li>
<li><a href="${u("/about/")}">On the source tiers</a></li>
</ul>
</section>
</nav>`;
}

// Sections collapse. The lead and the compiler's notes do not, and a collapsed
// summary still declares how many gap markers are hiding inside it, so the amount
// of red on the page survives the entry being closed.
// A plate. Sits under the entry heading like a frontispiece.
export function plate(entry) {
  if (!entry.art) return "";
  const cap = entry.artCaption
    ? `<figcaption>${escapeHtml(entry.artCaption)}</figcaption>`
    : "";
  const { width, height } = entry.artSize || { width: 733, height: 1100 };
  return `<figure class="plate">
<img src="${u(`/art/${entry.art}`)}" alt="${escapeHtml(entry.title)}" loading="lazy" decoding="async" width="${width}" height="${height}">
${cap}
</figure>`;
}

const sectionMarkup = (s, open) => `<details class="section"${open ? " open" : ""}>
<summary><h2>${escapeHtml(s.title)}</h2>${
  s.gaps ? `<span class="sec-gaps">${s.gaps} gap${s.gaps > 1 ? "s" : ""}</span>` : ""
}${CHEV}</summary>
<div class="section-body">${s.html}</div>
</details>`;

// Everything the author has marked as reading ahead of the book, behind one
// door per entry. The door is shut whatever else on the page is open, and its
// summary names no section, because a section title can give the thing away on
// its own.
function spoilerGate(sections) {
  if (!sections.length) return "";
  const inner = sections.map((s) => sectionMarkup(s, true)).join("\n");
  return `<details class="spoilers">
<summary><span class="spoiler-mark">Spoilers</span>
<span class="spoiler-note">${sections.length}</span>${CHEV}</summary>
<div class="spoiler-body">
<p class="spoiler-warn">For readers who have finished. Everything below happens later in the book.</p>
${inner}
</div>
</details>`;
}

export function entryBody(entry, { open = false } = {}) {
  if (!entry.sections.length) return entry.lead + entry.notes;

  const plain = entry.sections.filter((s) => !s.spoiler);
  const held = entry.sections.filter((s) => s.spoiler);
  const gate = spoilerGate(held);

  if (!plain.length) return `${entry.lead}\n${gate}\n${entry.notes}`;

  const sections = plain.map((s) => sectionMarkup(s, open)).join("\n");

  return `${entry.lead}
<div class="section-set">
<p class="section-tools"><button type="button" class="open-all" aria-expanded="${open}">${
    open ? "Close" : "Open"
  } all sections</button></p>
<div class="sections">
${sections}
</div>
</div>
${gate}
${entry.notes}`;
}

// An entry rendered inside the index, where it drops open in place.
export function inlineEntry(entry, refs) {
  const fields = entry.fields
    .map(
      (f) =>
        `<div class="field"><dt>${escapeHtml(f.label)}</dt>` +
        `<dd${f.absent ? ' class="absent"' : ""}>${f.html}</dd></div>`
    )
    .join("");

  const refItems = refs
    .map((r) =>
      r.ok
        ? `<li><a href="${u(`/entry/${r.slug}/`)}">${escapeHtml(r.title)}</a></li>`
        : `<li class="dead"><span class="strike">${escapeHtml(
            r.title
          )}</span><span class="gap">[ENTRY NOT RECOVERED]</span></li>`
    )
    .join("");

  return `<div class="row-body">
${entry.subtitle ? `<p class="also">${escapeHtml(entry.subtitle)}</p>` : ""}
${plate(entry)}
${fields ? `<dl class="fields">${fields}</dl>` : ""}
${entryBody(entry, { open: true })}
<div class="row-refs"><h3>Cross-reference</h3><ul class="refs">${refItems}</ul></div>
${readersKey(entry)}
<p class="row-permalink"><a href="${u(`/entry/${entry.slug}/`)}">Open ${escapeHtml(
    entry.title
  )} on its own page</a></p>
</div>`;
}

export function stamp(tier) {
  return `<p class="stamp" data-tier="${tier}">${tier}</p>`;
}

export function metaColumn(entry, refs) {
  const fields = entry.fields
    .map(
      (f) =>
        `<div class="field"><dt>${escapeHtml(f.label)}</dt>` +
        `<dd${f.absent ? ' class="absent"' : ""}>${f.html}</dd></div>`
    )
    .join("");

  const refItems = refs
    .map((r) =>
      r.ok
        ? `<li><a href="${u(`/entry/${r.slug}/`)}">${escapeHtml(r.title)}</a></li>`
        : `<li class="dead"><span class="strike">${escapeHtml(
            r.title
          )}</span><span class="gap">[ENTRY NOT RECOVERED]</span></li>`
    )
    .join("");

  return `<aside class="meta" aria-label="Record details">
<div class="meta-head">
${stamp(entry.tier)}
${
  fields
    ? `<details class="record" open><summary><h2>Record details</h2>${CHEV}</summary><dl class="fields">${fields}</dl></details>`
    : ""
}
</div>
<div class="meta-refs">
<h2>Cross-reference</h2>
<ul class="refs">${refItems}</ul>
${readersKey(entry)}
</div>
</aside>`;
}
