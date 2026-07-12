"use client";

import * as React from "react";
import { MODULES, SKILLS, type Skill } from "@/data/skills";
import { cn } from "@/lib/utils";
import { Bookmark, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SkillListProps {
  selectedModule: string; // "all" | "bookmarks" | module id
  selectedSkillId: string | null;
  onSelectSkill: (skill: Skill) => void;
  onOpenSearch: () => void;
  bookmarks: Set<string>;
}

export function SkillList({
  selectedModule,
  selectedSkillId,
  onSelectSkill,
  onOpenSearch,
  bookmarks,
}: SkillListProps) {
  // Compute filtered skills based on selection
  const filtered = React.useMemo(() => {
    if (selectedModule === "all") return SKILLS;
    if (selectedModule === "bookmarks") return SKILLS.filter((s) => bookmarks.has(s.id));
    return SKILLS.filter((s) => s.module === selectedModule);
  }, [selectedModule, bookmarks]);

  // Group by category if a module is selected; otherwise group by module
  const groups = React.useMemo(() => {
    if (selectedModule === "all") {
      return MODULES.map((m) => ({
        title: m.name,
        color: m.color,
        skills: filtered.filter((s) => s.module === m.id),
      }));
    }
    if (selectedModule === "bookmarks") {
      return [{ title: "Bookmarked Skills", color: "text-amber-500", skills: filtered }];
    }
    const moduleInfo = MODULES.find((m) => m.id === selectedModule);
    if (!moduleInfo) return [];
    // Group by category within the module
    const categories = Array.from(new Set(filtered.map((s) => s.category)));
    return categories.map((c) => ({
      title: c,
      color: moduleInfo.color,
      skills: filtered.filter((s) => s.category === c),
    }));
  }, [filtered, selectedModule]);

  const isBookmarks = selectedModule === "bookmarks";

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with search trigger */}
      <div className="border-b px-3 py-3 shrink-0">
        <Button
          variant="outline"
          onClick={onOpenSearch}
          className="w-full justify-start text-muted-foreground font-normal"
        >
          <SearchIcon className="h-4 w-4 mr-2" />
          <span className="flex-1 text-left">Search skills…</span>
          <kbd className="ml-2 text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border">
            ⌘K
          </kbd>
        </Button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Bookmark className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              {isBookmarks
                ? "No bookmarked skills yet. Click the bookmark icon on any skill to save it for quick access."
                : "No skills found."}
            </p>
          </div>
        ) : (
          <div className="py-2">
            {groups.map((group) => (
              <div key={group.title} className="mb-4">
                <div className="px-3 py-1.5 sticky top-0 bg-background/95 backdrop-blur">
                  <span className={cn("text-[11px] font-semibold uppercase tracking-wider", group.color)}>
                    {group.title}
                  </span>
                </div>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill.id}>
                      <button
                        onClick={() => onSelectSkill(skill)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 border-l-2 transition-colors",
                          selectedSkillId === skill.id
                            ? "bg-muted/60 border-primary"
                            : "border-transparent hover:bg-muted/40 hover:border-muted"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium truncate">{skill.name}</span>
                              {skill.acronym && (
                                <span className="text-[10px] font-mono uppercase text-muted-foreground shrink-0">
                                  {skill.acronym}
                                </span>
                              )}
                              {bookmarks.has(skill.id) && (
                                <Bookmark className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {skill.oneLiner}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
