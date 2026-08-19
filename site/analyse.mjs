import { loadEntries, CATEGORIES, TIERS, SOURCES } from "./lib/entries.js";

const { entries, bySlug, gaps } = loadEntries();
const words = (h) => h.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const text = (e) => (e.lead + e.sections.map(s => s.html).join(" ") + e.notes).replace(/<[^>]+>/g, " ");

const inbound = new Map(entries.map((e) => [e.slug, 0]));
for (const e of entries) for (const r of e.crossRefs) if (inbound.has(r)) inbound.set(r, inbound.get(r) + 1);

// Places the archive itself admits it does not know. These map to decisions not yet made.
const HEDGE = /not (?:been )?(?:established|able to|recorded|determinable|published|filed|resolved)|we have not|has not been recovered|unable to|not in dispute is not|no explanation|gives no (?:ground|reason)|not identif|cannot (?:say|establish|tell)|undefined|not clear/gi;

const rows = entries.map((e) => {
  const t = text(e);
  return {
    slug: e.slug, title: e.title, cat: e.category, tier: e.tier,
    w: words(e.lead) + e.sections.reduce((a, s) => a + words(s.html), 0) + words(e.notes),
    secs: e.sections.length, fields: e.fields.length,
    out: e.crossRefs.length, in: inbound.get(e.slug),
    cited: (SOURCES[e.slug] || []).length,
    hedges: (t.match(HEDGE) || []).length,
    markers: (t.match(/\[(?:FILING INCOMPLETE|RECORD DAMAGED|ENTRY NOT RECOVERED|NO SURVIVING PRIMARY SOURCE|NO LIVING SPEAKERS RECORDED|…|\.\.\.)\]/g) || []).length,
  };
});

const f = (r) => `${r.title.padEnd(34)} ${String(r.w).padStart(4)}w  in:${String(r.in).padStart(2)}  hedge:${r.hedges}  gap:${r.markers}  cite:${r.cited}`;

console.log("CORPUS", entries.length, "entries,", rows.reduce((a,r)=>a+r.w,0), "words, median", rows.map(r=>r.w).sort((a,b)=>a-b)[Math.floor(rows.length/2)]);

console.log("\n### CATEGORY");
for (const [k, label] of CATEGORIES) {
  const c = rows.filter((r) => r.cat === k); if (!c.length) continue;
  const w = c.reduce((a, r) => a + r.w, 0);
  console.log(`${label.padEnd(10)} n=${String(c.length).padStart(3)} mean=${String(Math.round(w/c.length)).padStart(4)}w  medIn=${c.map(r=>r.in).sort((a,b)=>a-b)[Math.floor(c.length/2)]}  uncited=${c.filter(r=>!r.cited).length}`);
}

console.log("\n### HIGH LOAD, LOW SUPPLY (in>=5, worst ratio first)");
rows.filter(r => r.in >= 5).sort((a,b) => b.in/b.w - a.in/a.w).slice(0, 18).forEach(r => console.log("  " + f(r)));

console.log("\n### THE ARCHIVE ADMITS IT DOES NOT KNOW (hedges>=2)");
rows.filter(r => r.hedges >= 2).sort((a,b) => b.hedges - a.hedges).forEach(r => console.log("  " + f(r)));

console.log("\n### THINNEST 20");
rows.slice().sort((a,b)=>a.w-b.w).slice(0,20).forEach(r => console.log("  " + f(r)));

console.log("\n### ORPHANS");
const orph = rows.filter(r => r.in === 0);
console.log("  count:", orph.length);
orph.sort((a,b)=>a.title.localeCompare(b.title)).forEach(r => console.log("  " + f(r)));

console.log("\n### UNCITED BY CATEGORY");
for (const [k, label] of CATEGORIES) {
  const c = rows.filter(r => r.cat === k && !r.cited);
  if (c.length) console.log(`  ${label} (${c.length}): ${c.map(r=>r.slug).join(", ")}`);
}

console.log("\n### DEAD REFS");
gaps.forEach(g => console.log(`  ${g.slug} <- ${g.from.length}`));
