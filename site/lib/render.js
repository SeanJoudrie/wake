import { BASE, u, escapeHtml, CATEGORIES } from "./entries.js";

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
      return `<section class="nav-group"><h2>${label}</h2><ul>${items}</ul></section>`;
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
<li><a href="${u("/gaps/")}">Gaps</a></li>
<li><a href="${u("/about/")}">On the source tiers</a></li>
</ul>
</section>
</nav>`;
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
${fields ? `<dl class="fields">${fields}</dl>` : ""}
</div>
<div class="meta-refs">
<h2>Cross-reference</h2>
<ul class="refs">${refItems}</ul>
</div>
</aside>`;
}
