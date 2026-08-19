import { shell, nav, inlineEntry } from "../lib/render.js";
import { loadEntries, resolveRefs, escapeHtml, u, CATEGORIES } from "../lib/entries.js";

export const data = { permalink: "/index/index.html" };

export function render() {
  const { entries, bySlug, gaps } = loadEntries();

  const sections = CATEGORIES.map(([key, label]) => {
    const rows = entries.filter((e) => e.category === key);
    if (!rows.length) return "";

    const contested = rows.filter((e) => e.tier === "CONTESTED").length;

    const items = rows
      .map(
        (e) => `<details class="row">
<summary>
<span class="row-title">${escapeHtml(e.title)}</span>
<span class="tier" data-tier="${e.tier}">${e.tier}</span>
</summary>
${inlineEntry(e, resolveRefs(e, bySlug, gaps))}
</details>`
      )
      .join("\n");

    return `<details class="cat">
<summary>
<h2>${label}</h2>
<span class="cat-count">${rows.length} entries</span>
${contested ? `<span class="cat-contested">${contested} contested</span>` : ""}
</summary>
<div class="cat-body">${items}</div>
</details>`;
  }).join("\n");

  const main = `<main id="main">
<article>
<header class="entry-head"><h1>Index of entries</h1>
<p class="also">${entries.length} entries. Compiled to GC 4462. Incomplete.</p></header>
<p>Entries are listed by category and open where they stand. Each carries one source tier.
${gaps.length} names referenced in this volume have no entry and are listed under
<a href="${u("/gaps/")}">Gaps</a>.</p>
<p class="section-tools"><button type="button" class="open-cats" aria-expanded="false">Open all categories</button></p>
<div class="cats">
${sections}
</div>
</article>
</main>`;

  return shell({ title: "Index of entries", nav: nav(entries, gaps, null), main });
}
