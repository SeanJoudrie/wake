import fs from "node:fs";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: false });
const src = fs.readFileSync("../design/GAPS-ANALYSIS.md", "utf8");

// Drop the H1 and the italic strapline; they become the page header.
const body = md.render(
  src.split("\n").slice(1).join("\n").replace(/^\*Measured.*\*$/m, "").trim()
);

const doc = `<meta charset="utf-8">
<title>Where the Encyclopedia Is Thin</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&display=swap">
<style>
:root{
  --paper:#E8DFCC; --paper-deep:#DAD0B7; --paper-edge:#C8BC9F;
  --ink:#24211C; --ink-soft:#665D4C; --seal:#23474C; --absence:#9B3A2E;
  --display:"Archivo Narrow","Arial Narrow",sans-serif;
  --body:"IBM Plex Serif",Georgia,serif;
  --data:"IBM Plex Mono",ui-monospace,Consolas,monospace;
}
*,*::before,*::after{box-sizing:border-box;border-radius:0}
body{margin:0;background:var(--paper);color:var(--ink);
  font:400 1rem/1.62 var(--body);}
.wrap{max-width:74ch;margin:0 auto;padding:clamp(2rem,6vw,5rem) clamp(1rem,5vw,2rem) 6rem}
header.top{border-bottom:2px solid var(--ink);padding-bottom:1.25rem;margin-bottom:2.5rem}
header.top h1{margin:0;font:600 clamp(2rem,6vw,2.75rem)/1.08 var(--display);
  text-transform:uppercase;letter-spacing:-0.01em;text-wrap:balance}
header.top p{margin:.75rem 0 0;font:400 .75rem/1.5 var(--data);
  text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft)}

h1{font:600 1.9375rem/1.15 var(--display);text-transform:uppercase;letter-spacing:-0.01em;
  margin:3.5rem 0 1rem;padding-top:1.25rem;border-top:2px solid var(--ink);text-wrap:balance}
h2{font:600 1.5625rem/1.2 var(--display);text-transform:uppercase;letter-spacing:.01em;
  margin:2.75rem 0 .75rem;text-wrap:balance}
h3{font:600 1rem/1.3 var(--display);text-transform:uppercase;letter-spacing:.04em;
  margin:2rem 0 .5rem;color:var(--ink-soft)}
p{margin:0 0 1rem}
strong{font-weight:600}
ul,ol{margin:0 0 1rem;padding-left:1.5rem}
li{margin-bottom:.4rem}
a{color:var(--seal);text-decoration:underline;text-underline-offset:3px}
hr{border:0;border-top:1px solid var(--paper-edge);margin:3rem 0}

/* Numbers, and only numbers, in mono. */
code{font:400 .9em/1 var(--data);background:none;padding:0;color:var(--ink)}

.scroll{overflow-x:auto;margin:0 0 1.5rem}
table{width:100%;border-collapse:collapse;font-size:.875rem}
th,td{text-align:left;padding:.5rem .75rem .5rem 0;border-bottom:1px solid var(--paper-edge);
  vertical-align:top}
th{font:600 .75rem/1.3 var(--data);text-transform:uppercase;letter-spacing:.06em;
  color:var(--ink-soft)}
td{font-family:var(--data);font-size:.8125rem;font-variant-numeric:tabular-nums}
td:first-child,td:nth-child(2){font-family:var(--body);font-size:.875rem}
tbody tr:nth-child(even){background:color-mix(in srgb,var(--paper-deep) 40%,transparent)}

/* The one reserved colour, used only where something is missing. */
em{font-style:italic}
blockquote{margin:1.5rem 0;padding-left:1.25rem;border-left:2px solid var(--paper-edge);
  color:var(--ink-soft);font-style:italic}
:focus-visible{outline:2px solid var(--seal);outline-offset:2px}
@media print{body{background:#fff;color:#000}}
</style>
<div class="wrap">
<header class="top">
<h1>Where the encyclopedia is thin</h1>
<p>191 entries &middot; 28,103 words &middot; measured, not eyeballed</p>
</header>
${body.replace(/<table>/g, '<div class="scroll"><table>').replace(/<\/table>/g, "</table></div>")}
</div>
`;

fs.writeFileSync("../design/gaps-analysis.html", doc);
console.log("bytes:", doc.length.toLocaleString());
