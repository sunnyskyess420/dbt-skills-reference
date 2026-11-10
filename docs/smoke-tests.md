# Smoke tests

A Playwright suite that drives the real app in a real browser: every view
loads, the page throws nothing, nothing overflows sideways, and the data that
matters survives a reload.

```bash
npx playwright install chromium   # first time only
npm run test:smoke
```

The suite starts its own dev server on port 3210 (`SMOKE_PORT` overrides it)
with dummy auth env vars — it never signs in, so no database is needed.

## Why these tests

Every bug that actually reached a user was a state bug, invisible to `tsc`:

| Bug | Caught by |
| --- | --- |
| Completed SMART goals silently deleted on save | "completed goals survive editing an active one" |
| Back button missing on desktop, or going to the wrong place | "skill opened from the list has a working back button", "cheat sheet block opens a skill…" |
| Reader zoom only applying to skill pages | "reader zoom applies and persists across reload" |
| A view rendering blank or throwing after a refactor | "every view renders, without page errors or sideways overflow" |
| Worksheet edits not persisting | "worksheet can be created, titled, and survives a reload" |

## What it covers

1. **Sidebar** — every section is present.
2. **All 8 views** — `all`, `worksheets`, `goals`, `smart-goals`,
   `cheat-sheet`, `dashboard`, `session-prep`, `crisis`: each renders its own
   content, raises no `pageerror`, and has no horizontal overflow.
3. **Skill navigation** — open from the list, back names and reaches the list.
4. **Worksheets** — create from the dropdown, set a title, reload, still there.
5. **SMART goals** — create, fill the SMART fields, log a check-in, reload,
   progress and the check-in note survive.
6. **Archive regression** — seed 5 active + 1 completed, edit an active goal,
   assert all six are still stored.
7. **Reader zoom** — cycles 100 → 112 → 125, persists across reload, and the
   shell actually renders at `zoom: 1.25`.
8. **Cheat sheet** — a block opens its skill and the labelled back returns to
   the sheet.

## Conventions

- `tests/smoke.spec.ts` is the only spec; add a new `test(...)` there rather
  than a new file so the serial context and welcome-dialog shim stay shared.
- The welcome dialog is suppressed with an init script
  (`dbt-skills:welcome-seen`), not by clicking it.
- Tests run serially (`workers: 1`) because they share one browser context and
  therefore one localStorage.
- Selectors come from accessible names and labels, so a rename in the UI shows
  up as a test failure rather than a silent pass.

## Known limits

- It runs against `next dev`; slower than `next build && next start` but the
  fastest signal while iterating.
- It does not cover signed-in sync, PDF/print output, or the 52 individual
  worksheet forms beyond the diary card created in test 4.
