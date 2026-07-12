"use client";

import * as React from "react";
import { MODULES, SKILLS, type Module, type Skill } from "@/data/skills";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronRight, Brain, Heart, Users, Flame, BookOpen, FileText, BarChart3, ClipboardList, LifeBuoy } from "lucide-react";

interface SidebarProps {
  selectedModule: Module | "all" | "bookmarks" | "worksheets" | "dashboard" | "session-prep" | "crisis";
  onSelectModule: (m: Module | "all" | "bookmarks" | "worksheets" | "dashboard" | "session-prep" | "crisis") => void;
  selectedSkillId: string | null;
  onSelectSkill: (skill: Skill) => void;
  bookmarks: Set<string>;
  worksheetCount: number;
}

const MODULE_ICONS: Record<Module, React.ComponentType<{ className?: string }>> = {
  general: BookOpen,
  mindfulness: Brain,
  interpersonal: Users,
  "emotion-regulation": Heart,
  "distress-tolerance": Flame,
};

export function Sidebar({
  selectedModule,
  onSelectModule,
  selectedSkillId,
  onSelectSkill,
  bookmarks,
  worksheetCount,
}: SidebarProps) {
  const bookmarkedSkills = React.useMemo(
    () => SKILLS.filter((s) => bookmarks.has(s.id)),
    [bookmarks]
  );

  return (
    <nav className="flex flex-col h-full bg-muted/30">
      {/* Brand */}
      <div className="px-4 py-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            D
          </div>
          <div>
            <div className="font-semibold text-sm leading-tight">DBT Skills</div>
            <div className="text-[11px] text-muted-foreground leading-tight">
              Quick Reference
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {/* All + Bookmarks + Worksheets */}
        <div className="space-y-0.5 mb-3">
          <NavButton
            active={selectedModule === "all"}
            onClick={() => onSelectModule("all")}
            icon={<BookOpen className="h-4 w-4" />}
            label="All Skills"
            count={SKILLS.length}
          />
          <NavButton
            active={selectedModule === "bookmarks"}
            onClick={() => onSelectModule("bookmarks")}
            icon={<Bookmark className={cn("h-4 w-4", bookmarkedSkills.length > 0 && "fill-amber-500 text-amber-500")} />}
            label="Bookmarks"
            count={bookmarkedSkills.length}
            highlight={bookmarkedSkills.length > 0}
          />
          <NavButton
            active={selectedModule === "worksheets"}
            onClick={() => onSelectModule("worksheets")}
            icon={<FileText className="h-4 w-4" />}
            label="Worksheets"
            count={worksheetCount}
          />
          <NavButton
            active={selectedModule === "dashboard"}
            onClick={() => onSelectModule("dashboard")}
            icon={<BarChart3 className="h-4 w-4" />}
            label="Dashboard"
          />
          <NavButton
            active={selectedModule === "session-prep"}
            onClick={() => onSelectModule("session-prep")}
            icon={<ClipboardList className="h-4 w-4" />}
            label="Session Prep"
          />
          <NavButton
            active={selectedModule === "crisis"}
            onClick={() => onSelectModule("crisis")}
            icon={<LifeBuoy className="h-4 w-4" />}
            label="Crisis Resources"
          />
        </div>

        {/* Module sections */}
        <div className="space-y-4">
          {MODULES.map((module) => {
            const Icon = MODULE_ICONS[module.id];
            const skills = SKILLS.filter((s) => s.module === module.id);
            const isActive = selectedModule === module.id;

            return (
              <div key={module.id}>
                <button
                  onClick={() => onSelectModule(module.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? module.color : "")} />
                  <span className="flex-1 text-left truncate">{module.short}</span>
                  <span className="text-[10px] text-muted-foreground">{skills.length}</span>
                </button>

                {isActive && (
                  <ul className="mt-1 space-y-0.5 pl-2 border-l ml-3">
                    {skills.map((skill) => (
                      <li key={skill.id}>
                        <button
                          onClick={() => onSelectSkill(skill)}
                          className={cn(
                            "w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors",
                            selectedSkillId === skill.id
                              ? "bg-background text-foreground font-medium shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                          )}
                        >
                          {bookmarks.has(skill.id) && (
                            <Bookmark className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                          )}
                          <span className="flex-1 truncate">{skill.name}</span>
                          <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t text-[11px] text-muted-foreground shrink-0">
        <p>
          Based on{" "}
          <span className="italic">Linehan (2014)</span>
        </p>
      </div>
    </nav>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
  count,
  highlight,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-background/50"
      )}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      <span
        className={cn(
          "text-[10px]",
          highlight && "text-amber-500 font-semibold"
        )}
      >
        {count}
      </span>
    </button>
  );
}
