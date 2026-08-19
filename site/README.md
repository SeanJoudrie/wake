# site

Eleventy build for the encyclopedia. No client framework, no CSS framework.

```
npm install
npm run serve     # http://localhost:8080
npm run build     # -> _site
```

Entries are read from `../entries/*.md` at build time by `lib/entries.js`. Nothing in
this directory needs editing to add an entry: write the markdown, rebuild.

| Path | Source |
|---|---|
| `/` | `src/home.11ty.js`. The epigraph, one line |
| `/about/` | `src/about.11ty.js`, rendering `../_conceit.md` |
| `/index/` | `src/catalogue.11ty.js`. All entries by category |
| `/entry/<slug>/` | `src/entry.11ty.js`, one page per file in `../entries` |
| `/gaps/` | `src/gaps.11ty.js`. Unresolved references, ranked |
| `/tiers/<tier>/` | `src/tiers.11ty.js` |

## How an entry becomes a page

`lib/entries.js` splits each markdown file into the parts the template needs:

- the `*also known as:*` line becomes the subtitle
- the first run of two or more `**Label:** value` lines becomes the metadata column
- the trailing `*Cross-ref:*` line is dropped; the column is built from frontmatter
  `cross_refs` instead, so a reference resolves if and only if the file exists
- bracketed gap markers are wrapped in `--absence`
- a population the archive cannot narrow is treated as a failure of the record, not a
  fact, and is coloured accordingly

`ghost-names.json` supplies display names for slugs that have no entry. A slug missing
from it falls back to its own dashes-to-spaces form, so nothing breaks if you add a
dead reference and forget.

## Deployment

`.github/workflows/pages.yml` builds and deploys on push. It needs Pages enabled once:
**Settings → Pages → Build and deployment → Source: GitHub Actions.**

`SITE_BASE` in the workflow sets the path prefix (`/wake` for a project page). Set it to
an empty string for a custom domain or a user page.

## Single-file build

`node build-artifact.mjs` (with `SITE_BASE='#'`) packages all 182 routes into one
self-contained `../wake-encyclopedia.html`: same templates, same tokens, hash routing,
fonts inlined as data URIs. It opens from a file:// URL with no server and makes no
network request. Useful for sharing a copy or reading offline.
