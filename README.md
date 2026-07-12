# DBT Skills Reference

A fast, search-first DBT (Dialectical Behavior Therapy) skills reference web app with **16 interactive fillable worksheets**, a **progress dashboard**, and **therapy session prep** — built for use during virtual group therapy sessions.

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
- **Recently viewed** — quick access to last 5 skills
- Each skill card includes: one-liner, full description, when to use, numbered steps, examples, tips & common pitfalls, tags, and **book cross-reference** (e.g., "Distress Tolerance Handout 6 / Worksheets 4, 4a, 4b")

### 📝 16 Interactive Worksheets

All worksheets **autosave to your browser** (localStorage) — no login, no server. Each has **PDF export** and **print support**.

| # | Worksheet | Module | What it does |
|---|-----------|--------|-------------|
| 1 | **Chain Analysis** | General | Map a problem behavior link-by-link: prompting event → vulnerabilities → thoughts/feelings/sensations/actions → behavior → consequences. Find the links you can change. |
| 2 | **Missing-Links Analysis** | General | When you knew a skill but didn't use it: find the specific gap (forgetting, not-noticing, not-believing, fear, etc.) and plan to close it. |
| 3 | **Pros & Cons** | Distress Tolerance | 4-quadrant analysis: pros/cons of acting on vs. resisting a crisis urge, short-term and long-term. |
| 4 | **Radical Acceptance Practice** | Distress Tolerance | Guided steps: what you're accepting, what makes it hard, willfulness, half-smile, willing hands, turning the mind. |
| 5 | **Crisis Survival Skills Tracker** | Distress Tolerance | After a crisis, check off which of 8 skills you used (STOP, TIPP, Pros/Cons, Distract, Self-Soothe, IMPROVE, Radical Acceptance, Turning the Mind) + what worked. |
| 6 | **Diary Card** | Emotion Regulation | 7-day tracking (Mon–Sun tabs) with urges, actions, emotions (0–5 sliders), skills used, and notes. Includes **weekly summary view** with heatmap, stats, and **skill suggestions engine** that recommends skills based on which emotions/urges spiked. |
| 7 | **Check the Facts** | Emotion Regulation | Walk through: what happened, your interpretation, alternative interpretations, threat assessment, does the intensity fit? |
| 8 | **Opposite Action** | Emotion Regulation | Identify emotion, action urge, whether it fits the facts, and plan the opposite action (all the way, repeated, with body language). |
| 9 | **Values to Action Steps** | Emotion Regulation | List values, pick one, set a goal, break into 3 concrete action steps, commit to when, track progress. |
| 10 | **Pleasant Events Diary** | Emotion Regulation | 7-day tracker: one pleasant activity per day, rate emotion before/after, mindfulness check. |
| 11 | **Emotion Diary** | Emotion Regulation | Track ONE specific emotion across a week: triggers, intensity, interpretation, what you did, what worked. |
| 12 | **DEAR MAN Script** | Interpersonal | Full interpersonal effectiveness script: Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate + GIVE and FAST + rehearsal. |
| 13 | **The Dime Game** | Interpersonal | Interactive decision tool: answer 10 Yes/No/Maybe questions, get a **live score** (-10 to +10) with recommended intensity level for asking or saying no. |
| 14 | **Dialectics Practice** | Interpersonal | Find the synthesis between two opposing positions in a specific relationship conflict. |
| 15 | **Self-Validation Practice** | Interpersonal | Work through all 6 levels of validation on yourself. |
| 16 | **Walking the Middle Path** | Mindfulness | Identify two opposing positions, find what's true in each, articulate a synthesis. |

### 📊 Progress Dashboard

Visual overview of your data across all worksheets:

- **4 stat cards**: total worksheets, diary cards, skills-practice days, action days
- **Urge trends bar chart** — weekly averages of self-harm, suicide, substance urges across recent diary cards
- **Emotion trends bar chart** — anger, sadness, shame, joy over time
- **Skills practiced breakdown** — progress bars for each skill module
- **Worksheet breakdown** — count of each worksheet type
- **Recent worksheets** — last 5 entries

### 📋 Therapy Session Prep

Prepare for your next therapy session:

- **Pre-session checklist** (5 items with progress counter)
- **Recent worksheets to review** — auto-populates with last 3 diary cards and chain analyses
- **Session summary fields** (autosave): week summary, patterns noticed, skills that worked, skills struggled with, wins this week, questions for therapist, topics to discuss
- **Print button** — clean one-page summary to bring to session

### 🔄 Diary Card Comparison

Side-by-side comparison of two diary cards to spot trends:

- Pick any two weeks (defaults to oldest vs. newest)
- Stat cards with trend arrows (▲▼) for skills-practice days and action days
- Side-by-side tables for urges, actions, emotions (max/avg for both weeks)
- Skills usage comparison
- **PDF export** of the comparison view
- Color-coded trend icons (green = favorable, red = unfavorable)

### 💾 Data Management

- **JSON backup/restore** — export all worksheets as a single JSON file, import on another machine
- **PDF export** — formatted PDFs for any worksheet and for comparison view (using jsPDF)
- **Auto-backup reminders** — configurable interval (default every 5 new entries), with dismissible banner
- **Settings panel** (gear icon):
  - Backup reminder interval slider (1–50)
  - Theme: System / Light / Dark
  - **Color & font theme presets** — 6 coordinated palettes:
    - Default (neutral slate, Inter)
    - Emerald Calm (soft green, Poppins)
    - Warm Sand (warm beige, Lora serif)
    - Ocean Blue (deep blue, Inter)
    - Rose Soft (gentle rose, Nunito)
    - Purple Sage (muted purple, Source Sans 3)
  - Clear worksheets & bookmarks (keeps settings)
  - Clear ALL data (resets everything)
  - Reset settings to defaults

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
- Right-click taskbar icon for app shortcuts (Search skills, Worksheets)
- Install button appears in Settings and Help dialog
- Browser-specific instructions shown for Brave, Firefox, Safari, iOS

### 🎨 Other Features

- **Dark mode** — system/light/dark theme picker (syncs with OS)
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
│   ├── page.tsx                # Main 3-pane app shell + dashboard + session prep
│   └── globals.css             # Tailwind + print styles + theme variables
├── components/
│   ├── dbt/
│   │   ├── sidebar.tsx                 # Left nav (modules, bookmarks, worksheets, dashboard, session prep)
│   │   ├── skill-list.tsx              # Middle pane skill list
│   │   ├── skill-detail.tsx            # Right pane skill detail
│   │   ├── search-palette.tsx          # Ctrl+K command palette
│   │   ├── progress-dashboard.tsx      # Progress dashboard with charts
│   │   ├── session-prep.tsx            # Therapy session prep
│   │   ├── help-dialog.tsx             # Keyboard shortcuts help
│   │   ├── settings-modal.tsx          # Settings (backup, theme, data, presets)
│   │   ├── install-button.tsx          # PWA install button
│   │   ├── kbd-shortcut.tsx            # Platform-aware shortcut display
│   │   ├── theme-preset-applier.tsx    # Applies saved theme preset
│   │   ├── theme-provider.tsx          # Dark mode wrapper
│   │   ├── theme-toggle.tsx            # Sun/moon toggle
│   │   └── worksheets/
│   │       ├── worksheet-list.tsx              # Worksheet list + create dropdown
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
│   │       ├── form-primitives.tsx             # Reusable form components
│   │       └── section-heading.tsx             # Reusable section heading
│   └── ui/                             # shadcn/ui components
├── data/
│   └── skills.ts               # 53 skill entries (the DBT knowledge base)
├── hooks/
│   ├── use-worksheets.ts       # Worksheet CRUD hook
│   └── use-platform.ts         # Mac/Windows detection
└── lib/
    ├── worksheet-storage.ts    # Worksheet types, schemas, localStorage CRUD
    ├── worksheet-export.ts     # JSON backup/restore
    ├── worksheet-pdf.ts        # PDF generation (all 16 types + comparison)
    ├── diary-suggestions.ts    # Skill suggestions engine
    ├── backup-reminder.ts      # Auto-backup reminder logic
    ├── settings.ts             # App settings storage
    ├── theme-presets.ts        # 6 color/font theme presets
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
8. Add to `WORKSHEET_GROUPS` in `worksheet-list.tsx`
9. Add to valid types in `worksheet-export.ts`
10. Add a button in `WorksheetsEmptyState` in `page.tsx`

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
