"use client";

import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SKILLS, MODULES, type Skill } from "@/data/skills";
import { Search, Bookmark } from "lucide-react";

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (skill: Skill) => void;
  bookmarks: Set<string>;
}

export function SearchPalette({ open, onOpenChange, onSelect, bookmarks }: SearchPaletteProps) {
  // Build a flat list for the command palette, grouped by module
  const grouped = React.useMemo(() => {
    return MODULES.map((m) => ({
      module: m,
      skills: SKILLS.filter((s) => s.module === m.id),
    }));
  }, []);

  const handleSelect = (skillId: string) => {
    const skill = SKILLS.find((s) => s.id === skillId);
    if (skill) {
      onSelect(skill);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl gap-0">
        <Command
          className="rounded-lg"
          filter={(value, search) => {
            // value is skillId|lowercased-searchable-text
            const [id, text] = value.split("|", 2);
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
              placeholder="Search skills, acronyms, or tags (e.g. 'tipp', 'radical acceptance', 'dear man')..."
              className="h-12 border-0 focus-visible:ring-0 text-base"
            />
          </div>
          <CommandList className="max-h-[60vh]">
            <CommandEmpty>No skills found.</CommandEmpty>
            {grouped.map(({ module, skills }) => (
              <CommandGroup
                key={module.id}
                heading={module.name}
                className="text-xs"
              >
                {skills.map((skill) => (
                  <CommandItem
                    key={skill.id}
                    value={`${skill.id}|${[
                      skill.name,
                      skill.acronym ?? "",
                      skill.oneLiner,
                      skill.category,
                      skill.reference,
                      ...skill.tags,
                    ]
                      .join(" ")
                      .toLowerCase()}`}
                    onSelect={() => handleSelect(skill.id)}
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
            <span>{SKILLS.length} skills indexed</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
