"use client";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SKILLS, MODULES, type Skill, type Module } from "@/data/skills";
import {
  WORKSHEET_TYPES,
  getWorksheetTypeMeta,
  type WorksheetEntry,
  type WorksheetType,
} from "@/lib/worksheet-storage";
import { Search, Bookmark, FileText, Plus, BookOpen } from "lucide-react";
import { formatRelativeTime } from "@/lib/relative-time";

type SearchMode = "all" | "skills" | "worksheets";

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (skill: Skill) => void;
  bookmarks: Set<string>;
  /** Saved worksheet entries — shown as "Your worksheets" (recent first). */
  worksheetEntries?: WorksheetEntry[];
  /** Open a saved worksheet entry. */
  onSelectWorksheetEntry?: (entry: WorksheetEntry) => void;
  /** Create a new worksheet of the given type ("Start a new…" results). */
  onCreateWorksheet?: (type: WorksheetType) => void;
}

// Item values are "kind:id|lowercased searchable text". The kind prefix
// routes the selection to the right handler; cmdk lowercases values, so
// entry-id lookups compare case-insensitively.
function searchableValue(
  kind: "skill" | "wstype" | "wsentry",
  id: string,
  text: string[]
) {
  return `${kind}:${id}|${text.join(" ").toLowerCase()}`;
}

/**
 * Compact a book reference by stripping the redundant module prefix
 * (the group heading already names the module) and turning the " / "
 * separator into a middot so it reads as a single tidy line.
 *
 *   "Distress Tolerance Handouts 11, 11a, 11b / Distress Tolerance Worksheets 9, 9a"
 *    -> "Handouts 11, 11a, 11b · Worksheets 9, 9a"
 */
function shortReference(ref: string): string {
  return ref
    .replace(/\s*\/\s*/g, " · ")
    .replace(
      /(?:General|Mindfulness|Interpersonal Effectiveness|Emotion Regulation|Distress Tolerance)\s+(?=Handout|Worksheet)/g,
      ""
    )
    .trim();
}

// A thin colored accent bar per module so the eye can scan groups quickly
// even when the group heading scrolls out of view.
const MODULE_ACCENT: Record<Module, string> = {
  general: "bg-slate-400",
  mindfulness: "bg-emerald-500",
  interpersonal: "bg-amber-500",
  "emotion-regulation": "bg-rose-500",
  "distress-tolerance": "bg-sky-500",
};

export function SearchPalette({
  open,
  onOpenChange,
  onSelect,
  bookmarks,
  worksheetEntries = [],
  onSelectWorksheetEntry,
  onCreateWorksheet,
}: SearchPaletteProps) {
  // Mirrors the cmdk search input so we can decide which groups to render.
  // NOTE: this is bound to CommandInput's value/onValueChange — the root
  // Command's onValueChange tracks the *highlighted item*, not the text.
  const [query, setQuery] = React.useState("");
  const hasQuery = query.trim().length > 0;

  // Filter tab — lets the user scope results to skills or worksheets only.
  // "Worksheets" is always browsable here, even with an empty query, so the
  // user can see all 52 worksheet templates without typing first.
  const [mode, setMode] = React.useState<SearchMode>("all");
  const showSkills = mode === "all" || mode === "skills";
  const showWorksheetTypes = mode === "all" || mode === "worksheets";

  // Reset the mirrored query + mode whenever the palette closes (Radix
  // unmounts the Command, but this state lives outside it).
  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setMode("all");
    }
  }, [open]);

  // Saved entries, most recently updated first — doubles as a
  // "jump back in" list when the palette opens with no query.
  const recentEntries = React.useMemo(() => {
    return worksheetEntries
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 6);
  }, [worksheetEntries]);

  // Build a flat list for the command palette, grouped by module
  const grouped = React.useMemo(() => {
    return MODULES.map((m) => ({
      module: m,
      skills: SKILLS.filter((s) => s.module === m.id),
    }));
  }, []);

  const handlePick = (rawValue: string) => {
    const keyPart = rawValue.split("|")[0];
    const sep = keyPart.indexOf(":");
    const kind = sep === -1 ? keyPart : keyPart.slice(0, sep);
    const id = sep === -1 ? "" : keyPart.slice(sep + 1);

    if (kind === "skill") {
      const skill = SKILLS.find((s) => s.id === id);
      if (skill) {
        onSelect(skill);
        onOpenChange(false);
      }
      return;
    }
    if (kind === "wstype") {
      const type = id as WorksheetType;
      if (WORKSHEET_TYPES.some((t) => t.id === type)) {
        onCreateWorksheet?.(type);
        onOpenChange(false);
      }
      return;
    }
    if (kind === "wsentry") {
      const entry = worksheetEntries.find(
        (e) => e.id.toLowerCase() === id.toLowerCase()
      );
      if (entry) {
        onSelectWorksheetEntry?.(entry);
        onOpenChange(false);
      }
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 overflow-hidden gap-0 max-w-3xl top-[12%] translate-y-0 rounded-xl"
      >
        {/* Accessible title and description for screen readers (visually hidden) */}
        <DialogTitle className="sr-only">
          Search DBT skills and worksheets
        </DialogTitle>
        <DialogDescription className="sr-only">
          Search skills, worksheet types, and your saved worksheets. Use arrow
          keys to navigate results and Enter to select.
        </DialogDescription>
        <Command
          className="rounded-xl"
          filter={(value, search) => {
            // value is kind:id|lowercased-searchable-text
            const [, text] = value.split("|", 2);
            if (!text) return 0;
            const q = search.toLowerCase().trim();
            if (!q) return 1;
            const terms = q.split(/\s+/);
            const matchesAll = terms.every((t) => text.includes(t));
            return matchesAll ? 1 : 0;
          }}
        >
          {/* Search input row */}
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={
                mode === "worksheets"
                  ? "Search 52 worksheet templates…  (try “diary”, “tipp”, “dear man”)"
                  : mode === "skills"
                  ? "Search 53 skills…  (try “tipp”, “dear man”, “radical acceptance”)"
                  : "Search skills, worksheets, or your saved entries…  (try “tipp”, “dear man”, “diary card”)"
              }
              className="h-12 border-0 focus-visible:ring-0 text-base"
            />
          </div>

          {/* Filter tabs — All / Skills / Worksheets */}
          <div className="flex items-center gap-1 border-b px-2 py-1.5 bg-muted/30">
            {([
              { id: "all", label: "All", count: SKILLS.length + WORKSHEET_TYPES.length },
              { id: "skills", label: "Skills", count: SKILLS.length },
              { id: "worksheets", label: "Worksheets", count: WORKSHEET_TYPES.length },
            ] as const).map((tab) => {
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id)}
                  className={
                    "px-2.5 py-1 text-xs rounded-md font-medium transition-colors " +
                    (active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60")
                  }
                >
                  {tab.label}
                  <span className="ml-1.5 text-[10px] opacity-70">{tab.count}</span>
                </button>
              );
            })}
          </div>

          <CommandList className="max-h-[58vh]">
            <CommandEmpty className="py-10 text-center text-sm text-muted-foreground">
              <Search className="h-5 w-5 mx-auto mb-2 opacity-40" />
              No matching {mode === "skills" ? "skills" : mode === "worksheets" ? "worksheets" : "skills or worksheets"}.
            </CommandEmpty>

            {/* Saved entries — quick "jump back in" + findable by search.
                Only shown in "all" mode (skills-only and worksheets-only
                views stay focused on their respective content). */}
            {mode === "all" && recentEntries.length > 0 && (
              <CommandGroup
                heading="Your worksheets"
                className="text-xs"
              >
                {recentEntries.map((entry) => {
                  const meta = getWorksheetTypeMeta(entry.type);
                  return (
                    <CommandItem
                      key={`entry-${entry.id}`}
                      value={searchableValue("wsentry", entry.id, [
                        entry.title,
                        meta.name,
                        meta.shortName,
                        meta.description,
                      ])}
                      onSelect={handlePick}
                      className="py-2.5"
                    >
                      <div className="flex items-center gap-3 w-full min-w-0">
                        <FileText
                          className={`h-4 w-4 shrink-0 ${meta.color}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-medium text-sm truncate min-w-0">
                              {entry.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                              updated {formatRelativeTime(entry.updatedAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {meta.shortName}
                          </p>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Worksheet templates — always visible in "all" and "worksheets"
                modes so the user can browse all 52 without typing first. */}
            {showWorksheetTypes && (
              <CommandGroup
                heading={
                  <span className="flex items-center gap-1.5">
                    <Plus className="h-3 w-3 text-muted-foreground" />
                    {hasQuery ? "Matching worksheet templates" : "All worksheet templates"}
                  </span>
                }
                className="text-xs"
              >
                {WORKSHEET_TYPES.map((type) => (
                  <CommandItem
                    key={`type-${type.id}`}
                    value={searchableValue("wstype", type.id, [
                      type.name,
                      type.shortName,
                      type.description,
                    ])}
                    onSelect={handlePick}
                    className="py-2.5"
                  >
                    <div className="flex items-center gap-3 w-full min-w-0">
                      <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-sm truncate min-w-0">
                            {type.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap uppercase tracking-wider">
                            create new
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {showSkills &&
              grouped.map(({ module, skills }) => (
                <CommandGroup
                  key={module.id}
                  heading={
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${MODULE_ACCENT[module.id]}`}
                      />
                      {module.name}
                    </span>
                  }
                  className="text-xs"
                >
                  {skills.map((skill) => (
                    <CommandItem
                      key={skill.id}
                      value={searchableValue("skill", skill.id, [
                        skill.name,
                        skill.acronym ?? "",
                        skill.oneLiner,
                        skill.category,
                        skill.reference,
                        ...skill.tags,
                      ])}
                      onSelect={handlePick}
                      className="py-2.5"
                    >
                      <div className="flex items-center gap-3 w-full min-w-0">
                        {/* Module color accent — survives scroll past heading */}
                        <span
                          className={`h-9 w-1 rounded-full shrink-0 ${MODULE_ACCENT[skill.module]}`}
                        />
                        <div className="min-w-0 flex-1">
                          {/* Line 1: name + acronym + bookmark */}
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-medium text-sm truncate min-w-0">
                              {skill.name}
                            </span>
                            {skill.acronym && (
                              <span
                                className={`text-[10px] font-mono uppercase tracking-wider shrink-0 whitespace-nowrap px-1.5 py-0.5 rounded bg-muted ${module.color}`}
                              >
                                {skill.acronym}
                              </span>
                            )}
                            {bookmarks.has(skill.id) && (
                              <Bookmark className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                            )}
                          </div>
                          {/* Line 2: one-liner (left) + compact reference (right) */}
                          <div className="flex items-center gap-2 mt-0.5 min-w-0">
                            <p className="text-xs text-muted-foreground truncate min-w-0 flex-1">
                              {skill.oneLiner}
                            </p>
                            <span className="text-[10px] text-muted-foreground/70 shrink-0 whitespace-nowrap font-mono hidden sm:inline">
                              {shortReference(skill.reference)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
          </CommandList>

          {/* Footer — keyboard hints + index stats */}
          <div className="border-t bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground flex items-center justify-between gap-3">
            <span className="flex items-center gap-3 min-w-0">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-background font-mono text-[10px]">
                  ↑↓
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-background font-mono text-[10px]">
                  ↵
                </kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border bg-background font-mono text-[10px]">
                  esc
                </kbd>
                close
              </span>
            </span>
            <span className="flex items-center gap-1.5 shrink-0">
              <BookOpen className="h-3 w-3" />
              {SKILLS.length} skills · {WORKSHEET_TYPES.length} worksheet types
              indexed
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
