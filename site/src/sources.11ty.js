import { shell, nav } from "../lib/render.js";
import { loadEntries, escapeHtml, u, CHAPTERS, SOURCES } from "../lib/entries.js";

export const data = { permalink: "/sources/index.html" };

export function render() {
  const { entries, bySlug, gaps } = loadEntries();

  // Which entries each chapter feeds.
  const byChapter = new Map();
  for (const [slug, chs] of Object.entries(SOURCES)) {
    for (const n of chs) {
      if (!byChapter.has(n)) byChapter.set(n, []);
      byChapter.get(n).push(slug);
    }
  }

  const rows = CHAPTERS.chapters
    .map((c) => {
      const fed = (byChapter.get(c.n) || [])
        .map((s) => bySlug.get(s))
        .filter(Boolean)
        .sort((a, b) => a.title.localeCompare(b.title));
      const links = fed.length
        ? fed
            .map((e) => `<a href="${u(`/entry/${e.slug}/`)}">${escapeHtml(e.title)}</a>`)
            .join(" &middot; ")
        : "<span class='rk-none'>No entry in this volume draws on it.</span>";
      return `<div class="chapter" id="ch-${c.n}">
<p class="ch-head"><span class="ch-n">Ch. ${c.n}</span>
<span class="ch-pov">${escapeHtml(c.pov)}</span>
<span class="ch-where">${escapeHtml(c.where)}</span></p>
<p class="ch-what">${escapeHtml(c.what)}</p>
<p class="ch-feeds">${links}</p>
</div>`;
    })
    .join("\n");

  const cited = Object.keys(SOURCES).filter((s) => bySlug.has(s)).length;

  const main = `<main id="main">
<article>
<header class="entry-head"><h1>Reader's key</h1>
<p class="also">Where each entry comes from in the manuscript.</p></header>

<div class="readers-key rk-standalone">
<p class="rk-label">This page is not part of the archive</p>
<p class="rk-body">Everything else on this site is written from inside the world, by a
civilian body reassembling the record from paper. This page is not. It is apparatus for
you, the reader, and it says where in the manuscript each entry is seen.</p>
<p class="rk-body">${escapeHtml(CHAPTERS.note)}</p>
</div>

<p>${cited} of ${entries.length} entries carry a citation. The rest are built from the
worldbuilding record rather than from a scene, and are marked with nothing.</p>

<p>Chapters ${CHAPTERS.missing.join(" and ")} are absent from the manuscript. Chapter 16
is redacted by intent and is listed as it stands.</p>

<div class="chapters">
${rows}
</div>

<h2>Fragments</h2>
<ul class="listing">
${CHAPTERS.fragments
  .map((f) => `<li><span class="ch-what">${escapeHtml(f.what)}</span></li>`)
  .join("\n")}
</ul>
</article>
</main>`;

  return shell({ title: "Reader's key", nav: nav(entries, gaps, null), main });
}
