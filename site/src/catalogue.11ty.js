import { shell, nav } from "../lib/render.js";
import { loadEntries, escapeHtml, u, CATEGORIES } from "../lib/entries.js";

export const data = { permalink: "/index/index.html" };

export function render() {
  const { entries, gaps } = loadEntries();

  const sections = CATEGORIES.map(([key, label]) => {
    const rows = entries.filter((e) => e.category === key);
    if (!rows.length) return "";
    const items = rows
      .map(
        (e) =>
          `<li><a href="${u(`/entry/${e.slug}/`)}">${escapeHtml(e.title)}</a>` +
          `<span class="tier" data-tier="${e.tier}">${e.tier}</span></li>`
      )
      .join("");
    return `<h2 id="${key}">${label}</h2><ul class="listing">${items}</ul>`;
  }).join("");

  const main = `<main id="main">
<article>
<header class="entry-head"><h1>Index of entries</h1>
<p class="also">${entries.length} entries. Compiled to GC 4462. Incomplete.</p></header>
<p>Entries are listed by category. Each carries one source tier. ${gaps.length} names
referenced in this volume have no entry and are listed under
<a href="${u("/gaps/")}">Gaps</a>.</p>
${sections}
</article>
</main>`;

  return shell({ title: "Index of entries", nav: nav(entries, gaps, null), main });
}
