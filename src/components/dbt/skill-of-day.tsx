"use client";

import * as React from "react";
import { SKILLS, MODULES, type Skill } from "@/data/skills";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSelectSkill: (skill: Skill) => void;
}

/**
 * Deterministically picks a skill based on the current date.
 * Same skill shown all day, rotates through all 53 skills.
 */
function getSkillOfDay(date: Date = new Date()): Skill {
  // Use day-of-year as seed so it changes daily but is stable within a day
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % SKILLS.length;
  return SKILLS[index];
}

const STORAGE_KEY = "dbt-skills:skill-of-day-practiced";

export function SkillOfDay({ onSelectSkill }: Props) {
  const [skill, setSkill] = React.useState<Skill | null>(null);
  const [practiced, setPracticed] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setSkill(getSkillOfDay());
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPracticed(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const todayKey = skill
    ? `${new Date().toISOString().slice(0, 10)}-${skill.id}`
    : "";
  const isPracticed = practiced[todayKey] ?? false;

  const markPracticed = () => {
    const next = { ...practiced, [todayKey]: !isPracticed };
    setPracticed(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const showAnother = () => {
    // Pick a random different skill
    if (!skill) return;
    let next: Skill;
    do {
      next = SKILLS[Math.floor(Math.random() * SKILLS.length)];
    } while (next.id === skill.id);
    setSkill(next);
  };

  if (!skill) return null;

  const moduleInfo = MODULES.find((m) => m.id === skill.module)!;

  return (
    <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Skill of the Day
        </span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-bold">{skill.name}</h3>
          {skill.acronym && (
            <span className={cn("text-xs font-mono font-bold", moduleInfo.color)}>
              {skill.acronym}
            </span>
          )}
          <span className={cn("text-[10px] uppercase tracking-wider", moduleInfo.color)}>
            {moduleInfo.short}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{skill.oneLiner}</p>
      </div>

      {/* Quick steps preview (first 3) */}
      {skill.steps && skill.steps.length > 0 && (
        <ol className="space-y-1 text-xs text-muted-foreground">
          {skill.steps.slice(0, 3).map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-mono font-semibold text-muted-foreground/70 shrink-0">
                {i + 1}.
              </span>
              <span className="line-clamp-2">{step}</span>
            </li>
          ))}
          {skill.steps.length > 3 && (
            <li className="text-[10px] italic pl-4">
              +{skill.steps.length - 3} more steps...
            </li>
          )}
        </ol>
      )}

      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          variant="default"
          onClick={() => onSelectSkill(skill)}
        >
          View full skill
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
        <Button
          size="sm"
          variant={isPracticed ? "default" : "outline"}
          onClick={markPracticed}
          className={cn(isPracticed && "bg-emerald-600 hover:bg-emerald-700 text-white")}
        >
          {isPracticed ? "✓ Practiced today" : "Mark as practiced"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={showAnother}
          className="text-muted-foreground ml-auto"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Another</span>
        </Button>
      </div>
    </div>
  );
}
