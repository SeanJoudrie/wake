# PROMPT — DEEP ANALYSIS OF THE WAKE ENCYCLOPEDIA

*Paste this into a fresh session. Give the model the URL and nothing else.*

---

You are going to study a fictional world and tell me what is wrong with it.

**The target:** https://seanjoudrie.github.io/wake/

281 entries, roughly 58,000 words. It is an in-world encyclopedia for an unpublished science-fiction novel, written as if compiled by an organisation called the Restoration out of a galaxy that lost nearly all of its records in an event called the Wipe. Entries carry a source tier — intact, recovered, testimony, contested, inferred — and some entries are deliberately missing and render as `[ENTRY NOT RECOVERED]`.

**How to read it.** Start at `/index/`, which is the full catalogue as a collapsible tree in twelve sections: Worlds, Peoples, Persons, Places, Bodies, Events, Rites, Bindings, Objects, Materials, Flora, Tongues. Every entry is at `/entry/<slug>/`. Read widely before concluding anything. The cross-reference list at the foot of each entry is the map.

---

## HARD RULES

**1. Do not invent canon.** Not one detail. If something is missing, say it is missing. Do not helpfully fill it in, do not offer a version, do not write a sample entry unless I ask.

**2. Flag, do not fix.** Your job is diagnosis. I will decide what to do.

**3. Some absences are deliberate.** Fourteen references resolve to nothing on purpose — Queen Traceen, the first world, the Nhath disbursing fund, the Autumnal charter, and others. These are load-bearing silences, not oversights. Work out which absences are designed and which are neglect, and only report the second kind.

**4. The corpus stops before a plot reveal.** It deliberately contains no spoilers past roughly the first act. If a subject seems conspicuously thin, consider that it may be withheld rather than undeveloped, and say so rather than flagging it.

**5. Two conventions you will notice.** Institutional figures are precise; civilian figures are vague ranges. That is intentional — the Guard counts what it bills for and nothing else. And entries are meant to describe the thing rather than report that a record of it exists.

---

## THE SEVEN PASSES

Do all of them. Be specific and cite entries by name.

**1. Contradictions.** What cannot both be true? Two entries stating incompatible facts, a rule established in one place and broken in another, a consequence that the rest of the world does not reflect. Rank by how much would have to be rewritten to fix each one.

**2. Unexploited consequences.** The most valuable pass. Find rules that are established and then not followed to their second and third order. If X is true, what else must be true, and is it there? A world is thin where its own logic has been left unexecuted.

**3. The generic test.** Which entries would survive being moved into any other science-fiction setting unchanged? Those are the weak ones, however well written. Name them. Then name the entries that could only exist in this world, and say what makes them specific, because those are the model.

**4. Load-bearing versus thin.** Some subjects are referenced by dozens of other entries and say very little. Weigh depth against how much the rest of the corpus leans on it, and rank what would pay back most.

**5. Systems that do not close.** Work out which of these can actually be answered from the corpus, and which fall apart under a second question: money, travel time and distance, population, law enforcement outside the Guard, food supply, the calendar, medicine, who fixes things. Pick at any system and see whether it holds.

**6. The thematic read.** What is this world actually about? Not what it says it is about. Then find where the worldbuilding contradicts its own theme, or fails to serve it. Be direct if the answer is unflattering.

**7. The reader test.** Imagine somebody who has never read the novel, flipping through this for pleasure. Where do they get bored? What are they looking for that is not here? What is the single best page, and why?

---

## ALREADY KNOWN — do not spend time rediscovering these

- The currency is unreconciled. Guard credits, Guardcoin and Royal money do not add up.
- Childhood is almost entirely absent.
- So are funerals: fourteen marriage rites against one death rite.
- Disability and prosthetics are unaddressed despite regenerative medicine being a finite stockpile.
- The elderly, who are the last living witnesses to the pre-war galaxy, barely appear.
- Marriage rites are deliberately unassigned to worlds.

Go past these. If you find something underneath them, that is worth having.

---

## WHAT I DO NOT WANT

No summary of the world back to me — I wrote it. No praise. No hedging every finding into uselessness. Do not tell me it is impressive. Do not pad with caveats. If a pass turns up nothing worth saying, say so in one line and move on.

## OUTPUT

Plain text, readable on a phone. No tables wider than four columns. For every finding: the entry or entries by name, what is wrong in one sentence, and why it matters in one more. Rank each pass most-serious first.

End with the five things you would fix first, in order, and a sentence each on why.
