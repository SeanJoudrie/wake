import { shell, nav } from "../lib/render.js";
import { loadEntries, escapeHtml, u } from "../lib/entries.js";

export const data = { permalink: "/gaps/index.html" };

export function render() {
  const { entries, gaps } = loadEntries();

  // Ranked by inbound references, not alphabetical. The shape of the hole.
  const items = gaps
    .map(
      (g) => `<div class="gap-item">
<p><span class="name">${escapeHtml(g.name)}</span> <span class="marker">[ENTRY NOT RECOVERED]</span></p>
<p class="from">Referenced by ${g.from.length}: ${g.from
        .map((e) => `<a href="${u(`/entry/${e.slug}/`)}">${escapeHtml(e.title)}</a>`)
        .join(" &middot; ")}</p>
</div>`
    )
    .join("");

  const main = `<main id="main">
<article>
<header class="entry-head"><h1>Gaps</h1>
<p class="also">${gaps.length} names. No entry recovered.</p></header>
<p>Every name this volume refers to and cannot produce an entry for, ordered by the number of
entries that point at it. The Restoration prints these rather than removing them, on the
reasoning that a reader is better served by a name and an absence than by neither.</p>
${items}
</article>
</main>`;

  return shell({ title: "Gaps", nav: nav(entries, gaps, null), main });
}
