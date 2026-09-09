"use client";

import * as React from "react";
import { MODULES, SKILLS, type Module, type Skill } from "@/data/skills";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronRight, ChevronDown, Brain, Heart, Users, Flame, BookOpen, FileText, BarChart3, ClipboardList, LifeBuoy, Target, X } from "lucide-react";
import { UserMenu } from "@/components/dbt/user-menu";
import type { SyncState } from "@/lib/sync";

interface SidebarProps {
  selectedModule: Module | "all" | "bookmarks" | "worksheets" | "goals" | "dashboard" | "session-prep" | "crisis";
  onSelectModule: (m: Module | "all" | "bookmarks" | "worksheets" | "goals" | "dashboard" | "session-prep" | "crisis") => void;
  selectedSkillId: string | null;
  onSelectSkill: (skill: Skill) => void;
  bookmarks: Set<string>;
  worksheetCount: number;
  /** Number of goals with actual content (title, description, or steps).
   *  Empty slots don't count — only goals the user has actually filled in. */
  goalCount: number;
  // Auth/sync wiring
  onOpenAuth: () => void;
  sync: SyncState;
  onSyncNow: () => void;
  // Guest data-safety nudge — shown once a guest has saved a few
  // worksheets, framing sign-in as a *backup* option. Dismissible.
  showGuestNudge?: boolean;
  guestNudgeCount?: number;
  onDismissGuestNudge?: () => void;
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
  goalCount,
  onOpenAuth,
  sync,
  onSyncNow,
  showGuestNudge = false,
  guestNudgeCount = 0,
  onDismissGuestNudge,
}: SidebarProps) {
  const bookmarkedSkills = React.useMemo(
    () => SKILLS.filter((s) => bookmarks.has(s.id)),
    [bookmarks]
  );

  // Modules are expanded when "All Skills" is selected, collapsed otherwise.
  // Clicking a specific module keeps the section open so you can see where
  // you are in the hierarchy.
  const modulesExpanded = selectedModule === "all" || MODULES.some((m) => m.id === selectedModule);

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
          {/* All Skills — toggles the module groups below it */}
          <button
            onClick={() => onSelectModule("all")}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
              selectedModule === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <BookOpen className="h-4 w-4" />
            <span className="flex-1 text-left">All Skills</span>
            <span className="text-[10px] text-muted-foreground">{SKILLS.length}</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform",
                modulesExpanded && "rotate-180"
              )}
            />
          </button>

          {/* Collapsible module groups — only show under All Skills */}
          {modulesExpanded && (
            <div className="mt-1 ml-3 pl-2 border-l space-y-0.5">
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
                      <span className="flex-1 text-left text-xs leading-tight">{module.short}</span>
                      <span className="text-[10px] text-muted-foreground">{skills.length}</span>
                    </button>

                    {isActive && (
                      <ul className="mt-1 space-y-0.5 pl-2 border-l ml-3">
                        {skills.map((skill) => (
                          <li key={skill.id}>
                            <button
                              onClick={() => onSelectSkill(skill)}
                              className={cn(
                                "w-full flex items-start gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors",
                                selectedSkillId === skill.id
                                  ? "bg-background text-foreground font-medium shadow-sm"
                                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                              )}
                            >
                              {bookmarks.has(skill.id) && (
                                <Bookmark className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <span className="flex-1 text-left leading-tight break-words">{skill.name}</span>
                              <ChevronRight className="h-3 w-3 shrink-0 opacity-50 mt-0.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}

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
            active={selectedModule === "goals"}
            onClick={() => onSelectModule("goals")}
            icon={<Target className="h-4 w-4" />}
            label="My Goals"
            count={goalCount}
            highlight={goalCount > 0}
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
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t shrink-0 space-y-2">
        {showGuestNudge && (
          <div className="relative rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-2">
            <button
              onClick={onDismissGuestNudge}
              className="absolute right-1 top-1 rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss sign-in reminder"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="pr-4 text-[11px] leading-snug text-foreground/80">
              {guestNudgeCount} worksheet{guestNudgeCount === 1 ? "" : "s"} saved on this device.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-1.5 h-7 w-full text-xs"
              onClick={onOpenAuth}
            >
              Sign in to back them up
            </Button>
          </div>
        )}
        <UserMenu onOpenAuth={onOpenAuth} sync={sync} onSyncNow={onSyncNow} />
        <p className="px-1 text-[11px] text-muted-foreground">
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
  count?: number;
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
