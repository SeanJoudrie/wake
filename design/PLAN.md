# Design plan

Written before the code, per the brief. Every value in `site/src/styles/tokens.css`
derives from this page.

## Palette

| Token | Value | Job |
|---|---|---|
| `--paper` | `#E8DFCC` | page. Manila, not cream |
| `--paper-deep` | `#DAD0B7` | table stripes at 40% |
| `--paper-edge` | `#C8BC9F` | hairlines, dividers, the compiler-note bar |
| `--ink` | `#24211C` | primary text |
| `--ink-soft` | `#665D4C` | secondary text, labels, compiler notes |
| `--seal` | `#23474C` | links, focus rings, the INTACT stamp |
| `--absence` | `#9B3A2E` | **reserved** |

`--ink-soft` was given as `#6E6555`. At that value it contrasts 4.35:1 against
`--paper`, which fails WCAG AA for body-size text, and the quality floor is not
optional. Darkened to `#665D4C`, which measures 4.86:1. Nothing else moved.

**The reserved colour.** `--absence` appears only where the record fails: the
`CONTESTED` stamp, `[ENTRY NOT RECOVERED]`, `[RECORD DAMAGED]`, dead cross-references,
and any population the archive cannot narrow. Not links, not buttons, not headings,
not hovers. A reader learns to scan for it within two entries, and after that the
quantity of red on a page is a readout of how much the archive does not know.

The build enforces this: `#9B3A2E` is defined once, in `tokens.css`, and reached only
through the variable.

## Faces

| Role | Face | Job |
|---|---|---|
| Display | Archivo Narrow 600 | entry titles, category labels, index headers |
| Body | IBM Plex Serif 400/600/400i | all running text |
| Data | IBM Plex Mono 400/500 | tier stamps, every metadata value, cross-references, compiler notes, gap markers |

Self-hosted from `site/src/styles/fonts/`, latin and latin-ext only, 208 KB total.
No request leaves the page at runtime.

Every metadata value is mono, which is what makes the numbers rule visible: a Guard
tonnage filed to one decimal and a civilian population range a billion wide sit in the
same face at the same size, four rows apart.

## Entry template

```
┌───────────────┬──────────────────────────────┬──────────────────┐
│ ⌕ search      │                              │ ══════════════   │
│               │  WAKE                        │  CONTESTED       │ stamp, -0.4deg
│ WORLDS        │  also: Waketin · Origin      │ ══════════════   │
│ │Wake         │  ──────────────────────────  │                  │
│  Modanick     │                              │ SYSTEM           │
│  Creta        │  Destroyed planet. Widely    │ Wake (six bodies)│
│               │  held to be the world of     │ ──────────────   │
│ PEOPLES       │  human origin, though the    │ POPULATION       │
│  Humans       │  claim rests on sampling     │ 900 million to   │ absence
│  The Nhath    │  whose methodology did not   │ 4 billion        │
│               │  survive.                    │ ──────────────   │
│ EVENTS        │                              │ MEMBERSHIP       │
│  The Wipe     │  ┃ [Compiler's note: we      │ [ENTRY NOT       │ absence
│               │  ┃ hold four hundred and     │  RECOVERED]      │
│ 240px         │  ┃ eleven pages of ledger…]  │                  │
│               │        65ch, max 720px       │ CROSS-REF        │
│               │                              │ Corefuel         │
│               │                              │ T̶h̶e̶ ̶W̶a̶k̶e̶ ̶c̶e̶n̶s̶u̶s̶  │
│               │                              │ [ENTRY NOT REC.] │ dead
└───────────────┴──────────────────────────────┴──────────────────┘
```

At 1080px the metadata column moves above the body. At 720px the index becomes a
drawer, the tier stamp comes first, and cross-references go to the foot.

## Signature element

A struck ink stamp, rotated a half-degree, that is the only heavy mark on the page and
turns red only when the archive is uncertain.

## Three defaults deliberately broken

1. **The metadata column would have been a card** with a tinted fill and rounded
   corners. Removed. It is a bare column of hairline-separated rows on the same paper
   as the body, so the stamp is the only object on the page with weight.
2. **Search would have returned matching entries.** It also returns absences: typing
   `autumnal` surfaces `The Autumnal charter — referenced by 3` in `--absence`, unlinked.
   A search field that returns holes is not something built for any other reference site.
3. **`/gaps` would have been alphabetical.** It is ranked by inbound reference count, so
   the most-pointed-at absence is first. Alphabetical is a list. Ranked is the shape of
   the hole.

## Collapsible sections

Entries carry no markdown headings. Their structure is bold lead-ins, 446 ending in a
period and 206 in a colon. The build promotes those into real sections and renders each
as a native `<details>`, collapsed. 461 sections across 123 entries; 50 short entries
have none and are unchanged.

What stays open, and why:

- **The lead.** The opening definition and the paragraphs before the first section.
  Every entry with sections has one, so no entry opens on a wall of shut boxes.
- **The compiler's notes.** They are the archive talking about itself and are the best
  writing in the volume. Trailing notes are lifted out of the last section.
- **The tier stamp**, always, on every screen size.

The disclosure marker is `[+]` / `[−]` in mono, not a triangle: the brief allows a rule,
a bracket, or a mono glyph, and no icon set.

**The gap badge.** Collapsing hides text, and this design puts its whole argument in how
much red a page carries. So a shut section still declares what it is hiding: a summary
whose content holds bracketed gap markers prints `2 gaps` in `--absence` on the right of
the row. Thirteen entries carry one. The signal survives the collapse, which is the only
reason collapsing is acceptable here.

**Record details on mobile.** Below 720px the metadata column sits above the body, per
the brief, so a reader meets the tier before the first word. With sections shut the body
became short while that column stayed long, and the entry title fell a screen down the
page. The fields now collapse under `[+] RECORD DETAILS` on narrow screens only; the
stamp never collapses. Desktop is untouched. On Marfeld this moves the title from roughly
1300px down the page to 216px.

Print forces every section and record open, by CSS and again on `beforeprint`.

## The index as the encyclopedia

The index is no longer a list of links to elsewhere. It is a tree of disclosures, three
levels deep, and it is where the volume is meant to be read.

1. **Ten categories**, shut. Each row carries its entry count, and its contested count in
   `--absence` when it has one. Peoples is 5 contested out of 10, and that reads before a
   single category is opened.
2. **Entry rows**, shut, each with its tier at the right.
3. **The entry itself**, dropping open in place: subtitle, record fields, lead, sections,
   compiler's notes, cross-references, and a link to its own page.

An entry opened inside the index renders its sections **open**, where the same entry on
its own page renders them shut. That is deliberate rather than inconsistent. Reaching an
entry in the index already costs two clicks, and a third to read a paragraph is too many;
the entry page is for reading one thing, so it opens quiet. Both carry the same controls.

The left navigation folds by category too, so the mobile drawer is ten rows rather than
a hundred and seventy-three. Search force-opens any fold holding a match, so a shut
category can never swallow a result.

The mobile index button became an opaque sticky bar. As a floating pill it sat on top of
whatever row was under it while scrolling.
