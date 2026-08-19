// Packages the whole site into one self-contained HTML file with hash routing.
// Same tokens, same templates, same markup. Fonts inlined so nothing is fetched.
import fs from "node:fs";
import path from "node:path";
import { loadEntries, TIERS, escapeHtml } from "./lib/entries.js";
import { nav } from "./lib/render.js";

const S = "src/styles";
const pick = (html, re) => (html.match(re) || [""])[0];
const MAIN = /<main id="main">[\s\S]*?<\/main>/;
const ASIDE = /<aside class="meta"[\s\S]*?<\/aside>/;

const mods = {
  home: await import("./src/home.11ty.js"),
  catalogue: await import("./src/catalogue.11ty.js"),
  gaps: await import("./src/gaps.11ty.js"),
  about: await import("./src/about.11ty.js"),
  tiers: await import("./src/tiers.11ty.js"),
  entry: await import("./src/entry.11ty.js"),
};

const { entries, gaps } = loadEntries();
const routes = [];
const add = (route, title, html) =>
  routes.push({ route, title, main: pick(html, MAIN), aside: pick(html, ASIDE) });

add("/", "The Wake Encyclopedia", mods.home.render());
add("/index/", "Index of entries", mods.catalogue.render());
add("/gaps/", "Gaps", mods.gaps.render());
add("/about/", "On the source tiers", mods.about.render());
for (const t of TIERS) add(`/tiers/${t.toLowerCase()}/`, t, mods.tiers.render({ tier: t }));
for (const e of entries) add(`/entry/${e.slug}/`, e.title, mods.entry.render({ entry: e }));

// Inline every font face as a data URI.
const fonts = fs
  .readFileSync(path.join(S, "fonts.css"), "utf8")
  .replace(/url\(fonts\/([^)]+)\)/g, (_, f) => {
    const b64 = fs.readFileSync(path.join(S, "fonts", f)).toString("base64");
    return `url(data:font/woff2;base64,${b64})`;
  });

const css =
  fs.readFileSync(path.join(S, "tokens.css"), "utf8") +
  "\n" + fonts +
  "\n" + fs.readFileSync(path.join(S, "main.css"), "utf8") +
  `
/* Single-file routing. Only the active route is in the grid. */
.page { display: none; }
.page.active { display: contents; }
body.at-title .index, body.at-title .drawer-toggle { display: none; }
body.at-title .frame { grid-template-columns: minmax(0, 1fr); min-height: 100vh; place-items: center; }
body.at-title main { max-width: 40rem; padding: var(--sp-6); text-align: center; }
body.at-title blockquote { margin: 0; font: 600 var(--t-39)/1.25 var(--display); color: var(--ink); }
body.at-title .enter { display: inline-block; margin-top: var(--sp-8); font: 400 var(--t-12)/1 var(--data);
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-soft); text-decoration: none;
  border-bottom: 1px solid var(--paper-edge); padding-bottom: var(--sp-1); }
body.at-title .enter:hover { color: var(--seal); border-bottom-color: var(--seal); }
@media (max-width: 720px) { body.at-title blockquote { font-size: var(--t-25); } }
`;

const pages = routes
  .map(
    (r) =>
      `<div class="page" data-route="${r.route}" data-title="${escapeHtml(r.title)}">${r.main}${r.aside}</div>`
  )
  .join("\n");

const router = `
(function () {
  var pages = [].slice.call(document.querySelectorAll(".page"));
  var links = [].slice.call(document.querySelectorAll(".index a"));
  function go() {
    var r = location.hash.slice(1) || "/";
    var hit = pages.filter(function (p) { return p.dataset.route === r; })[0];
    if (!hit) { hit = pages[0]; r = "/"; }
    pages.forEach(function (p) { p.classList.toggle("active", p === hit); });
    document.body.classList.toggle("at-title", r === "/");
    document.title = hit.dataset.title + " \\u00b7 The Wake Encyclopedia";
    links.forEach(function (a) {
      if (a.getAttribute("href") === "#" + r) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.body.classList.remove("drawer-open");
    var t = document.querySelector(".drawer-toggle");
    if (t) t.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", go);
  go();
})();
`;

const doc = `<meta charset="utf-8">
<title>The Wake Encyclopedia</title>
<style>${css}</style>
<a class="skip" href="#main">Skip to entry</a>
<button class="drawer-toggle" aria-expanded="false" aria-controls="index">Index</button>
<div class="frame">
${nav(entries, gaps, null)}
${pages}
</div>
<script>${fs.readFileSync(path.join(S, "index.js"), "utf8")}</script>
<script>${router}</script>
`;

fs.writeFileSync("../wake-encyclopedia.html", doc);
console.log("routes:", routes.length, "| bytes:", doc.length.toLocaleString());
