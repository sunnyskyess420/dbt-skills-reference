"use client";

import * as React from "react";
import { SKILLS, type Skill, type Module } from "@/data/skills";
import { Sidebar } from "@/components/dbt/sidebar";
import { SkillList } from "@/components/dbt/skill-list";
import { SkillDetail } from "@/components/dbt/skill-detail";
import { SearchPalette } from "@/components/dbt/search-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { WorksheetList } from "@/components/dbt/worksheets/worksheet-list";
import { WorksheetDetail } from "@/components/dbt/worksheets/worksheet-detail";
import { DiaryComparison } from "@/components/dbt/worksheets/diary-comparison";
import { SettingsModal } from "@/components/dbt/settings-modal";
import { HelpDialog } from "@/components/dbt/help-dialog";
import { useWorksheets } from "@/hooks/use-worksheets";
import { type WorksheetType, type WorksheetEntry } from "@/lib/worksheet-storage";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, FileText, Link2, Scale, CalendarRange, GitMerge, Unplug, Settings as SettingsIcon, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY_BOOKMARKS = "dbt-skills:bookmarks";
const STORAGE_KEY_RECENT = "dbt-skills:recent";

type ViewMode = Module | "all" | "bookmarks" | "worksheets";

export default function Home() {
  const [selectedModule, setSelectedModule] = React.useState<ViewMode>("all");
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null);
  const [selectedWorksheetId, setSelectedWorksheetId] = React.useState<string | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false); // mobile sidebar
  const [compareOpen, setCompareOpen] = React.useState(false); // diary card comparison modal
  const [settingsOpen, setSettingsOpen] = React.useState(false); // settings modal
  const [helpOpen, setHelpOpen] = React.useState(false); // keyboard shortcut help modal

  // Bookmarks persisted to localStorage
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());

  // Worksheets
  const { entries: worksheetEntries, createEntry, updateEntry, deleteEntry, refresh: refreshWorksheets } = useWorksheets();

  const selectedWorksheet = React.useMemo(
    () => worksheetEntries.find((e) => e.id === selectedWorksheetId) ?? null,
    [worksheetEntries, selectedWorksheetId]
  );

  // Load bookmarks from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (stored) {
        setBookmarks(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Reload bookmarks from localStorage (used after settings "clear data")
  const reloadBookmarks = React.useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      setBookmarks(stored ? new Set(JSON.parse(stored)) : new Set());
    } catch {
      setBookmarks(new Set());
    }
  }, []);

  // Persist bookmarks
  const toggleBookmark = React.useCallback((skillId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      try {
        localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(Array.from(next)));
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  // Track recently viewed skills
  const [recent, setRecent] = React.useState<string[]>([]);
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECENT);
      if (stored) {
        setRecent(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Reload recent list from localStorage (used after settings "clear data")
  const reloadRecent = React.useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECENT);
      setRecent(stored ? JSON.parse(stored) : []);
    } catch {
      setRecent([]);
    }
  }, []);

  const handleSelectSkill = React.useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setSelectedWorksheetId(null); // skills and worksheets are mutually exclusive
    setRecent((prev) => {
      const next = [skill.id, ...prev.filter((id) => id !== skill.id)].slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);

  const handleSelectWorksheet = React.useCallback((entry: WorksheetEntry) => {
    setSelectedWorksheetId(entry.id);
    setSelectedSkill(null);
  }, []);

  const handleCreateWorksheet = React.useCallback(
    (type: WorksheetType) => {
      const entry = createEntry(type);
      setSelectedWorksheetId(entry.id);
      setSelectedSkill(null);
    },
    [createEntry]
  );

  // When selecting a non-worksheets mode, clear worksheet selection
  const handleSelectModule = React.useCallback((m: ViewMode) => {
    setSelectedModule(m);
    if (m === "worksheets") {
      setSelectedSkill(null);
    } else {
      setSelectedWorksheetId(null);
      setSelectedSkill(null);
    }
  }, []);

  // Called when user clears data from the Settings modal.
  // Reloads all state from (now-empty) localStorage so the UI updates immediately.
  const handleDataCleared = React.useCallback(() => {
    refreshWorksheets();
    reloadBookmarks();
    reloadRecent();
    setSelectedWorksheetId(null);
    setSelectedSkill(null);
  }, [refreshWorksheets, reloadBookmarks, reloadRecent]);

  // Cmd+K / Ctrl+K to open search, '/' to focus search, '?' to open help
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && !searchOpen) {
        const target = e.target as HTMLElement;
        const tag = target?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea" && !target?.isContentEditable) {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
      if (e.key === "?" && !searchOpen) {
        const target = e.target as HTMLElement;
        const tag = target?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea" && !target?.isContentEditable) {
          e.preventDefault();
          setHelpOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen]);

  // Register service worker for PWA installability
  React.useEffect(() => {
    if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ignore registration errors — app still works without SW
      });
    }
  }, []);

  const isWorksheetsMode = selectedModule === "worksheets";

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Top bar — hidden on print */}
      <header className="shrink-0 border-b bg-background/95 backdrop-blur z-30 print:hidden">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 h-12">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-sm truncate">
                {selectedSkill || selectedWorksheet ? (
                  <span className="text-muted-foreground">DBT Skills</span>
                ) : isWorksheetsMode ? (
                  "Worksheets"
                ) : (
                  "DBT Skills Reference"
                )}
              </span>
              {selectedSkill && (
                <>
                  <span className="text-muted-foreground text-xs">/</span>
                  <span className="text-sm truncate">{selectedSkill.name}</span>
                </>
              )}
              {selectedWorksheet && (
                <>
                  <span className="text-muted-foreground text-xs">/</span>
                  <span className="text-sm truncate">{selectedWorksheet.title}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex"
            >
              <Search className="h-4 w-4 mr-1.5" />
              <span>Search</span>
              <kbd className="ml-2 text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border">
                ⌘K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden h-8 w-8"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setHelpOpen(true)}
              aria-label="Keyboard shortcuts help"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings"
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main 3-pane layout */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r print:hidden">
          <Sidebar
            selectedModule={selectedModule}
            onSelectModule={handleSelectModule}
            selectedSkillId={selectedSkill?.id ?? null}
            onSelectSkill={handleSelectSkill}
            bookmarks={bookmarks}
            worksheetCount={worksheetEntries.length}
          />
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex print:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-background border-r shadow-xl">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 h-7 w-7"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </Button>
              <Sidebar
                selectedModule={selectedModule}
                onSelectModule={(m) => {
                  handleSelectModule(m);
                  setSidebarOpen(false);
                }}
                selectedSkillId={selectedSkill?.id ?? null}
                onSelectSkill={(s) => {
                  handleSelectSkill(s);
                  setSidebarOpen(false);
                }}
                bookmarks={bookmarks}
                worksheetCount={worksheetEntries.length}
              />
            </div>
          </div>
        )}

        {/* Middle pane */}
        <section
          className={cn(
            "shrink-0 border-r w-full sm:w-80 lg:w-80 xl:w-96 print:hidden",
            // On mobile, hide the list when a skill/worksheet is selected
            (selectedSkill || selectedWorksheet) ? "hidden sm:block" : "block"
          )}
        >
          {isWorksheetsMode ? (
            <WorksheetList
              entries={worksheetEntries}
              selectedEntryId={selectedWorksheetId}
              onSelectEntry={handleSelectWorksheet}
              onCreate={handleCreateWorksheet}
              onImportComplete={() => {
                refreshWorksheets();
              }}
              onOpenCompare={() => setCompareOpen(true)}
            />
          ) : (
            <SkillList
              selectedModule={selectedModule}
              selectedSkillId={selectedSkill?.id ?? null}
              onSelectSkill={handleSelectSkill}
              onOpenSearch={() => setSearchOpen(true)}
              bookmarks={bookmarks}
            />
          )}
        </section>

        {/* Right pane */}
        <main className="flex-1 min-w-0">
          {selectedWorksheet ? (
            <WorksheetDetail
              entry={selectedWorksheet}
              onBack={() => setSelectedWorksheetId(null)}
              onChangeTitle={(title) => updateEntry(selectedWorksheet.id, { title })}
              onChangeData={(data) => updateEntry(selectedWorksheet.id, { data })}
              onDelete={() => {
                deleteEntry(selectedWorksheet.id);
                setSelectedWorksheetId(null);
              }}
            />
          ) : selectedSkill ? (
            <SkillDetail
              skill={selectedSkill}
              onBack={() => setSelectedSkill(null)}
              isBookmarked={bookmarks.has(selectedSkill.id)}
              onToggleBookmark={toggleBookmark}
              onSelectSkill={handleSelectSkill}
            />
          ) : isWorksheetsMode ? (
            <WorksheetsEmptyState onCreate={handleCreateWorksheet} />
          ) : (
            <EmptyState
              recent={recent}
              onSelectSkill={handleSelectSkill}
              onOpenSearch={() => setSearchOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Search palette */}
      <SearchPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={handleSelectSkill}
        bookmarks={bookmarks}
      />

      {/* Diary card comparison modal */}
      <DiaryComparison
        open={compareOpen}
        onOpenChange={setCompareOpen}
        diaryCards={worksheetEntries.filter((e) => e.type === "diary-card")}
      />

      {/* Settings modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onDataCleared={handleDataCleared}
      />

      {/* Keyboard shortcuts help dialog */}
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}

function EmptyState({
  recent,
  onSelectSkill,
  onOpenSearch,
}: {
  recent: string[];
  onSelectSkill: (skill: Skill) => void;
  onOpenSearch: () => void;
}) {
  const recentSkills = React.useMemo(
    () =>
      recent
        .map((id) => SKILLS.find((s) => s.id === id))
        .filter((s): s is Skill => Boolean(s))
        .slice(0, 5),
    [recent]
  );

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-4">
          D
        </div>
        <h1 className="text-2xl font-bold tracking-tight">DBT Skills Reference</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A fast, searchable library of DBT skills. Built for use during
          virtual group therapy — pull it up on a second screen, search
          a skill, and review the steps in seconds.
        </p>

        <Button
          size="lg"
          onClick={onOpenSearch}
          className="mt-6 w-full sm:w-auto"
        >
          <Search className="h-4 w-4 mr-2" />
          Search skills
          <kbd className="ml-2 text-[10px] font-mono bg-primary-foreground/20 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </Button>

        {recentSkills.length > 0 && (
          <div className="mt-8 text-left">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Recently viewed
            </h2>
            <div className="space-y-1">
              {recentSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => onSelectSkill(skill)}
                  className="w-full text-left p-2.5 rounded-md border hover:bg-muted/50 transition-colors"
                >
                  <div className="text-sm font-medium">{skill.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {skill.oneLiner}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-xs text-muted-foreground space-y-1">
          <p>
            <strong>{SKILLS.length} skills</strong> across 5 modules:
          </p>
          <p>General · Mindfulness · Interpersonal Effectiveness · Emotion Regulation · Distress Tolerance</p>
        </div>
      </div>
    </div>
  );
}

function WorksheetsEmptyState({
  onCreate,
}: {
  onCreate: (type: WorksheetType) => void;
}) {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <FileText className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Interactive Worksheets</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill out digital versions of the core DBT worksheets. Autosave to your
          browser, print when you need to. Saved entries appear in the list on
          the left.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
          <button
            onClick={() => onCreate("chain-analysis")}
            className="p-4 rounded-md border hover:bg-muted/50 transition-colors"
          >
            <Link2 className="h-5 w-5 text-slate-600 dark:text-slate-300 mb-2" />
            <div className="text-sm font-medium">Chain Analysis</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Map a problem behavior link-by-link.
            </div>
          </button>
          <button
            onClick={() => onCreate("pros-cons")}
            className="p-4 rounded-md border hover:bg-muted/50 transition-colors"
          >
            <Scale className="h-5 w-5 text-sky-600 dark:text-sky-400 mb-2" />
            <div className="text-sm font-medium">Pros & Cons</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Weigh acting on vs. resisting a crisis urge.
            </div>
          </button>
          <button
            onClick={() => onCreate("diary-card")}
            className="p-4 rounded-md border hover:bg-muted/50 transition-colors"
          >
            <CalendarRange className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <div className="text-sm font-medium">Diary Card</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Track urges, emotions, and skills across 7 days. Includes weekly summary view.
            </div>
          </button>
          <button
            onClick={() => onCreate("walking-middle-path")}
            className="p-4 rounded-md border hover:bg-muted/50 transition-colors"
          >
            <GitMerge className="h-5 w-5 text-violet-600 dark:text-violet-400 mb-2" />
            <div className="text-sm font-medium">Walking the Middle Path</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Find the synthesis between two opposing positions.
            </div>
          </button>
          <button
            onClick={() => onCreate("missing-links")}
            className="p-4 rounded-md border hover:bg-muted/50 transition-colors sm:col-span-2"
          >
            <Unplug className="h-5 w-5 text-orange-600 dark:text-orange-400 mb-2" />
            <div className="text-sm font-medium">Missing-Links Analysis (Behavior Analysis)</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Why didn&apos;t you use a skill you already knew? Find the specific gap and plan to close it.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
