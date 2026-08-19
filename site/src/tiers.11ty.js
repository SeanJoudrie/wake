import { shell, nav, stamp } from "../lib/render.js";
import { loadEntries, escapeHtml, u, TIERS } from "../lib/entries.js";

export function data() {
  return {
    tiers: TIERS,
    pagination: { data: "tiers", size: 1, alias: "tier" },
    permalink: (d) => `/tiers/${d.tier.toLowerCase()}/index.html`,
  };
}

export function render(d) {
  const { entries, gaps } = loadEntries();
  const tier = d.tier;
  const rows = entries.filter((e) => e.tier === tier);

  const items = rows
    .map(
      (e) =>
        `<li><a href="${u(`/entry/${e.slug}/`)}">${escapeHtml(e.title)}</a>` +
        `<span class="tier">${e.category}</span></li>`
    )
    .join("");

  const others = TIERS.filter((t) => t !== tier)
    .map((t) => `<a href="${u(`/tiers/${t.toLowerCase()}/`)}">${t}</a>`)
    .join(" &middot; ");

  const main = `<main id="main">
<article>
<header class="entry-head"><h1>${tier}</h1>
<p class="also">${rows.length} of ${entries.length} entries.</p></header>
<ul class="listing">${items}</ul>
<p class="also">Other tiers: ${others}</p>
</article>
</main>`;

  return shell({
    title: tier,
    nav: nav(entries, gaps, null),
    main,
    aside: `<aside class="meta" aria-label="Source tier"><div class="meta-head">${stamp(
      tier
    )}</div><div class="meta-refs"><h2>See also</h2><ul class="refs"><li><a href="${u(
      "/about/"
    )}">On the source tiers</a></li></ul></div></aside>`,
  });
}
