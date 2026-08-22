# The Manuscript

The source the archive was compiled from. Everything in `entries/` is derived from this file;
until now it lived only in a working document, and the corpus had no primary source in the repo.

```
wake-draft-one.txt   WAKE, Draft One. The whole working document, verbatim.
art/                 Reference art from the same document.
```

## On the text

`wake-draft-one.txt` is a transcription of the author's working document, pasted in full because
the file itself was too large to upload. It is stored as `.txt` rather than `.md` so that GitHub
renders it preformatted and every line break survives; the dictated chapters lose their shape
entirely when a Markdown renderer reflows them into paragraphs.

**Nothing was corrected.** Typos, dropped words, doubled paragraphs, speech-to-text garble
(`Simpson` for `Jimzon`, `Kelso` for `Kelsa`, `Taurus` for `Torres`), bracketed reminders to self,
and pasted editorial feedback are all preserved as written. Several passages exist twice, as an
early version followed by a rewrite, and both are kept in place. This is a draft, and the archive
cites it as one.

155,506 words. Prologue, thirty-one numbered chapters, one unnumbered chapter marked
`REDACTED`, six POV chapters written out of sequence, and a long tail of notes.

## Its state, as the draft itself declares

- **Chapter 5** is headed *unfinished — needs rework, tone came off wrong*, with a note under it
  saying to cut the chapter entirely.
- **Chapter 7** is headed *unfinished — needs a lot of rewrites*.
- **Chapter 16** is not numbered. It appears between 15 and 17 as `Chapter ? REDACTED ?`.
- **Chapters 33 onward** carry the author's note that they were dictated as a rough pass and are
  "just the bones of the story."
- The **Kelsa**, **Jax**, **AJAX** and **Shayron** sections are POV chapters written out of order
  and not yet slotted into the sequence. They are titled, not numbered.
- The final chapter breaks off mid-scene, at the pre-parade clear.

## A numbering discrepancy

`site/chapters.json` records chapters **19** and **25** as absent from the manuscript, and
`site/src/sources.11ty.js` prints that claim on the Sources page. Both chapters are present in this
file. The archive was built against an earlier version in which the material now split across
18–19 and 24–25 sat in single chapters:

| Site record | This draft |
|---|---|
| Ch. 18 — "The argument, the rock, the punch. Flimmity, then Calsco." | Ch. 18 (the argument) and Ch. 19 (Flimmity, Calsco) |
| Ch. 24 — "The Prince act. The grievance. Ten million in one solar rotation." | Ch. 24 (the walk, the waiting room, Daiser) and Ch. 25 (the Council chamber) |

Every citation in `site/sources.json` pointing at chapter 19 or later is therefore one behind this
file. Reconciling them means renumbering the citation data, not editing this file, and which
numbering is canonical is the author's call. Left as found.

## art/

Reference images from the same document.

| File | Contents |
|---|---|
| `reference-plates.png` | Six captioned scenes: a masked Nhath gang member; Staff Sergeant Jimzon on a raid; Berji acquiring loot; the Mothership accounting offices; a raider attacking an outpost; Quinn during his first mission. |
| `character-lineup.jpg` | Ensemble lineup, unlabelled. |
| `horned-warrior.jpg` | The horned skull figure at the centre of the lineup, unlabelled. |

The two unlabelled files are named descriptively, not canonically. Rename them once the figures
have names.

## If you edit an entry against this file

The rules the corpus obeys are in the root `README.md`. The one that matters most here: the archive
holds the pieces, not the conclusions. This draft states outright what the Restoration must never be
able to say — that the Guard financed the Nhaths, that Operation Thorn Crown exists, that the
planetary cores are alive. Quote the evidence, never the answer.
