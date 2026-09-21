# Search by Page Number

Jump straight to any page of the printed DBT workbook by typing its number in
the search palette. This adds a third way to look things up — by **page number**
— alongside the existing search by **name** and by **content**.

| Query you type | What you get |
| --- | --- |
| `tipp`, `dear man` | Skills / worksheets matching that text (unchanged) |
| `174` | Everything on printed page 174, ready to open |
| `p. 174`, `page 174`, `pp. 20-21`, `20 to 21` | Ranged page lookups |
| `worksheet 9a`, `handout 5` | Content that maps to that handout/worksheet number |

## Why this works at all

The app already stored a printed page number for every skill and worksheet
template (`Skill.pages`, `WorksheetTypeMeta.pages`), authored as strings such as
`"p. 9"`, `"pp. 20-21"`, `"p. 53+"`. Nothing surfaced them as a *lookup key*.
The index turns those strings into a page → content map.

Coverage from the current data: **104 page references across 105 distinct pages
(pp. 6–397)** — 53 skills + 51 worksheet templates.

## Files changed

| File | Change |
| --- | --- |
| `src/lib/page-index.ts` | **New.** Dependency-free index: parse page strings, build the page map, resolve page queries, format ranges, resolve handout/worksheet references. |
| `src/components/dbt/search-palette.tsx` | Wires the index into search: numeric queries become a focused page result set; new **Book pages** tab; page numbers shown on every result row. |
| `src/components/dbt/help-dialog.tsx` | Documents the new page / handout search shortcuts. |
| `docs/verification/verify-page-index.ts` | **New.** Node test harness for the index logic (36 assertions). |
| `docs/verification/verify-worksheet-store.ts` | **New.** Node test harness for the worksheet persistence trail (17 assertions). |
| `tsconfig.json` | Excludes `scripts/` (Node-run harnesses use `.ts` import specifiers). |

## How it works

```
query "174"
   │
   ├─ parsePageQuery("174")  →  { start: 174, end: 174, label: "p. 174" }
   │
   ├─ pageIndex.lookupRange(174, 174)
   │     ├─ DEAR MAN                (skill,     pp. 174-175)
   │     ├─ FAST                    (skill,     pp. 174-175)
   │     ├─ GIVE                    (skill,     pp. 174-175)
   │     └─ DEAR MAN Script         (worksheet, p. 174)
   │
   └─ rendered as the "p. 174 — 4 entries" group; Enter opens the first hit
```

Design decisions worth knowing:

- **A bare number is always a page lookup.** `42` means page 42, not "text
  containing 42". Because the page list is pre-narrowed, the palette's text
  filter is bypassed for page queries — otherwise a range like `p. 40–45`
  would be dropped for the query `42` (42 is not a substring of "40 45").
- **Open-ended refs are anchored.** `"p. 230+"` matches page 230 in a lookup; it
  is *not* fanned out across every later page (that would put the same
  chapter-range item on nearly every result list).
- **Empty pages still help.** If a page has no indexed content (e.g. `42`), the
  palette shows the nearest indexed pages ("Nothing on p. 42 · nearest indexed
  content") so the user is never left with a dead end.
- **Two kinds of hit.** A *skill* hit opens the skill detail; a *worksheet* hit
  opens that worksheet (creating a draft on first edit, exactly like the
  existing "Create new" flow).
- **En dash and hyphen both parse.** Skills store `"pp. 174–175"` (en dash) and
  worksheets `"p. 174"` — the parser accepts `-`, `–`, `—`.

## How to use it

1. Open the app and press **Ctrl+K** (⌘K on Mac) or click the search box.
2. Type a page number — e.g. `174`.
3. The top group lists what is on that page. Press **Enter** to open the first
   hit, or click any row.
4. Browse the full index anytime via the **Book pages** tab (104 entries).

## How to change it

- **Page numbers / content:** edit `pages` in `src/data/skills.ts` (skills) or
  `src/lib/worksheet-storage.ts` (worksheet templates). The index rebuilds from
  that data automatically — no other file needs to change.
- **New page-string format:** extend `PAGE_REF_RE` / `parsePageQuery` in
  `src/lib/page-index.ts`.
- **Result row look:** `renderPageHit()` in
  `src/components/dbt/search-palette.tsx`.
- **Run the tests:** `node --experimental-strip-types docs/verification/verify-page-index.ts`
  and `node --experimental-strip-types docs/verification/verify-worksheet-store.ts`.
  (Placed under `docs/` because this repo's `.gitignore` keeps `/scripts/` local-only.)

## Verification (this change)

All run against the real dataset on Node v22.22:

- `npx tsc --noEmit` → clean.
- `npx next build` → compiled successfully; `/` prerendered as static.
- `docs/verification/verify-page-index.ts` → **36/36 passed** (parse, ranges, lookup,
  open-ended anchoring, nearest-page fallback, reference search).
- `docs/verification/verify-worksheet-store.ts` → **17/17 passed** (draft → save on edit →
  read → update → delete tombstone against key `dbt-skills:worksheets`).
- Live app at `http://localhost:3100` (production build):
  - typed `174` → group **"p. 174 — 4 entries"**: DEAR MAN / FAST / GIVE (skills)
    + DEAR MAN Script (worksheet).
  - selecting the worksheet opened its detail, showing
    *"Book reference: Interpersonal Effectiveness Handout 5a / Worksheet 4 · p. 174"*.
  - typed `42` (unindexed) → **"Nothing on p. 42 · nearest indexed content"**
    with Wise Mind, Wise Mind Practice, Chain Analysis.
  - tabs read `All 105 · Skills 53 · Worksheets 52 · Book pages 104`.

## Risks / notes

- Page numbers are from the **2nd edition** (Linehan, 2014) of *DBT Skills
  Training Handouts and Worksheets*; they do not match the 1st edition.
- `p. 53+`-style refs are treated as a single anchor page in lookups (see above).
- The side-panel browser used for the live check has an ephemeral storage
  partition, so a worksheet created there did not survive a full page reload
  *in that browser*; persistence itself is verified deterministically by
  `docs/verification/verify-worksheet-store.ts` and is unchanged by this feature.
- Nothing was pushed. This is a local change set + patch file.
