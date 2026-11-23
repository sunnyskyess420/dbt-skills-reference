# Devin handoff — missing DBT worksheets

Written at the end of an AutoClaw session. Everything below is verified against
the working copy unless it says otherwise.

## 1. Where everything is

| Thing | Location |
| --- | --- |
| Working copy (git, branch `main`) | `C:\Users\alive\AppData\Roaming\AutoClaw-oversea-official\accounts\bb3b0ea94e74d0a029af8a691f0f83b530416f030bf68cac78ba3959fc7cc9a0\projects\Default\dbt-skills-reference` |
| GitHub | `github.com/sunnyskyess420/dbt-skills-reference` |
| Live app | `dbt-skills-reference.vercel.app` (auto-deploys on push to `main`) |
| Source book | `I:\DBT\Marsha M. Linehan - DBT Skills Training Handouts and Worksheets, Second Edition - The Guilford Press (2014).pdf` |

The app is Next.js 16 + TypeScript + Tailwind/shadcn. There is no database
migration to run: worksheets are user data (localStorage plus `/api/sync`), and
a new worksheet type needs no schema change.

**Reading the book.** 446 PDF pages. Its own contents index is PDF pages 13–24
and lists every handout and worksheet with printed page numbers. To dump text:

```powershell
python -c "from pypdf import PdfReader; r=PdfReader(r'I:\DBT\Marsha M. Linehan - DBT Skills Training Handouts and Worksheets, Second Edition - The Guilford Press (2014).pdf'); print(r.pages[276].extract_text(extraction_mode='layout'))"
```

`pypdf` is installed for the bundled Python. Layout mode matters: two-column
contents pages come out interleaved without it.

## 2. State at handoff

The catalog went from 52 to **65 worksheet types**. Added this session:

| id | Worksheet | Book page |
| --- | --- | --- |
| `values-priorities` | Values and Priorities List (ER Handout 18) | 253 |
| `pros-cons-skills` | Pros and Cons of Using Skills (General W1, module picker covers IE W1) | 27 |
| `reduce-vulnerability` | Steps for Reducing Vulnerability (ER W9) | 293 |
| `reality-acceptance` | Reality Acceptance Log (DT W8) | 391 |
| `mindfulness-core` | Core Mindfulness Practice (M W2, 2a, 2b, 2c) | 78 |
| `ie-skills-tracker` | IE Skills Tracker (IE W5) | 175 |
| `er-troubleshooting` | Troubleshooting Emotion Regulation (ER W16) | 312 |
| `values-diary` | Diary of Daily Actions on Values (ER W11b) | 300 |
| `emotion-functions` | What My Emotions Are Doing for Me (ER W2) | 275 |
| `addiction-crisis` | Skills When the Crisis Is Addiction (DT W13) | 403 |
| `paired-muscle` | Paired Muscle Relaxation (DT W4a) | 377 |
| `body-scan` | Body Scan Meditation (DT W6c) | 385 |
| `mindfulness-events` | Pleasant & Unpleasant Events Calendar (M W8 + W9, one form, type switch) | 101 |

Verification status:

- `npx tsc --noEmit` — clean after the final wave. **Trust this one.**
- `npm run build` — Next compiled and prerendered all routes cleanly once, at the
  `values-priorities` stage. The script then fails on Windows because its last
  step shells out to `cp` (`cp -r .next/static ...`). That is the npm script, not
  the code; it is fine on Vercel/Linux. Not fixed deliberately — out of scope.
- `npx eslint` on the new form files — **not completed**, the session was cut
  short. Pre-existing warnings exist in `diary-comparison.tsx` and
  `worksheet-detail.tsx` (react-hooks/set-state-in-effect); those two files were
  not touched.
- Playwright (`npm run test:forms`) — not run. It auto-generates one test per
  catalog entry by reading `WORKSHEET_TYPES` out of source, so it should now run
  65 tests with no edits.
- The 13 new forms have **not been clicked through in a browser**. Do that first.

## 3. How a worksheet is wired (7 touchpoints)

All paths relative to the repo root.

1. **`src/lib/worksheet-storage.ts`** — add the id to the `WorksheetType` union.
2. **Same file** — add an entry to `WORKSHEET_TYPES` with:
   `id`, `name`, `shortName`, `pages` (printed book page), `description`,
   `icon` (lucide name, must also exist in the ICONS map — see 7),
   `reference` (e.g. `"Emotion Regulation Handout 24 / Emotion Regulation Worksheet 16"`),
   `color` (a tailwind text colour pair from the module palette).
3. **Same file** — add `export function blank<Thing>Data() { ... }` returning every
   field with an empty default, and a `case "<id>": return blank<Thing>Data();` in
   the type→blank-data switch.
4. **Same file** — optional `WORKSHEET_TO_SKILL` entry, only if the skill id
   genuinely exists in `src/data/skills.ts`. A wrong id fails silently.
5. **`src/components/dbt/worksheets/<id>-form.tsx`** — the form. Props are
   `{ entry, onChange }`; export a named component (e.g. `ValuesDiaryForm`).
   Read `entry.data`, write with
   `onChange({ ...data, [field]: value })`.
6. **`src/components/dbt/worksheets/form-registry.tsx`** — add
   `"<id>": loadForm(() => import("./<id>-form").then((m) => m.<Pascal>Form)),`.
   The `Record<WorksheetType, ...>` type means the compiler catches a missing one.
7. **`src/components/dbt/worksheets/worksheet-list.tsx`** — add the id to the right
   array inside `WORKSHEET_GROUPS` (General / Distress Tolerance / Emotion
   Regulation / Interpersonal Effectiveness / Mindfulness), **and** make sure the
   icon name from step 2 is imported and listed in the `ICONS` map. A type missing
   from every group array silently disappears from the create menu.

Shared pieces worth reusing instead of copying:

- `week-grid.tsx` — `WeekTabs`, `blankWeek()`, `CheckRow`, `DayHeader`. This is the
  seven-day tab bar used by every weekly log. `WeekTabs` takes
  `entries`, `onUpdate(idx, field, value)` and a render function
  `(day, update, label) => ReactNode`.
- `form-primitives.tsx` — `TextField`, `TextAreaField`, `DateField`, `ScaleField`
  (0–5 tap buttons), `CheckboxGroup`, `RepeatList`.
- `section-heading.tsx` — `SectionHeading` with `number`, `title`, `subtitle`.

## 4. Still missing — 8 worksheet families

Book page numbers are printed pages. Order is the order they should be built.

| # | id to use | Worksheet | Page | Shape |
| --- | --- | --- | --- | --- |
| 1 | `abc-diary` | Putting ABC Skills Together Day by Day (ER W13) | 302 | Weekly grid: per day three one-line rows (accumulate a positive, build mastery, cope ahead) plus a "did I use it" tick. Long-term companion to `reduce-vulnerability`; do not merge them, the book separates the daily tick from the weekly review. |
| 2 | `er-pros-cons` | Pros and Cons of Changing Emotions (ER W1) | 271 | 2×2: pros/cons of changing this emotion vs pros/cons of keeping it. Reuse the grid styling from `pros-cons-skills-form.tsx`. |
| 3 | `ie-myths` | Challenging Myths in the Way of Obtaining Objectives (IE W2) | 168 | Myth → why it's a myth → challenge → replacement belief. `myths-emotions-form.tsx` is a near-exact template; copy it and swap the prompt list. |
| 4 | `mindfulness-pros-cons` | Pros and Cons of Practicing Mindfulness (M W1) | 77 | Same 2×2 as #2, mindfulness-specific prompts. |
| 5 | `effective-rethinking` | Effective Rethinking and Paired Relaxation (DT W4b) | 378 | Thought record (situation → automatic thought → challenge → balanced thought) with a relaxation round logged before and after. |
| 6 | `reinforce-nonaddictive` | Reinforcing Nonaddictive Behaviors (DT W16) | 408 | Log: non-addictive behaviour, how it got reinforced, by whom, what to add next. |
| 7 | `burning-bridges` | Burning Bridges and Building New Ones (DT W17) | 409 | Two columns: bridges burned (route back removed) and bridges built (new route), with a commitment line. |
| 8 | `alternate-rebellion` | Practicing Alternate Rebellion and Adaptive Denial (DT W18) | 410 | Rule challenged → how I broke it without hurting myself → cost/benefit → adaptiveness. |

Already covered, no work needed: IE Worksheet 1 (pros and cons of using IE
skills) — `pros-cons-skills` has a module picker for it. Lettered variants
(`2a`, `2b`, `11a`…) are folded into their parent form throughout; that is the
established convention, not a gap.

## 5. Verify

```powershell
cd <repo>
npx tsc --noEmit                  # must be silent
npx eslint src/components/dbt/worksheets src/lib/worksheet-storage.ts
npm run dev                       # then open http://localhost:3000/?v=worksheets
npx playwright install            # first time only
npm run test:forms                # one test per catalog entry
```

`npm run build` on Windows exits non-zero at the `cp` step even when the Next
build itself succeeded — read the log, not the exit code.

## 6. Gotchas that will bite

- **Line endings are CRLF.** Scripted `apply_patch`-style edits fail with a
  "content identical except line endings" message. Use Python with
  `io.open(..., newline="")` and match on `\r\n`, or edit by hand.
- **Never rename or remove an existing type id.** Saved entries, cloud sync rows
  and pins all key on the string.
- **Old saved rows may miss new fields.** Always read with `data.field ?? ""`, and
  treat `entries` as possibly absent.
- **Do not paste the book's worksheet wording verbatim.** Every existing form
  paraphrases: copyright, and the originals are print-width, not phone-width.
- **PDF/CSV export** (`worksheet-pdf.ts:417`, `worksheet-csv.ts:137`) switch on type
  with a generic fallback, so new types need no change — but print one new form and
  look at it, because a fallback that renders raw field names is ugly.

## 7. Tracking doc

`docs/worksheet-coverage.md` holds the full book-vs-app table. Its per-module
tables still mark the 13 new forms as `Missing` — the banner at the top is
authoritative until someone re-syncs the rows. Update it whenever a form lands.
