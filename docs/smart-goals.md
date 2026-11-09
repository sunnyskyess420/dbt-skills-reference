# SMART Goals

A structured goal section that sits beside **My Goals**. My Goals answers
*"what am I working toward?"* — SMART Goals answers the harder questions and
keeps the evidence:

| | My Goals | SMART Goals |
| --- | --- | --- |
| Shape | title, description, free-text target, steps | the five SMART fields, steps, review cadence |
| Measurement | step checkboxes only | named measure, start → now → target, percentage |
| Feasibility | — | 1–5 confidence, obstacles, supports |
| Motivation | free-text description | explicit "why" + value / life area |
| Time | free-text target string | real date input + weekly / each-session / monthly review |
| Record | last-edited stamp | dated check-ins with readings + notes, plus a completed archive |
| Slots | 3 active | 5 active, completed ones free a slot |

Both sections persist locally, sync for signed-in users, and export to
PDF / JSON. They are independent: nothing in My Goals changes, and neither
storage key reads the other.

## Where it lives

| Piece | File |
| --- | --- |
| Data model, persistence, progress math, SMART checks | `src/lib/smart-goals-storage.ts` |
| JSON backup / restore | `src/lib/smart-goals-export.ts` |
| PDF export (one goal, or all goals) | `src/lib/smart-goals-pdf.ts` |
| UI | `src/components/dbt/smart-goals.tsx` |
| Route + badge | `src/app/page.tsx` (`?v=smart-goals`) |
| Sidebar entry | `src/components/dbt/sidebar.tsx` |
| Cloud-sync merge | `src/lib/sync.ts` |

## Data model

`SmartGoal` (see `smart-goals-storage.ts`):

```
S  title, specific
M  measureName, measureUnit, baseline, target, current
A  confidence (0–5), obstacles[], supports[]
R  why, value
T  deadline (YYYY-MM-DD), reviewCadence ("weekly" | "session" | "monthly")
   steps[], skills[], checkIns[], status, completedAt
```

`checkIns[]` is the record: each entry stores `at` (ISO), `value`, `note` and
an optional re-rated `confidence`. Logging a check-in also advances
`current`, so the progress bar moves with the record instead of being a
separate number to maintain.

**Empty vs. filled.** A goal counts toward the badge and the 5-slot cap when
it has a title, a specific description, a measure name or at least one step.
Blank "Add a SMART goal" clicks never inflate the count.

**Statuses.** `active` → `paused` (kept, but not counted) → `done` (moves to
the completed archive, frees a slot, keeps every check-in). Reopen restores
it to `active`.

## Storage and sync

| Key | Contents |
| --- | --- |
| `dbt-skills:smart-goals` | `{ goals: SmartGoal[], savedAt }` |
| `dbt-skills:smart-goal-tombstones` | `{ id, deletedAt }[]` for deletions |

Both start with `dbt-skills:`, so `snapshotLocalState()` picks them up
automatically. `mergePayloads()` special-cases the goals key the same way it
already does for `dbt-skills:goals`: per-goal merge with the newest
`updatedAt` winning, then tombstoned ids dropped. Without that special case
the key would fall into the generic **server wins** bucket and a stale server
copy would wipe edits made on this device — the exact data-loss bug
documented in `goals-storage.ts`.

`saveSmartGoals()` dispatches both `dbt-skills:smart-goals-changed` (sidebar
badge) and `dbt-local-changed` (sync auto-push).

## UX flow

1. **Set up** — "Add a SMART goal" creates an expanded card with the SMART
   legend above it. The five letters each show a state: green check when
   satisfied, dashed when still missing, with the missing hint on hover.
2. **Plan** — steps (with progress), obstacle/support bullets, confidence
   rating, and "Find matching skills" (on-device keyword matching from
   `matchSkillsForGoal`, same engine as My Goals).
3. **Record** — the check-in composer stamps date, reading, optional
   confidence and a note; history lists newest first and can delete a single
   entry. "Mark complete" archives the goal with its completion date and
   final reading.
4. **Review** — a collapsed card shows SMART score, progress bar, deadline
   state (days left / overdue) and a "check-in due" flag when the cadence has
   lapsed. Print and PDF include the full SMART fields and the check-in log,
   so the record can be brought to session.

## Verification performed

- `npx tsc --noEmit` — clean.
- `npx next build` — compiles, all routes generate.
- Manual run (`next dev`, `?v=smart-goals`), exercised in a browser:
  - created a goal, filled all five SMART areas → 5/5 chips;
  - baseline 0 / target 3 / unit "per week" → "0 of 3 per week", then after a
    check-in reading 1 → "1 of 3 per week" at 33%, "last check-in Nov 9";
  - deadline `2026-12-01` → "23 days left";
  - added a step, logged a check-in with note → persisted to
    `dbt-skills:smart-goals` and survived a full page reload;
  - "Mark complete" → moved to the completed archive, freed the slot,
    showed "Completed Nov 9, 2026 · 1 of 3 per week · 1 check-in";
  - "Reopen" → back to active;
  - sidebar entry renders with its live count (1) and amber highlight.

## Not done / possible next steps

- Surface goals due for review in **Session Prep** (it currently pulls only
  diary cards and chain analyses).
- A dashboard card for measures over time — the check-in series is already
  stored, so this is a rendering job.
- CSV export (JSON + PDF exist).
