# Cheat sheet view

A single dense page that holds the whole toolkit: `?v=cheat-sheet`, one click
from the sidebar (**Cheat Sheet**) and from the top bar on any screen.

The goal is a reference you can keep open during group — or print and keep
beside you — without hunting through 53 skill pages.

## What it shows

Four sections plus the Wise Mind figure, in the order most groups teach them:

| Section | Blocks |
| --- | --- |
| Wise Mind | Reasonable / Emotion / Wise Mind Venn + one-line glosses |
| Mindfulness | WHAT skills (Observe, Describe, Participate), HOW skills (Nonjudgmentalness, One-Mindfulness, Effectiveness), Walking the Middle Path |
| Emotion Regulation | PLEASE, Check the Facts, Opposite Action, Accumulate positives (short + long term), Build Mastery, Cope Ahead, Mindfulness of current emotions |
| Distress Tolerance | TIPP, STOP, ACCEPTS, IMPROVE, Self-soothe (five senses), Radical Acceptance, Pros and Cons, Turning the Mind, Willingness |
| Interpersonal Effectiveness | DEAR MAN, GIVE, FAST, The Dime Game, Validation, Dialectics |

Each block is a button: it opens the full skill entry (steps, examples, tips,
pitfalls, book page). A **One-liners** switch adds each skill's one-line
description under its heading for a slightly fuller read.

## How the text is produced

Nothing is re-typed by hand. `src/lib/cheat-sheet.ts` builds every row from
the entries already in `src/data/skills.ts`:

1. `T — Temperature: cold water…` → letter `T` + `Temperature`.
2. `Observe: notice the experience (sensation…)` → label `Observe` + `notice
   the experience` (parenthetical asides dropped, cut at the first clause).
3. Anything else → first clause only.

Ordering and which skills appear is a small config array
(`CONFIG` in the same file) — add or reorder a block by editing one entry.
Unknown ids are skipped rather than throwing, so renaming a skill can never
take the page down.

This matters for two reasons:

- **Consistency** — the sheet can't drift from the library; both read one
  source.
- **Provenance** — the repo deliberately does not reproduce handout text from
  Linehan (2014) (see `NOTICE.md`). Deriving every row from the app's own
  paraphrased content keeps that promise. No third-party scan is bundled.

## Deliberate limits

- No new DBT wording, and no attempt to be a complete worksheet — it is an
  index that points at the full entries.
- Print CSS drops the sticky bar and sidebar; the blocks print as plain text
  with their page references.
- The screen layout is a CSS multi-column masonry: 1 column on mobile, 2 at
  `lg`, 3 at `xl`. Cards avoid breaking inside a column.

## Verification performed

- `npx tsc --noEmit` — clean.
- `npx next build` — compiles and prerenders.
- Manual run (`next dev`, `?v=cheat-sheet`):
  - page renders all five sections and the Wise Mind figure;
  - tapping **TIPP** navigates to `?v=skill&id=tipp` (full entry);
  - the **Cheat Sheet** top-bar button reaches the view from any screen;
  - sidebar item highlights correctly;
  - dense rows read as intended after trimming (`S Stop`, `T Take a step
    back`, `Observe notice the experience without labeling it`).

## Note on the scanned handout

A photographed group handout ("DBT CHEAT SHEET", hand-drawn border) was
supplied as a visual reference. It is not redistributable: no openly licensed
copy exists, and the repo's provenance policy already excludes reproducing
handout content. This view covers the same need with the app's own material.
If a user wants their personal copy in the app, the right shape is a private
"my own sheet" image upload stored locally — not a bundled scan.
