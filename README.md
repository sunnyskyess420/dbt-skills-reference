# DBT Skills Reference

A comprehensive DBT (Dialectical Behavior Therapy) skills reference app with **27 interactive fillable worksheets**, **progress dashboard**, **crisis resources**, **therapy session prep**, and **PWA install** — built for use during virtual group therapy sessions.

**Live demo:** Deploy your own for free on Vercel (see below).

## Quick start

### Prerequisites

- **Node.js 18+** — download from https://nodejs.org (LTS version)
- **Bun** (package manager) — install from https://bun.sh
- **VS Code** with recommended extensions: ESLint, Tailwind CSS IntelliSense

### Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/sunnyskyess420/dbt-skills-reference.git
   cd dbt-skills-reference
   ```

2. **Open in VS Code:**
   ```bash
   code .
   ```

3. **Install dependencies** (in the VS Code terminal):
   ```bash
   bun install
   ```

4. **Start the dev server:**
   ```bash
   bun run dev
   ```

5. **Open http://localhost:3000** in Chrome or Edge (for PWA install support)

### Deploy to Vercel (free, recommended)

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import the `dbt-skills-reference` repo
4. Click "Deploy" — Vercel auto-detects Next.js
5. Live in ~2 minutes at `https://dbt-skills-reference.vercel.app`

### Available scripts

| Command | What it does |
|---------|--------------|
| `bun run dev` | Start dev server on port 3000 |
| `bun run lint` | Run ESLint |
| `bun run build` | Build for production |
| `bun run start` | Start production server (after building) |

## Features

### 📚 Skills Reference Library

- **53 DBT skills** across 5 modules: General, Mindfulness, Interpersonal Effectiveness, Emotion Regulation, Distress Tolerance
- **Instant search** via Ctrl+K command palette (fuzzy search across names, acronyms, tags, descriptions)
- **Bookmarks** — save frequently-used skills (persisted to browser)
- **Skill of the Day** — daily rotating skill suggestion with "Mark as practiced" tracking
- **Recently viewed** — quick access to last 5 skills
- Each skill card includes: one-liner, full description, when to use, numbered steps, examples, tips & common pitfalls, tags, and **book cross-reference** (e.g., "Distress Tolerance Handout 6 / Worksheets 4, 4a, 4b")

### 📝 27 Interactive Worksheets

All worksheets **autosave to your browser** (localStorage) — no login, no server. Each has **PDF export**, **print support**, **pin/unpin**, and **sort** (Recent, Created, Type, Name A-Z).

#### General (2)
| # | Worksheet | What it does |
|---|-----------|-------------|
| 1 | **Chain Analysis** | Map a problem behavior link-by-link: prompting event → vulnerabilities → thoughts/feelings/sensations/actions → behavior → consequences |
| 2 | **Missing-Links Analysis** | When you knew a skill but didn't use it: find the specific gap and plan to close it |

#### Distress Tolerance (5)
| # | Worksheet | What it does |
|---|-----------|-------------|
| 3 | **Pros & Cons** | 4-quadrant analysis: pros/cons of acting on vs. resisting a crisis urge, short-term and long-term |
| 4 | **Radical Acceptance Practice** | Guided steps: what you're accepting, what makes it hard, half-smile, willing hands, turning the mind |
| 5 | **Crisis Survival Skills Tracker** | After a crisis, check off which of 8 skills you used + what worked |
| 6 | **Mindfulness of Current Thoughts** | Observe thoughts as passing mental events — not as truth, not as you |
| 7 | **Turning the Mind & Willingness** | Turn back to acceptance when you slip; choose willingness over willfulness |

#### Emotion Regulation (12)
| # | Worksheet | What it does |
|---|-----------|-------------|
| 8 | **Diary Card** | 7-day tracking with urges, actions, emotions (0–5 sliders), skills used, notes. Includes **weekly summary view** with heatmap, stats, and **skill suggestions engine** |
| 9 | **Check the Facts** | Does the emotion fit the situation? Walk through interpretations, threat assessment, intensity |
| 10 | **Opposite Action** | Identify emotion, action urge, whether it fits, and plan the opposite action (all the way, repeated) |
| 11 | **Values to Action Steps** | List values, pick one, set a goal, break into 3 action steps, commit to when, track progress |
| 12 | **Pleasant Events Diary** | 7-day tracker: one pleasant activity per day, rate emotion before/after, mindfulness check |
| 13 | **Emotion Diary** | Track ONE specific emotion across a week: triggers, intensity, interpretation, what worked |
| 14 | **Cope Ahead** | Rehearse a difficult situation: vivid imagination, skill rehearsal, relaxation pairing, coping plan |
| 15 | **Build Mastery** | Daily competence tracker (7-day tabs): activity, difficulty, accomplished |
| 16 | **PLEASE Tracker** | Weekly physical self-care (7-day tabs): illness, eating, substances, sleep, exercise |
| 17 | **Nightmare Protocol** | Rewrite recurring nightmares with a mastery ending, rehearsal plan, sleep hygiene |
| 18 | **Mindfulness of Current Emotions** | Observe an emotion as a wave — where in body, intensity, let it crest and pass |
| 19 | **Myths About Emotions** | Identify and challenge false beliefs about emotions; write replacement beliefs |

#### Interpersonal (7)
| # | Worksheet | What it does |
|---|-----------|-------------|
| 20 | **DEAR MAN Script** | Full interpersonal effectiveness script: Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate + GIVE and FAST + rehearsal |
| 21 | **The Dime Game** | Interactive decision tool: answer 10 Yes/No/Maybe questions, get a **live score** (-10 to +10) with recommended intensity |
| 22 | **Dialectics Practice** | Find the synthesis between two opposing positions in a relationship conflict |
| 23 | **Self-Validation Practice** | Work through all 6 levels of validation on yourself |
| 24 | **Clarifying Priorities** | Figure out if your priority is objectives, relationship, or self-respect before acting |
| 25 | **Troubleshooting IE** | When DEAR MAN/GIVE/FAST didn't work — diagnose what went wrong, plan differently |
| 26 | **Validating Others** | Practice the 6 levels of validation on another person |

#### Mindfulness (1)
| # | Worksheet | What it does |
|---|-----------|-------------|
| 27 | **Walking the Middle Path** | Identify two opposing positions, find what's true in each, articulate a synthesis |

### 📊 Progress Dashboard

Visual overview of your data across all worksheets:

- **4 stat cards**: total worksheets, diary cards, skills-practice days, action days
- **Urge trends bar chart** — weekly averages across recent diary cards
- **Emotion trends bar chart** — anger, sadness, shame, joy over time
- **Skills practiced breakdown** — progress bars for each skill module
- **Worksheet breakdown** — count of each worksheet type
- **Recent worksheets** — last 5 entries
- **Crisis resource auto-trigger** — gentle amber banner when high urges (3+) detected in recent diary cards

### 📋 Therapy Session Prep

Prepare for your next therapy session:

- **Pre-session checklist** (5 items with progress counter)
- **Recent worksheets to review** — auto-populates with last 3 diary cards and chain analyses
- **Session summary fields** (autosave): week summary, patterns, skills worked/struggled, wins, questions, topics
- **Print button** — clean one-page summary to bring to session

### 🆘 Crisis Resources

Calm, integrated crisis support page:

- **Canadian crisis hotlines** (click-to-call): 988, Kids Help Phone, Talk Suicide Canada, Assaulted Women's Helpline, Crisis Services Canada
- **5 grounding exercises** (expandable): 4-7-8 Breathing, 5-4-3-2-1 Grounding, Cold Water/TIPP, STOP Skill, Quick Body Scan
- **Personal Safety Plan** (autosave): warning signs, coping strategies, distractions, social/professional contacts, what helped before, reasons to keep going
- **Print support** for the safety plan
- **Auto-trigger from Dashboard** when high urges detected

### 🔄 Diary Card Comparison

Side-by-side comparison of two diary cards to spot trends:

- Pick any two weeks (defaults to oldest vs. newest)
- Stat cards with trend arrows for skills-practice days and action days
- Side-by-side tables for urges, actions, emotions (max/avg)
- Skills usage comparison
- **PDF export** of the comparison view

### 💾 Data Management

- **JSON backup/restore** — export all worksheets as a single JSON file, import on another machine
- **CSV export** — spreadsheet-friendly format for therapists (diary cards as daily rows + worksheet summaries)
- **PDF export** — formatted PDFs for any worksheet and comparison view
- **Auto-backup reminders** — configurable interval (default every 5 new entries)
- **Settings panel**:
  - Backup reminder interval slider (1–50)
  - Theme: System / Light / Dark
  - **6 color & font theme presets**: Default, Emerald Calm, Warm Sand, Ocean Blue, Rose Soft, Purple Sage
  - Export buttons (JSON + CSV)
  - Clear worksheets & bookmarks / Clear ALL data
  - Reset settings to defaults
  - PWA install button

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` (or `⌘K` on Mac) | Open skill search palette |
| `/` | Open search (alternative) |
| `?` | Open keyboard shortcuts help |
| `Esc` | Close any open dialog |
| `↑` `↓` | Navigate search results |
| `Enter` | Select highlighted result |

### 📱 PWA Installable

Install as a desktop app on Windows (Chrome/Edge):

- Opens in its own window (no browser chrome)
- Appears in Start menu, can be pinned to taskbar
- Browser-specific install instructions (Brave, Chrome, Edge, Firefox, Safari, iOS)

### 🎨 Other Features

- **Pin worksheets** — pin frequently-used worksheets to the top of the list
- **Sort worksheets** — by Recent, Created, Type, or Name (A-Z)
- **Dark mode** — system/light/dark theme picker
- **6 theme presets** — coordinated colors + font pairings
- **Responsive design** — works on desktop, tablet, and mobile
- **Print support** — clean print CSS for all worksheets and session prep
- **Service worker** — offline caching for PWA
- **All data stays in your browser** — no server, no login, no tracking

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 with shadcn/ui (New York style)
- **Icons:** lucide-react
- **PDF generation:** jsPDF
- **Theme:** next-themes
- **State:** React hooks + localStorage (no database required)
- **Database:** Prisma ORM with SQLite (available if you want to add server-side features)
- **Fonts:** Inter, Poppins, Lora, Nunito, Source Sans 3 (via next/font)

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, metadata, theme provider, PWA setup
│   ├── page.tsx                # Main 3-pane app shell + dashboard + session prep + crisis
│   └── globals.css             # Tailwind + print styles + theme variables
├── components/
│   ├── dbt/
│   │   ├── sidebar.tsx                 # Left nav (modules, bookmarks, worksheets, dashboard, session prep, crisis)
│   │   ├── skill-list.tsx              # Middle pane skill list
│   │   ├── skill-detail.tsx            # Right pane skill detail
│   │   ├── search-palette.tsx          # Ctrl+K command palette
│   │   ├── progress-dashboard.tsx      # Progress dashboard with charts
│   │   ├── session-prep.tsx            # Therapy session prep
│   │   ├── crisis-resources.tsx        # Crisis hotlines + grounding + safety plan
│   │   ├── skill-of-day.tsx            # Daily skill rotation
│   │   ├── help-dialog.tsx             # Keyboard shortcuts help
│   │   ├── settings-modal.tsx          # Settings (backup, theme, data, presets, install)
│   │   ├── install-button.tsx          # PWA install button
│   │   ├── kbd-shortcut.tsx            # Platform-aware shortcut display
│   │   ├── theme-preset-applier.tsx    # Applies saved theme preset
│   │   ├── theme-provider.tsx          # Dark mode wrapper
│   │   ├── theme-toggle.tsx            # Sun/moon toggle
│   │   └── worksheets/
│   │       ├── worksheet-list.tsx              # Worksheet list + create dropdown + sort + pin
│   │       ├── worksheet-detail.tsx            # Worksheet editor header
│   │       ├── chain-analysis-form.tsx
│   │       ├── pros-cons-form.tsx
│   │       ├── diary-card-form.tsx
│   │       ├── diary-card-summary.tsx          # Weekly summary + skill suggestions
│   │       ├── diary-comparison.tsx            # Side-by-side comparison modal
│   │       ├── walking-middle-path-form.tsx
│   │       ├── missing-links-form.tsx
│   │       ├── dear-man-script-form.tsx
│   │       ├── check-the-facts-form.tsx
│   │       ├── opposite-action-form.tsx
│   │       ├── radical-acceptance-form.tsx
│   │       ├── crisis-survival-tracker-form.tsx
│   │       ├── values-to-actions-form.tsx
│   │       ├── pleasant-events-diary-form.tsx
│   │       ├── emotion-diary-form.tsx
│   │       ├── dialectics-practice-form.tsx
│   │       ├── self-validation-form.tsx
│   │       ├── dime-game-form.tsx              # Interactive score calculator
│   │       ├── cope-ahead-form.tsx
│   │       ├── build-mastery-form.tsx
│   │       ├── please-tracker-form.tsx
│   │       ├── nightmare-protocol-form.tsx
│   │       ├── mindfulness-emotions-form.tsx
│   │       ├── mindfulness-thoughts-form.tsx
│   │       ├── turning-mind-willingness-form.tsx
│   │       ├── clarifying-priorities-form.tsx
│   │       ├── troubleshooting-ie-form.tsx
│   │       ├── validating-others-form.tsx
│   │       ├── myths-emotions-form.tsx
│   │       ├── form-primitives.tsx             # Reusable form components
│   │       └── section-heading.tsx             # Reusable section heading
│   └── ui/                             # shadcn/ui components
├── data/
│   └── skills.ts               # 53 skill entries (the DBT knowledge base)
├── hooks/
│   ├── use-worksheets.ts       # Worksheet CRUD hook
│   └── use-platform.ts         # Mac/Windows detection
└── lib/
    ├── worksheet-storage.ts    # Worksheet types, schemas, localStorage CRUD (27 types)
    ├── worksheet-export.ts     # JSON backup/restore
    ├── worksheet-csv.ts        # CSV export (diary cards + worksheet summaries)
    ├── worksheet-pdf.ts        # PDF generation (all 27 types + comparison)
    ├── diary-suggestions.ts    # Skill suggestions engine
    ├── backup-reminder.ts      # Auto-backup reminder logic
    ├── settings.ts             # App settings storage
    ├── theme-presets.ts        # 6 color/font theme presets
    ├── pinned-worksheets.ts    # Pin/unpin worksheet utilities
    └── utils.ts                # cn() helper

public/
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker
├── icon.svg, icon-192.png, icon-512.png, icon-maskable-512.png
├── apple-touch-icon.png, favicon.svg, favicon-32.png
└── robots.txt
```

## Content & legal

Skill content is **paraphrased educationally** from Marsha M. Linehan's *DBT Skills Training Handouts and Worksheets, Second Edition* (Guilford Press, 2014). The original handout text is **not reproduced** — instead, each skill card cross-references the printed book by handout/worksheet number so you can find the original.

Crisis hotline numbers are **Canadian** (988, Kids Help Phone, Talk Suicide Canada, etc.).

This app is **not a substitute for treatment**. It's a reference tool for people already in DBT skills training.

## Customizing

### Adding or editing skills

All skills live in `src/data/skills.ts`. Each skill is a TypeScript object. Edit, save, and the dev server hot-reloads.

### Adding a new worksheet type

1. Add the type to `WorksheetType` in `src/lib/worksheet-storage.ts`
2. Add metadata to `WORKSHEET_TYPES` array
3. Add a `blank___Data()` function
4. Add to `blankData()` switch
5. Create a form component in `src/components/dbt/worksheets/`
6. Import and render in `worksheet-detail.tsx`
7. Add a PDF generator in `src/lib/worksheet-pdf.ts`
8. Add icon to `ICONS` map in `worksheet-list.tsx`
9. Add to `WORKSHEET_GROUPS` in `worksheet-list.tsx`
10. Add to valid types in `worksheet-export.ts`
11. Add a button in `WorksheetsEmptyState` in `page.tsx`

### Changing theme presets

Edit `src/lib/theme-presets.ts`. Each preset has light/dark color sets and a font family.

### Regenerating PWA icons

Edit `public/icon.svg` and `public/icon-maskable.svg`, then run:

```bash
node scripts/generate-pwa-icons.mjs
```

## License

MIT — see [LICENSE](LICENSE).

The DBT skills content in `src/data/skills.ts` is paraphrased from copyrighted material (Guilford Press, 2014) for educational reference. Do not redistribute the content commercially.
