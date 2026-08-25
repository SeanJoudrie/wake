import { shell, nav } from "../lib/render.js";
import { loadEntries, escapeHtml, u, CATEGORIES } from "../lib/entries.js";

export const data = { permalink: "/plates/index.html" };

export function render() {
  const { entries, gaps } = loadEntries();
  const plated = entries.filter((e) => e.art);
  const label = Object.fromEntries(CATEGORIES);

  const items = plated
    .map(
      (e) => `<figure class="plate-card">
<a href="${u(`/entry/${e.slug}/`)}">
<img src="${u(`/art/${e.art}`)}" alt="${escapeHtml(e.title)}" loading="lazy" decoding="async" width="${(e.artSize || {}).width || 733}" height="${(e.artSize || {}).height || 1100}">
</a>
<figcaption>
<a class="plate-title" href="${u(`/entry/${e.slug}/`)}">${escapeHtml(e.title)}</a>
${e.artCaption ? `<span class="plate-cap">${escapeHtml(e.artCaption)}</span>` : ""}
<span class="plate-meta">${label[e.category] || e.category} <span class="tier" data-tier="${e.tier}">${e.tier}</span></span>
</figcaption>
</figure>`
    )
    .join("\n");

  const main = `<main id="main">
<article>
<header class="entry-head"><h1>Plates</h1>
<p class="also">${plated.length} plates. ${entries.length} entries.</p></header>
<p>Every image this volume holds. Most of what is catalogued here was never
drawn by anybody, and most of what was drawn did not survive, so the plates
are not a survey of the galaxy. They are a survey of what somebody happened
to make a picture of, which is a different thing and worth saying out loud.</p>
<p>None of these was made from life. Each was worked up from description,
by hand, by somebody who was not there.</p>
<div class="plate-grid">
${items}
</div>
</article>
</main>`;

  return shell({ title: "Plates", nav: nav(entries, gaps, null), main });
}
