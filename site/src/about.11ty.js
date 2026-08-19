import { shell, nav, stamp } from "../lib/render.js";
import { loadEntries, readRoot, renderMarkdown, u, TIERS } from "../lib/entries.js";

export const data = { permalink: "/about/index.html" };

export function render() {
  const { entries, gaps } = loadEntries();
  const { content } = readRoot("_conceit.md");

  // Drop the file's own H1 and its trailing cross-reference line.
  const body = renderMarkdown(
    content
      .split("\n")
      .filter((l) => !l.startsWith("# ") && !l.startsWith("*Cross-ref:"))
      .join("\n")
      .trim()
  );

  const legend = TIERS.map(
    (t) =>
      `<div class="legend-row">${stamp(t)}<p class="legend-count"><a href="${u(
        `/tiers/${t.toLowerCase()}/`
      )}">${entries.filter((e) => e.tier === t).length} entries</a></p></div>`
  ).join("");

  return shell({
    title: "On the source tiers",
    nav: nav(entries, gaps, null),
    main: `<main id="main"><article>
<header class="entry-head"><h1>On the source tiers</h1>
<p class="also">An editorial note.</p></header>
${body}
</article></main>`,
    aside: `<aside class="meta" aria-label="The five tiers"><div class="meta-head">
<div class="legend">${legend}</div></div>
<div class="meta-refs"><h2>Cross-reference</h2><ul class="refs">
<li><a href="${u("/index/")}">Index of entries</a></li>
<li><a href="${u("/gaps/")}">Gaps</a></li>
</ul></div></aside>`,
  });
}
