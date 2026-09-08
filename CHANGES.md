# UX Improvements — Changelog

Three user-friendliness upgrades for the DBT virtual therapy group context.
**No DBT content, worksheet fields, or skill text was changed** — these are
navigation and flow changes only.

## 1. Guest-first first-run experience

**Problem:** New members were greeted with a sign-in dialog that led with
"Sign In / Create Account" tabs; "Continue as guest" was the last, quietest
option. An account decision blocked access to the app.

**Changes**

- `src/components/dbt/auth-dialog.tsx`
  - New `welcomeMode` prop. In welcome mode the dialog now leads with a
    primary **"Get started"** (guest) button; sign-in is a secondary
    "Sign in or create an account" button that reveals the account tabs
    on request, with a "Back — continue as guest" escape hatch.
  - Rewrote the welcome copy to be shorter (no more mid-sentence
    truncation on small screens) and to frame sign-in as data safety:
    "Guest data stays on this device. Sign in anytime from the sidebar to
    back it up and sync across devices."
- `src/app/page.tsx`
  - Passes `welcomeMode={welcomeOpen && !authOpen}` — the first-visit
    welcome is guest-first; the sidebar sign-in entry point keeps the
    classic account-first tabs.
- `src/components/dbt/sidebar.tsx` + `src/app/page.tsx` — **deferred
  sign-in nudge**: once a guest has saved 3+ worksheets, a small amber
  card appears in the sidebar footer ("N worksheets saved on this device.
  Sign in to back them up"). One-time, dismissible (flag in localStorage:
  `dbt-skills:sync-nudge-dismissed`).
- `src/app/page.tsx` — keyboard-shortcuts header button is now hidden on
  small screens (`hidden sm:inline-flex`) to make room for the crisis
  button; keyboard users can still press `?`.

## 2. One-tap access to Crisis Resources

**Problem:** Crisis Resources was the last item in the nav drawer — too
many taps for the most time-sensitive page.

**Changes**

- `src/app/page.tsx` — added a persistent **lifebuoy icon button** in the
  top header (amber-tinted, `aria-label="Crisis Resources"`), visible on
  every screen at every viewport size. One tap navigates to Crisis
  Resources from anywhere, including mid-worksheet.
- The dashboard's high-urge auto-trigger banner is unchanged.

## 3. Worksheet-aware search

**Problem:** The palette indexed only the 53 skills while the homepage
promised "Search skills and worksheets…" — so "find my DEAR MAN worksheet"
failed silently.

**Changes**

- `src/components/dbt/search-palette.tsx` (rewritten)
  - Three result groups:
    - **Your worksheets** — the user's saved entries, most recently
      updated first (top 6), shown even with an empty query so the
      palette doubles as a "jump back in" list. Shows title, type, and
      relative updated time.
    - **Start a new worksheet** — all 52 worksheet types, searchable by
      name/short name/description, each with a "create new" action.
      Appears once the user types (keeps the empty-query view clean).
    - Skills — unchanged, grouped by module.
  - Footer now reads "53 skills · 52 worksheet types indexed".
  - sr-only dialog title/description updated to match.
  - Technical note: the query mirror is bound to `CommandInput`'s
    `value`/`onValueChange` (the root cmdk `onValueChange` tracks the
    highlighted item, not the search text — easy to get wrong).
- `src/app/page.tsx` — palette now receives `worksheetEntries`,
  `onSelectWorksheetEntry`, and `onCreateWorksheet`.
- `src/components/dbt/skill-list.tsx` — header button label corrected to
  "Search skills & worksheets…".

## Files touched

| File | Change |
|---|---|
| `src/app/page.tsx` | Crisis header button, welcomeMode wiring, search props, guest nudge state |
| `src/components/dbt/auth-dialog.tsx` | Guest-first welcome mode + copy |
| `src/components/dbt/search-palette.tsx` | Worksheet types + saved entries in search |
| `src/components/dbt/sidebar.tsx` | Dismissible guest sync nudge card |
| `src/components/dbt/skill-list.tsx` | Search label fix |

## Verification

- `npx prisma generate && npx next build` — production build succeeds.
- `npx tsc --noEmit` — no type errors.
- `npx eslint` on the five changed files — clean.
- Manually smoke-tested on a local dev server (desktop + mobile widths):
  guest-first welcome, crisis button navigation, search groups, and the
  search → create worksheet loop.

## How to run

```bash
npm install        # or bun install
npm run dev        # dev server on http://localhost:3000
npm run build      # production build (package.json's build script uses cp; on Windows run: npx prisma generate && npx next build)
```

---

# Round 2 — daily-use refinements

## A. Tap-based 0–5 ratings (all worksheets)

- `src/components/dbt/worksheets/form-primitives.tsx`: `ScaleField` now
  renders six segmented 0–5 buttons instead of a slider — faster and more
  accurate on touch screens, with radiogroup semantics for keyboard and
  screen-reader users. Used consistently by all 23 worksheets that take
  ratings (diary card, TIPP, pros & cons, emotion diaries, etc.).
- `src/components/dbt/worksheets/diary-card-form.tsx`: added the hint
  "Tap a number to rate it. Untouched ratings count as 0 (none)." so the
  0-default is explicit.

## B. Fixed day-tab "filled" detection (diary card)

- A day tab previously only looked filled if a date or notes were
  entered — filling all 12 ratings alone left the tab looking empty.
  Any non-zero rating or skills checkbox now marks the tab.

## C. Persistent save indicator + draft clarity

- `src/components/dbt/worksheets/worksheet-detail.tsx`: the 1.2s "Saved"
  flash is now a persistent "Saved · just now / 2m ago / …" status that
  flashes emerald on each autosave and refreshes itself every 30s.
- Never-edited entries show "Draft — saves automatically once you start
  typing." so a blank worksheet no longer feels like it silently vanished.
- `src/lib/relative-time.ts` (new): shared relative-time formatter used by
  the worksheet list, search palette, and the save indicator.

## D. Resume instead of duplicate

- `src/app/page.tsx` + `src/components/dbt/skill-detail.tsx`:
  "Practice with Worksheet" now opens your most recent worksheet of that
  type (label switches to "Open your worksheet") instead of always
  creating a new one, with a "start a blank copy" link when you truly
  want a fresh copy. Homepage and search "new worksheet" actions still
  always create new.

## E. Skill of the Day above the fold

- Moved directly under the hero on the home screen so it's visible
  without scrolling on phones.
