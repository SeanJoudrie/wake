# The Wake Encyclopedia

The in-world archive for the novel *WAKE*: the artifact the fictional world produced, not a
companion guide. Compiled by **The Restoration**, an underfunded civilian reclamation body
working from paper after **The Wipe**.

## Layout

```
title.md            The epigraph page. One line.
_conceit.md         The compilers' editorial note on the source tiers.
index.md            Generated. All entries by category, unresolved refs marked.
entries/<slug>.md   One file per entry.
tools/build_index.py Regenerates index.md from entry frontmatter.
```

## Frontmatter

```yaml
title:      Display name
slug:       Filename, kebab-case
category:   world | location | people | institution | event | practice
            | technology | flora-fauna | language | material
tier:       INTACT | RECOVERED | TESTIMONY | CONTESTED | INFERRED
cross_refs: [slug, slug, ...]
```

`cross_refs` lists resolved and unresolved references together. A reference is **unresolved**
when no file exists at `entries/<slug>.md`. This is deliberate: the site does not need a
maintained list of missing pages, it just checks the filesystem. `tools/build_index.py`
resolves them the same way.

Broken cross-references are content. Do not prune them.

## Rules the corpus obeys

1. Exactly one tier tag per entry.
2. Corporate, military and infrastructural figures are precise. Civilian figures (population,
   casualties, births, displacement) are ranges a billion wide.
3. No editorialising. No em dashes as sentence breaks. No modern idiom. No rhetorical
   questions. Force comes from juxtaposition only.
4. No protagonist entries. The one exception is Korjin Cavaris, who appears as a licensing
   footnote inside `corefuel` and nowhere else.
5. The archive does not know: that the Guard financed the Nhaths, that the Kitalia cells were
   Guard-created, that Operation Thorn Crown exists, or that planetary cores are alive. It
   holds only the pieces from which a suspicious reader could assemble those conclusions.

## Assumptions made during compilation

These are authorial decisions taken to make `INTACT` records specific. All are one
find-and-replace away from changing.

**The Galactic Calendar epoch.** Only one date was fixed in the source material: the Astonian
annexation in **GC 4419**. Everything else was built outward from that, using the ~60 year
war distance recommended in the worldbuilding document.

| GC | Event |
|---|---|
| 4386 to 4393 | Commencement of hostilities. Dated differently on every world. `CONTESTED` |
| 4394 | Destruction of Wake, per Guard record. Testimony disagrees |
| 4401 | The Wipe |
| 4402 | Cessation of hostilities, per Guard record |
| 4406 | The Guard incorporated. Foundation Day |
| 4417 | Corefuel synthesis process registered |
| 4419 | Astonian annexation |
| 4427 | Modanick accession by referendum |
| 4431 | Monver accession on negotiated terms |
| 4461 | Kitalia platform collapse |
| **4462** | **Present. Compilation date** |

**Named-after-a-character entries were retitled** so the archive does not surface people it has
no reason to know. Korjin's extraction station is filed as `wake-extraction-station`;
Kaspian's species as `pre-human-inhabitants-of-wake`; Nardow's species as
`species-of-unresolved-classification`.

**Unresolved in the source material, and left unresolved here:** the Krostin Sector, the
etymology of "Crag", the third cause of the collapse, the name of the collective-souls faith,
and whether the Guard broke the Sansvor blockade or caused it. The last is printed as
`CONTESTED` with both versions, which is the honest outcome either way.

## Current state

173 entries, ~35,000 words, compiled to GC 4462.

| Tier | Entries |
|---|---|
| `INTACT` | 105 |
| `TESTIMONY` | 41 |
| `CONTESTED` | 12 |
| `RECOVERED` | 11 |
| `INFERRED` | 4 |

The skew toward `INTACT` is deliberate and is the argument. Commercial and administrative
paper survived in bulk; almost everything about people did not. The second-largest tier is
`TESTIMONY`, and it is where the faiths and the non-human peoples live.

Twelve cross-references resolve to nothing. They are listed at the foot of `index.md`. The
load-bearing one is `queen-traceen`: the reigning sovereign of the Royal systems has no entry,
because the archive has no document that would let it write one.

Run `python3 tools/build_index.py` after adding or editing entries.
