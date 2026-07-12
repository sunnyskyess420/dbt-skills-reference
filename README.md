# DBT Skills Reference

A fast, search-first DBT skills reference web app with fillable worksheets, built for use during virtual group therapy sessions.

## Quick start (in VS Code)

### Prerequisites

- **Node.js 18+** (download from https://nodejs.org — the LTS version is fine)
- **Bun** (faster package manager used by this project) — install from https://bun.sh
- **VS Code** with these recommended extensions:
  - ESLint (Microsoft)
  - Tailwind CSS IntelliSense (Tailwind Labs)
  - TypeScript Next.js syntax highlighting (if not built-in)

### Setup

1. **Unzip the project** to a folder on your computer, e.g. `C:\Users\YourName\Projects\dbt-skills`

2. **Open the folder in VS Code:**
   - File → Open Folder → select the `dbt-skills` folder

3. **Open the integrated terminal** in VS Code:
   - Terminal → New Terminal (or `` Ctrl+` ``)

4. **Install dependencies:**
   ```bash
   bun install
   ```

5. **Start the dev server:**
   ```bash
   bun run dev
   ```

6. **Open http://localhost:3000** in your browser (Chrome or Edge recommended for PWA install support)

### Available scripts

| Command | What it does |
|---------|--------------|
| `bun run dev` | Start the dev server on port 3000 |
| `bun run lint` | Run ESLint to check code quality |
| `bun run build` | Build for production |
| `bun run start` | Start the production server (after building) |
| `bun run db:push` | Push Prisma schema to the database (if you add DB features) |

## What's in this project

### Features

- **53 DBT skills** across 5 modules (General, Mindfulness, Interpersonal Effectiveness, Emotion Regulation, Distress Tolerance)
- **Instant search** via Ctrl+K command palette
- **5 fillable worksheet types** with autosave to localStorage:
  - Chain Analysis
  - Pros & Cons (Crisis Urges)
  - Diary Card (7-day, with weekly summary view)
  - Walking the Middle Path (Dialectics)
  - Missing-Links Analysis (Behavior Analysis)
- **Weekly summary view** for diary cards with skill suggestions engine
- **Side-by-side diary card comparison** to spot trends
- **JSON backup/restore** — export all worksheets, import on another machine
- **PDF export** — formatted PDFs for any worksheet and for comparison view
- **Auto-backup reminders** — configurable interval (default every 5 new entries)
- **Bookmarks** — save frequently-used skills
- **Dark mode** — system/light/dark theme picker
- **PWA installable** — install as a desktop app on Windows (Chrome/Edge)
- **Print support** — clean print CSS for all worksheets
- **Keyboard shortcuts** — Ctrl+K (search), ? (help), Esc (close)

### Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 with shadcn/ui components
- **Icons:** lucide-react
- **PDF generation:** jsPDF
- **Theme:** next-themes
- **State:** React hooks + localStorage (no database needed for worksheets)
- **Database:** Prisma ORM with SQLite (available if you want to add server-side features)

### Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata, theme provider, PWA links
│   ├── page.tsx            # Main 3-pane app shell (sidebar, list, detail)
│   └── globals.css         # Tailwind + print styles
├── components/
│   ├── dbt/
│   │   ├── sidebar.tsx              # Left nav (modules, bookmarks, worksheets)
│   │   ├── skill-list.tsx           # Middle pane skill list
│   │   ├── skill-detail.tsx         # Right pane skill detail view
│   │   ├── search-palette.tsx       # Ctrl+K command palette
│   │   ├── help-dialog.tsx          # Keyboard shortcuts help
│   │   ├── settings-modal.tsx       # Settings (backup, theme, data)
│   │   ├── install-button.tsx       # PWA install button
│   │   ├── kbd-shortcut.tsx         # Platform-aware keyboard shortcut display
│   │   ├── theme-provider.tsx       # Dark mode wrapper
│   │   ├── theme-toggle.tsx         # Sun/moon toggle
│   │   └── worksheets/
│   │       ├── worksheet-list.tsx           # List of saved worksheets
│   │       ├── worksheet-detail.tsx         # Worksheet editor header (title, save, PDF, delete)
│   │       ├── chain-analysis-form.tsx      # Chain Analysis form
│   │       ├── pros-cons-form.tsx           # Pros & Cons form
│   │       ├── diary-card-form.tsx          # Diary Card form (7-day tabs)
│   │       ├── diary-card-summary.tsx       # Weekly summary + skill suggestions
│   │       ├── diary-comparison.tsx         # Side-by-side comparison modal
│   │       ├── walking-middle-path-form.tsx # Walking the Middle Path form
│   │       ├── missing-links-form.tsx       # Missing-Links Analysis form
│   │       ├── form-primitives.tsx          # Reusable form components
│   │       └── section-heading.tsx          # Reusable section heading
│   └── ui/                  # shadcn/ui components (button, dialog, etc.)
├── data/
│   └── skills.ts            # 53 skill entries (the DBT knowledge base)
├── hooks/
│   ├── use-worksheets.ts    # Worksheet CRUD hook
│   └── use-platform.ts      # Mac/Windows detection
└── lib/
    ├── worksheet-storage.ts    # Worksheet localStorage CRUD + schemas
    ├── worksheet-export.ts     # JSON backup/restore
    ├── worksheet-pdf.ts        # PDF generation (all worksheet types + comparison)
    ├── diary-suggestions.ts    # Skill suggestions engine
    ├── backup-reminder.ts      # Auto-backup reminder logic
    ├── settings.ts             # App settings storage
    ├── db.ts                   # Prisma client (if you add DB features)
    └── utils.ts                # cn() helper for classnames

public/
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── icon.svg, icon-192.png, icon-512.png, icon-maskable-512.png  # PWA icons
├── apple-touch-icon.png    # iOS icon
├── favicon.svg, favicon-32.png
└── robots.txt

scripts/
└── generate-pwa-icons.mjs  # Regenerate PNG icons from SVGs (requires sharp)
```

## Content & legal

Skill content is paraphrased educationally from Marsha M. Linehan's *DBT Skills Training Handouts and Worksheets, Second Edition* (Guilford Press, 2014). The original handout text is not reproduced — instead, each skill card cross-references the printed book by handout/worksheet number so you can flip to the original.

This app is **not a substitute for treatment**. It's a reference tool for people already in DBT skills training.

## Customizing

### Adding or editing skills

All skills live in `src/data/skills.ts`. Each skill is a TypeScript object with fields like `name`, `acronym`, `oneLiner`, `description`, `whenToUse`, `steps`, `tips`, `examples`, `tags`, and `reference`. Edit the file, save, and the dev server hot-reloads.

### Changing the theme color

The app uses Tailwind CSS variables defined in `src/app/globals.css`. Edit the `--primary`, `--background`, `--foreground`, etc. values in the `:root` and `.dark` blocks.

### Regenerating PWA icons

If you change the icon design, edit `public/icon.svg` and `public/icon-maskable.svg`, then run:

```bash
node scripts/generate-pwa-icons.mjs
```

(This requires `sharp`, which is already in your dependencies.)

## Troubleshooting

**Port 3000 is already in use:** Edit `package.json` and change the `dev` script to use a different port, e.g. `next dev -p 3001`.

**`bun install` fails:** Make sure you have Bun installed (https://bun.sh). You can also use `npm install` instead, then `npm run dev`.

**PWA install button doesn't appear:** The button only shows in Chrome or Edge (browsers that support PWA install). Firefox and Safari desktop don't support installable PWAs. Make sure you're accessing the site over HTTPS or localhost.

**Search shortcut shows ⌘K instead of Ctrl K:** The shortcut display auto-detects your platform. If you're on Windows and still seeing ⌘K, hard-refresh the page (Ctrl+Shift+R) to clear the cached React state.

## License

This project is for personal use. The DBT skills content is paraphrased from copyrighted material (Guilford Press, 2014) for educational reference. Do not redistribute the content commercially.
