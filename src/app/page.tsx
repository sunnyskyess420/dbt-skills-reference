"use client";

import * as React from "react";
import { SKILLS, type Skill, type Module } from "@/data/skills";
import { Sidebar } from "@/components/dbt/sidebar";
import { SkillList } from "@/components/dbt/skill-list";
import { SkillDetail } from "@/components/dbt/skill-detail";
import { SearchPalette } from "@/components/dbt/search-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY_BOOKMARKS = "dbt-skills:bookmarks";
const STORAGE_KEY_RECENT = "dbt-skills:recent";

export default function Home() {
  const [selectedModule, setSelectedModule] = React.useState<Module | "all" | "bookmarks">("all");
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false); // mobile sidebar
  const [listOpenMobile, setListOpenMobile] = React.useState(false); // mobile list view

  // Bookmarks persisted to localStorage
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());

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

  // Track recently viewed skills (separate from bookmarks)
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

  const handleSelectSkill = React.useCallback(
    (skill: Skill) => {
      setSelectedSkill(skill);
      setListOpenMobile(true); // show detail on mobile
      // Update recent (cap at 10, dedupe)
      setRecent((prev) => {
        const next = [skill.id, ...prev.filter((id) => id !== skill.id)].slice(0, 10);
        try {
          localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(next));
        } catch (e) {
          // ignore
        }
        return next;
      });
    },
    []
  );

  // Cmd+K / Ctrl+K to open search
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      // '/' to focus search (when not typing)
      if (e.key === "/" && !searchOpen) {
        const target = e.target as HTMLElement;
        const tag = target?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea" && !target?.isContentEditable) {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Top bar */}
      <header className="shrink-0 border-b bg-background/95 backdrop-blur z-30">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 h-12">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile sidebar toggle */}
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
                {selectedSkill ? (
                  <span className="text-muted-foreground">DBT Skills</span>
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
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main 3-pane layout */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop sidebar (lg+) */}
        <aside className="hidden lg:block w-64 shrink-0 border-r">
          <Sidebar
            selectedModule={selectedModule}
            onSelectModule={(m) => {
              setSelectedModule(m);
              setSelectedSkill(null);
            }}
            selectedSkillId={selectedSkill?.id ?? null}
            onSelectSkill={handleSelectSkill}
            bookmarks={bookmarks}
          />
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
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
                  setSelectedModule(m);
                  setSelectedSkill(null);
                  setSidebarOpen(false);
                }}
                selectedSkillId={selectedSkill?.id ?? null}
                onSelectSkill={(s) => {
                  handleSelectSkill(s);
                  setSidebarOpen(false);
                }}
                bookmarks={bookmarks}
              />
            </div>
          </div>
        )}

        {/* Middle: skill list (always visible on desktop; conditional on mobile) */}
        <section
          className={cn(
            "shrink-0 border-r w-full sm:w-80 lg:w-80 xl:w-96",
            // On mobile, hide the list when a skill is selected (detail takes over)
            selectedSkill ? "hidden sm:block" : "block"
          )}
        >
          <SkillList
            selectedModule={selectedModule}
            selectedSkillId={selectedSkill?.id ?? null}
            onSelectSkill={handleSelectSkill}
            onOpenSearch={() => setSearchOpen(true)}
            bookmarks={bookmarks}
          />
        </section>

        {/* Right: skill detail (or empty state) */}
        <main className="flex-1 min-w-0">
          {selectedSkill ? (
            <SkillDetail
              skill={selectedSkill}
              onBack={() => setSelectedSkill(null)}
              isBookmarked={bookmarks.has(selectedSkill.id)}
              onToggleBookmark={toggleBookmark}
              onSelectSkill={handleSelectSkill}
            />
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
