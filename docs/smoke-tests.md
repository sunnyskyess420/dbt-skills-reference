# Smoke tests

Playwright suites that drive the real app in a real browser: every view loads,
every worksheet form opens, the page throws nothing, nothing overflows
sideways, and the data that matters survives a reload.

```bash
npx playwright install chromium   # first time only

npm run test:smoke   # 13 tests, ~1 min  — views, navigation, persistence, PDF, print, sync guard
npm run test:forms   # 52 tests, ~4 min  — every worksheet type
npm run test:all     # everything
```

Each run starts its own dev server on port 3210 (`SMOKE_PORT` overrides it)
with dummy auth env vars. It never signs in, so no database is required.

## Why these tests

Every bug that reached a user in this round was a state bug, invisible to `tsc`:

| Bug | Caught by |
| --- | --- |
| Completed SMART goals silently deleted on save | "completed goals survive editing an active one" |
| Back button missing on desktop, or going to the wrong place | "skill opened from the list…", "cheat sheet block opens a skill…" |
| Reader zoom only applying to skill pages | "reader zoom applies and persists across reload" |
| A view rendering blank or throwing after a refactor | "every view renders, without page errors or sideways overflow" |
| A worksheet form white-screening | `test:forms`, one test per type |
| A broken PDF export or print layout | `tests/pdf-print.spec.ts` |
| Sync API leaking data without a session | `tests/sync-guard.spec.ts` |

## What it covers

**`tests/smoke.spec.ts`** (8)
1. Sidebar exposes every section.
2. All 8 views render with no `pageerror` and no horizontal overflow.
3. Skill opened from a list: back is labelled and returns to the list.
4. Worksheet created from the dropdown, titled, survives a reload.
5. SMART goal created with a check-in, survives a reload.
6. Archive regression: 5 active + 1 completed, edit an active goal, all six persist.
7. Reader zoom cycles 100 → 112 → 125, persists, shell renders at `zoom: 1.25`.
8. Cheat sheet block opens its skill and the labelled back returns.

**`tests/pdf-print.spec.ts`** (3)
- SMART goals PDF downloads a real file (`%PDF-` header, > 2 KB).
- Worksheet PDF does the same through the other generator.
- Print media hides the sidebar and action bar, and keeps the content.

**`tests/sync-guard.spec.ts`** (2)
- `GET`/`POST /api/sync` return 401 without a session, and echo no state.
- Guest data stays in localStorage and survives a reload.

**`tests/forms.spec.ts`** (52, tagged `@forms`)
- Every worksheet type in the catalog: opened through the UI, title filled,
  no `pageerror`, title still there after a reload. One test per type so a
  failing form is named, not buried in a loop.

## Conventions

- Selectors come from accessible names and labels, so a rename shows up as a
  failure rather than a silent pass.
- The welcome dialog is suppressed with an init script
  (`dbt-skills:welcome-seen`), not by clicking it.
- Tests run serially (`workers: 1`): they share one context and one localStorage.
- The worksheet catalog is read from `src/lib/worksheet-storage.ts` at test
  time, so a new worksheet type is covered without touching the spec.

## Known limits

- **Signed-in sync is only covered at the boundary.** A real end-to-end sync
  test needs a database and a session; see below.
- Print assertions are structural (chrome hidden, content present), not visual.
- Forms are checked for render + title persistence, not per-field behaviour —
  52 bespoke layouts would need per-form fixtures.

## Adding end-to-end sync

The app uses NextAuth credentials + Prisma. To test a real push/pull you need:

1. a SQLite schema (`prisma/schema.test.prisma`, provider `sqlite`) and
   `DATABASE_URL=file:./smoke.db`;
2. `prisma db push` + `prisma generate --schema` against that file before the
   run (this rewrites the generated client, so re-run the default generate
   afterwards);
3. a sign-up through the credentials provider, then create a goal, wait for the
   debounced push, clear localStorage, reload, and assert the goal comes back.

That is a separate project/script rather than part of the default suite.
