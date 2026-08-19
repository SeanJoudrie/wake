#!/usr/bin/env python3
"""Regenerate index.md from entry frontmatter.

A cross-reference is unresolved when no file exists at entries/<slug>.md.
Unresolved refs are printed in the index as [ENTRY NOT RECOVERED]. They are
content, not errors. Do not prune them.
"""
import os
import re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRIES = os.path.join(ROOT, "entries")

CATEGORY_ORDER = [
    ("world", "Worlds and systems"),
    ("location", "Locations"),
    ("people", "Peoples and species"),
    ("institution", "Institutions"),
    ("event", "Events and history"),
    ("practice", "Practices, faiths and culture"),
    ("technology", "Technology"),
    ("material", "Materials"),
    ("flora-fauna", "Flora, fauna and consumables"),
    ("language", "Language"),
]

TIER_ORDER = ["INTACT", "RECOVERED", "TESTIMONY", "CONTESTED", "INFERRED"]


def parse(path):
    text = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        raise SystemExit("no frontmatter: %s" % path)
    fm = {}
    for line in m.group(1).splitlines():
        if ": " not in line:
            continue
        k, v = line.split(": ", 1)
        v = v.strip()
        if v.startswith("[") and v.endswith("]"):
            inner = v[1:-1].strip()
            v = [x.strip() for x in inner.split(",") if x.strip()] if inner else []
        fm[k.strip()] = v.strip('"') if isinstance(v, str) else v
    return fm


def main():
    entries = {}
    for name in sorted(os.listdir(ENTRIES)):
        if name.endswith(".md"):
            entries[name[:-3]] = parse(os.path.join(ENTRIES, name))

    by_cat = defaultdict(list)
    for slug, fm in entries.items():
        by_cat[fm["category"]].append((fm["title"], slug, fm["tier"]))

    unresolved = defaultdict(list)
    for slug, fm in entries.items():
        for ref in fm.get("cross_refs", []):
            if ref not in entries:
                unresolved[ref].append(slug)

    tier_counts = {t: 0 for t in TIER_ORDER}
    for fm in entries.values():
        tier_counts[fm["tier"]] += 1

    out = []
    out.append("# INDEX OF ENTRIES\n")
    out.append("*%d entries. Compiled to GC 4462. Incomplete.*\n" % len(entries))
    out.append("| Tier | Entries |")
    out.append("|---|---|")
    for t in TIER_ORDER:
        out.append("| `%s` | %d |" % (t, tier_counts[t]))
    out.append("")
    out.append("See `_conceit.md` for what the tiers mean.\n")

    seen = set()
    for key, heading in CATEGORY_ORDER:
        rows = sorted(by_cat.get(key, []))
        if not rows:
            continue
        seen.add(key)
        out.append("## %s\n" % heading)
        out.append("| Entry | Tier |")
        out.append("|---|---|")
        for title, slug, tier in rows:
            out.append("| [%s](entries/%s.md) | `%s` |" % (title, slug, tier))
        out.append("")

    for key in sorted(set(by_cat) - seen):
        out.append("## %s\n" % key)
        for title, slug, tier in sorted(by_cat[key]):
            out.append("- [%s](entries/%s.md) `%s`" % (title, slug, tier))
        out.append("")

    out.append("## Unresolved cross-references\n")
    out.append("Referenced in this volume. No entry has been recovered.\n")
    out.append("| Reference | Pointed to from |")
    out.append("|---|---|")
    for ref in sorted(unresolved):
        src = " · ".join("[%s](entries/%s.md)" % (entries[s]["title"], s)
                         for s in sorted(unresolved[ref]))
        out.append("| `%s` `[ENTRY NOT RECOVERED]` | %s |" % (ref, src))
    out.append("")

    with open(os.path.join(ROOT, "index.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(out))

    print("%d entries, %d unresolved references" % (len(entries), len(unresolved)))
    for ref in sorted(unresolved):
        print("  unresolved: %s (from %d)" % (ref, len(unresolved[ref])))


if __name__ == "__main__":
    main()
