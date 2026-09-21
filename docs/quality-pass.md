# Quality pass — provenance, performance, shareability, accessibility

Follow-up to a site review that flagged four issues. Ordered by the review's own
rank, with the copyright/provenance item (the one that matters most) first.

## 1. Attribution & provenance (highest priority)

**The problem.** The app mirrors the handout/worksheet numbering and structure of
a copyrighted workbook (Guilford Press, 2014) and is published on a public repo
and a public site, with no clear provenance statement, no non-affiliation notice,
and no takedown path.

**What was added**

| File | Purpose |
| --- | --- |
| `src/app/about/page.tsx` | New `/about` page: source attribution, explicit non-affiliation, "not medical advice", crisis note, a link to buy the official workbook, and a takedown route via the issue tracker. |
| `NOTICE.md` | Repo-level provenance statement, non-affiliation, and the unresolved decisions only the owner can make (permission, license, indexing). |
| `src/components/dbt/sidebar.tsx` | Sidebar footer now links to `/about`. |
| `src/components/dbt/help-dialog.tsx` | Help dialog links to `/about`. |
| `README.md` | Expanded the License section into license **and** attribution, pointing at `NOTICE.md`. |

**What this does *not* fix — read this.** Code cannot resolve a rights question.
This work makes the provenance explicit, non-affiliation clear, and removal easy,
which materially lowers the *apparent* risk of a bad-faith reading. It does not
grant permission and does not make redistribution lawful if it was not before.
Only the owner can decide whether to (a) keep it private, (b) seek written
permission, or (c) keep it public with attribution. `NOTICE.md` spells these out.

## 2. Performance — jsPDF was in the first-load bundle

**The problem.** The single largest chunk (934 KB) contained jsPDF, pulled in
eagerly through `worksheet-detail`, `diary-comparison`, `session-prep`, and
`goals` → `worksheet-pdf` / `goals-pdf`.

**What changed.** PDF generation is now loaded on demand:

- `worksheet-detail.tsx`, `diary-comparison.tsx`: the export handler `await import("@/lib/worksheet-pdf")` on click.
- `goals.tsx`: both export handlers `await import("@/lib/goals-pdf")` on click.
- `session-prep.tsx`: removed a dead import of `worksheet-pdf` (it was never called).

**Measured effect** (production build, home route, initial JS actually referenced):

| | Before | After | Change |
| --- | --- | --- | --- |
| Home initial JS | 1,599 KB | **1,171 KB** | **−428 KB (−27%)** |
| Largest chunk | 934 KB (contains jsPDF) | 409 KB (lazy) | jsPDF moved out |
| jsPDF in first load | yes | **no** | chunk is lazy, HTTP 200 |

PDF export still works — the library now loads when the button is pressed instead
of on page load.

## 3. Shareability & SEO

**The problem.** No `og:image` (bare link previews), `/sitemap.xml` 404, no robots
policy, and Twitter used a small summary card.

**What was added**

- `tools/make-og-image.mjs` + `public/og-image.png` — a real 1200×630 share card,
  rasterised from SVG with the already-present `sharp` dependency (module accent
  colours, 11-Build-style restrained typography). Re-runnable.
- `src/app/sitemap.ts` → serves `/sitemap.xml`.
- `src/app/robots.ts` → serves `/robots.txt` with the sitemap reference.
- `src/app/layout.tsx` — added `metadataBase`, `openGraph.url`, `openGraph.siteName`,
  `openGraph.images`, and switched Twitter to `summary_large_image` with an image.

**Verified** on the built server: `/sitemap.xml` → 200 with 2 URLs, `/robots.txt` →
200, `/og-image.png` → 200 (43,572 bytes); `/` HTML carries `og:image`,
`og:url`, and `twitter:card=summary_large_image`.

## 4. Accessibility

- `src/app/layout.tsx` — a "Skip to content" link, visually hidden until focused,
  targeting `#main-content`.
- `src/app/page.tsx` — the main region now has `id="main-content"`.
- `/about` also exposes `id="main-content"` as its main landmark.

**Verified**: the skip link is present in the served HTML and, in the browser,
appears in the accessibility tree at `x=-1` (i.e. hidden until focused).

## Verification summary

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | clean (exit 0) |
| `npx next build` | compiled successfully; routes now include `/about`, `/robots.txt`, `/sitemap.xml` |
| Home initial JS | 1,171 KB over 14 files (was 1,599 KB) |
| jsPDF chunks | 409 KB + 29 KB + 4 KB, all lazy + HTTP 200, none in home HTML |
| `/about` content | Guilford attribution, non-affiliation, takedown section, issue link all present |
| Metadata | `og:image`, `og:url`, `twitter:card=summary_large_image` present |
| Crawl files | `/sitemap.xml` (2 URLs), `/robots.txt`, `/og-image.png` all 200 |
| Skip link | present in HTML and in the browser a11y tree |

## Remaining risks / not done

- **The rights question is still the owner's call** (see §1). Nothing here changes
  whether redistribution is permitted.
- The five Google font families (Inter, Poppins, Lora, Nunito, Source Sans 3) are
  still all preloaded; only some are needed per theme. A further win, but it is a
  behaviour-affecting change to the theme system, so it was left alone.
- Accessibility was improved, not audited: colour contrast was not measured.
- `og:image` uses `Helvetica, Arial, sans-serif`; on a machine without those fonts
  librsvg falls back, so re-run `tools/make-og-image.mjs` and eyeball the PNG if
  you change the copy.
