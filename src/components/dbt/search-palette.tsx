"use client";

import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SKILLS, MODULES, type Skill } from "@/data/skills";
import {
  WORKSHEET_TYPES,
  getWorksheetTypeMeta,
  type WorksheetEntry,
  type WorksheetType,
} from "@/lib/worksheet-storage";
import { Search, Bookmark, FileText, Plus } from "lucide-react";
import { formatRelativeTime } from "@/lib/relative-time";

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
function searchableValue(kind: "skill" | "wstype" | "wsentry", id: string, text: string[]) {
  return `${kind}:${id}|${text.join(" ").toLowerCase()}`;
}

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
  // ("Start a new worksheet" only appears once the user types — the
  // empty-query view stays focused on skills + recent entries.)
  // NOTE: this is bound to CommandInput's value/onValueChange — the root
  // Command's onValueChange tracks the *highlighted item*, not the text.
  const [query, setQuery] = React.useState("");
  const hasQuery = query.trim().length > 0;

  // Reset the mirrored query whenever the palette closes (Radix unmounts
  // the Command, but this state lives outside it).
  React.useEffect(() => {
    if (!open) setQuery("");
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
      <DialogContent className="p-0 overflow-hidden max-w-2xl gap-0">
        {/* Accessible title and description for screen readers (visually hidden) */}
        <DialogTitle className="sr-only">Search DBT skills and worksheets</DialogTitle>
        <DialogDescription className="sr-only">
          Search skills, worksheet types, and your saved worksheets. Use arrow keys to navigate results and Enter to select.
        </DialogDescription>
        <Command
          className="rounded-lg"
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
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search skills, worksheets, or your saved entries (e.g. 'tipp', 'dear man', 'diary card')..."
              className="h-12 border-0 focus-visible:ring-0 text-base"
            />
          </div>
          <CommandList className="max-h-[60vh]">
            <CommandEmpty>No matching skills or worksheets.</CommandEmpty>

            {/* Saved entries — quick "jump back in" + findable by search */}
            {recentEntries.length > 0 && (
              <CommandGroup heading="Your worksheets" className="text-xs">
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
                      <div className="flex items-start gap-2.5 w-full min-w-0">
                        <FileText className={`h-4 w-4 mt-0.5 shrink-0 ${meta.color}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {entry.title}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {meta.shortName} · updated {formatRelativeTime(entry.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Worksheet types — only once the user types, so the
                empty-query view isn't flooded with 50+ rows */}
            {hasQuery && (
              <CommandGroup heading="Start a new worksheet" className="text-xs">
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
                    <div className="flex items-start gap-2.5 w-full min-w-0">
                      <Plus className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{type.name}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline">
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

            {grouped.map(({ module, skills }) => (
              <CommandGroup
                key={module.id}
                heading={module.name}
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
                    <div className="flex items-start justify-between gap-3 w-full">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{skill.name}</span>
                          {skill.acronym && (
                            <span className={`text-[10px] font-mono uppercase tracking-wider ${module.color}`}>
                              {skill.acronym}
                            </span>
                          )}
                          {bookmarks.has(skill.id) && (
                            <Bookmark className="h-3 w-3 fill-amber-500 text-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {skill.oneLiner}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5 hidden sm:inline">
                        {skill.reference}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
          <div className="border-t bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>
              <kbd className="px-1 py-0.5 rounded border bg-background font-mono">↑↓</kbd> navigate
              {" · "}
              <kbd className="px-1 py-0.5 rounded border bg-background font-mono">↵</kbd> select
              {" · "}
              <kbd className="px-1 py-0.5 rounded border bg-background font-mono">esc</kbd> close
            </span>
            <span>
              {SKILLS.length} skills · {WORKSHEET_TYPES.length} worksheet types indexed
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
