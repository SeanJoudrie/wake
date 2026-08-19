import { shell, nav, metaColumn } from "../lib/render.js";
import { loadEntries, resolveRefs, escapeHtml } from "../lib/entries.js";

export function data() {
  const { entries } = loadEntries();
  return {
    entries,
    pagination: { data: "entries", size: 1, alias: "entry" },
    permalink: (d) => `/entry/${d.entry.slug}/index.html`,
  };
}

export function render(d) {
  const { entries, bySlug, gaps } = loadEntries();
  const e = d.entry;
  const refs = resolveRefs(e, bySlug, gaps);

  const main = `<main id="main">
<article>
<header class="entry-head">
<h1>${escapeHtml(e.title)}</h1>
${e.subtitle ? `<p class="also">${escapeHtml(e.subtitle)}</p>` : ""}
</header>
${e.body}
</article>
</main>`;

  return shell({
    title: e.title,
    nav: nav(entries, gaps, e.slug),
    main,
    aside: metaColumn(e, refs),
  });
}
