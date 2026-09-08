"use client";

import * as React from "react";
import { SKILLS, MODULES, type Skill } from "@/data/skills";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  Sparkles,
  Loader2,
  Plus,
  X,
  Trash2,
  Compass,
  CheckCircle2,
  Users,
  CalendarDays,
  Lightbulb,
  TrendingUp,
  ListChecks,
  Printer,
  FileDown,
  Download,
  Upload,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  type Goal,
  type GoalGuidance,
  loadGoals,
  saveGoals,
  emptyGoal,
  newId,
  matchSkillsForGoal,
  offlineBreakdown,
  MAX_GOALS,
} from "@/lib/goals-storage";
import { exportGoalToPdf, exportAllGoalsToPdf } from "@/lib/goals-pdf";
import {
  downloadGoalsJsonBackup,
  importGoalsFromJson,
  type GoalsImportResult,
} from "@/lib/goals-export";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  /** Navigate to a skill's detail page from a suggestion chip. */
  onViewSkill: (skillId: string) => void;
}

export function Goals({ onViewSkill }: Props) {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [fallbackIds, setFallbackIds] = React.useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = React.useState<Record<string, string>>({});
  const [stepDrafts, setStepDrafts] = React.useState<Record<string, string>>({});
  const [importResult, setImportResult] = React.useState<GoalsImportResult | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load on first mount. The section starts empty — users add their own
  // goals. (loadGoals also wipes any leftover auto-seeded example data.)
  React.useEffect(() => {
    setGoals(loadGoals() ?? []);
    setLoaded(true);
  }, []);

  const commit = React.useCallback((next: Goal[]) => {
    setGoals(next);
    saveGoals(next);
  }, []);

  const updateGoal = React.useCallback(
    (id: string, patch: Partial<Goal>) => {
      commit(
        goals.map((g) =>
          g.id === id ? { ...g, ...patch, updatedAt: new Date().toISOString() } : g
        )
      );
    },
    [goals, commit]
  );

  const addGoal = () => {
    if (goals.length >= MAX_GOALS) return;
    commit([...goals, emptyGoal()]);
  };

  const deleteGoal = (id: string) => {
    commit(goals.filter((g) => g.id !== id));
  };

  const clearAll = () => {
    commit([]);
  };

  // ----- print / pdf -------------------------------------------------------

  const handlePrint = () => {
    window.print();
  };

  const handleExportAllPdf = () => {
    const usable = goals.filter(
      (g) => g.title.trim() || g.description.trim() || g.steps.length > 0
    );
    if (usable.length === 0) return;
    exportAllGoalsToPdf(usable);
  };

  const handleExportGoalPdf = (goal: Goal) => {
    exportGoalToPdf(goal);
  };

  // ----- json backup / restore ---------------------------------------------

  const handleExportJson = () => {
    downloadGoalsJsonBackup();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importGoalsFromJson(text);
    setImportResult(result);
    if (result.success && result.imported > 0) {
      // Refresh in-memory state from storage so the new goals appear.
      setGoals(loadGoals() ?? []);
    }
    // Reset input so the same file can be re-selected.
    e.target.value = "";
  };

  // ----- steps -------------------------------------------------------------

  const addStep = (goalId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, {
      steps: [...goal.steps, { id: newId(), text: trimmed, done: false }],
    });
    setStepDrafts((d) => ({ ...d, [goalId]: "" }));
  };

  const toggleStep = (goalId: string, stepId: string, done: boolean) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, {
      steps: goal.steps.map((s) => (s.id === stepId ? { ...s, done } : s)),
    });
  };

  const removeStep = (goalId: string, stepId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, { steps: goal.steps.filter((s) => s.id !== stepId) });
  };

  // ----- skills ------------------------------------------------------------

  const removeSkill = (goalId: string, skillId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, { skills: goal.skills.filter((s) => s.skillId !== skillId) });
  };

  const findSkillsOffline = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const matches = matchSkillsForGoal(goal.title, goal.description, 6);
    if (matches.length === 0) {
      setErrorIds((e) => ({
        ...e,
        [goalId]: "No keyword matches yet — add a few more words about what makes this hard.",
      }));
      return;
    }
    setErrorIds((e) => {
      const { [goalId]: _drop, ...rest } = e;
      return rest;
    });
    updateGoal(goalId, {
      skills: matches.map((m) => ({ skillId: m.skillId, reason: m.reason })),
    });
  };

  // ----- AI breakdown ------------------------------------------------------

  const adoptGuidance = (goal: Goal, guidance: GoalGuidance, skills: { skillId: string; reason?: string }[]) => {
    // If the goal has no checklist yet, adopt the suggested steps directly.
    const adoptSteps = goal.steps.length === 0 && guidance.steps.length > 0;
    const nextSteps = adoptSteps
      ? guidance.steps.map((s) => ({ id: newId(), text: s.text, done: false }))
      : goal.steps;
    const nextGuidance: GoalGuidance = adoptSteps
      ? { ...guidance, steps: [] }
      : guidance;
    return {
      ...goal,
      guidance: nextGuidance,
      skills,
      steps: nextSteps,
      updatedAt: new Date().toISOString(),
    };
  };

  const runBreakdown = async (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal || !goal.title.trim() || busyId) return;

    setBusyId(goalId);
    setErrorIds((e) => {
      const { [goalId]: _drop, ...rest } = e;
      return rest;
    });

    let nextGoal: Goal | null = null;
    let usedFallback = false;

    try {
      const res = await fetch("/api/goals/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: goal.title, description: goal.description }),
        signal: AbortSignal.timeout(90_000),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "AI request failed");

      const plan = data.plan;
      const reasons = plan.skillReasons || {};
      const skills = (plan.skillIds as string[]).map((skillId) => ({
        skillId,
        reason: reasons[skillId] || "Recommended for this goal",
      }));
      const guidance: GoalGuidance = {
        source: "ai",
        generatedAt: new Date().toISOString(),
        summary: plan.summary || "",
        steps: plan.steps || [],
        obstacles: plan.obstacles,
        progressSignals: plan.progressSignals,
      };
      nextGoal = adoptGuidance(goal, guidance, skills);
    } catch {
      // Offline fallback: deterministic template + keyword skill matching.
      usedFallback = true;
      const guidance = offlineBreakdown(goal.title, goal.description);
      const matches = matchSkillsForGoal(goal.title, goal.description, 6);
      const skills = matches.map((m) => ({ skillId: m.skillId, reason: m.reason }));
      nextGoal = adoptGuidance(goal, guidance, skills);
    } finally {
      setBusyId(null);
    }

    if (nextGoal) {
      commit(goals.map((g) => (g.id === goalId ? nextGoal! : g)));
      setFallbackIds((prev) => {
        const next = new Set(prev);
        if (usedFallback) next.add(goalId);
        else next.delete(goalId);
        return next;
      });
    }
  };

  const addSuggestedStep = (goalId: string, index: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal?.guidance) return;
    const suggestion = goal.guidance.steps[index];
    if (!suggestion) return;
    updateGoal(goalId, {
      steps: [...goal.steps, { id: newId(), text: suggestion.text, done: false }],
      guidance: {
        ...goal.guidance,
        steps: goal.guidance.steps.filter((_, i) => i !== index),
      },
    });
  };

  const addAllSuggestedSteps = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal?.guidance) return;
    updateGoal(goalId, {
      steps: [
        ...goal.steps,
        ...goal.guidance.steps.map((s) => ({ id: newId(), text: s.text, done: false })),
      ],
      guidance: { ...goal.guidance, steps: [] },
    });
  };

  // ----- render helpers ----------------------------------------------------

  const moduleMeta = (moduleId: string) => MODULES.find((m) => m.id === moduleId);

  const renderSkillChip = (goalId: string, skillId: string, reason?: string) => {
    const skill: Skill | undefined = SKILLS.find((s) => s.id === skillId);
    if (!skill) return null;
    const mod = moduleMeta(skill.module);
    return (
      <div
        key={skillId}
        className="group/chip relative flex items-start gap-2 rounded-md border bg-muted/40 px-2.5 py-2 pr-7"
      >
        <button
          onClick={() => onViewSkill(skillId)}
          className="flex-1 min-w-0 text-left"
          title={`Open ${skill.name}`}
        >
          <div className="text-xs font-medium leading-tight hover:underline">
            {skill.name}
            {skill.acronym ? ` (${skill.acronym})` : ""}
          </div>
          <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            {reason || skill.oneLiner}
          </div>
          {mod && (
            <div className={cn("text-[10px] font-medium uppercase tracking-wide mt-1", mod.color)}>
              {mod.name.replace(" Skills", "")}
            </div>
          )}
        </button>
        <button
          onClick={() => removeSkill(goalId, skillId)}
          className="absolute right-1.5 top-1.5 rounded-sm p-0.5 text-muted-foreground hover:text-foreground hover:bg-background"
          aria-label={`Remove ${skill.name} suggestion`}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  };

  const renderGuidance = (goal: Goal) => {
    const g = goal.guidance;
    if (!g) return null;
    return (
      <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold">Breakdown</span>
          <Badge variant={g.source === "ai" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
            {g.source === "ai" ? "AI" : "Offline template"}
          </Badge>
          <span className="ml-auto text-[10px] text-muted-foreground">
            {format(new Date(g.generatedAt), "MMM d, h:mm a")}
          </span>
        </div>

        {g.summary && (
          <p className="text-sm italic text-muted-foreground leading-relaxed">{g.summary}</p>
        )}

        {g.obstacles && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Lightbulb className="h-3.5 w-3.5" />
              Watch out for
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{g.obstacles}</p>
          </div>
        )}

        {g.progressSignals && g.progressSignals.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              Signs of progress
            </div>
            <ul className="space-y-1">
              {g.progressSignals.map((sig, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="leading-snug">{sig}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {g.steps.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ListChecks className="h-3.5 w-3.5" />
                Suggested steps
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[11px] px-2"
                onClick={() => addAllSuggestedSteps(goal.id)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add all
              </Button>
            </div>
            <ul className="space-y-1">
              {g.steps.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-md border bg-background px-2 py-1.5"
                >
                  <button
                    onClick={() => addSuggestedStep(goal.id, i)}
                    className="mt-0.5 rounded-sm p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Add to checklist"
                    aria-label="Add to checklist"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <div className="min-w-0">
                    <div className="text-xs leading-snug">{s.text}</div>
                    {s.hint && (
                      <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">{s.hint}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderGoalCard = (goal: Goal, index: number) => {
    const doneCount = goal.steps.filter((s) => s.done).length;
    const progressPct = goal.steps.length > 0 ? (doneCount / goal.steps.length) * 100 : 0;
    const isBusy = busyId === goal.id;
    const fallback = fallbackIds.has(goal.id);
    const error = errorIds[goal.id];

    return (
      <Card key={goal.id} className="print:break-inside-avoid">
        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Title row */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-1.5">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <Input
                value={goal.title}
                onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                placeholder="Goal title — what are you working toward?"
                className="h-auto py-1.5 text-base font-semibold border-transparent bg-transparent px-2 -ml-2 hover:border-input focus:bg-background"
                aria-label={`Goal ${index + 1} title`}
              />
              <Textarea
                value={goal.description}
                onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                placeholder="What is this goal about? What makes it hard? The more you write, the better the breakdown and skill matches."
                rows={2}
                className="text-sm resize-none"
                aria-label={`Goal ${index + 1} description`}
              />
              <div className="flex items-start gap-2 pt-0.5">
                <CalendarDays className="h-4 w-4 text-muted-foreground mt-2 shrink-0" />
                <Input
                  value={goal.targetDate}
                  onChange={(e) => updateGoal(goal.id, { targetDate: e.target.value })}
                  placeholder="Target — e.g. review at my next group session"
                  className="h-8 text-xs bg-transparent"
                  aria-label={`Goal ${index + 1} target date`}
                />
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-muted-foreground mt-2.5 shrink-0" />
                <Textarea
                  value={goal.groupSupport}
                  onChange={(e) => updateGoal(goal.id, { groupSupport: e.target.value })}
                  placeholder="How can my group / therapist support me with this?"
                  rows={2}
                  className="text-xs resize-none border-dashed"
                  aria-label={`Goal ${index + 1} group support`}
                />
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0 print:hidden">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleExportGoalPdf(goal)}
                      aria-label={`Save goal ${index + 1} as PDF`}
                      disabled={!goal.title.trim() && !goal.description.trim() && goal.steps.length === 0}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save this goal as PDF</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    aria-label={`Delete goal ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete &quot;{goal.title.trim() || `Goal ${index + 1}`}&quot; along
                      with its steps and breakdown. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteGoal(goal.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Action row */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Button
              size="sm"
              onClick={() => void runBreakdown(goal.id)}
              disabled={isBusy || !goal.title.trim() || busyId !== null}
            >
              {isBusy ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Breaking it down…
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  {goal.guidance ? "Regenerate breakdown" : "Break it down"}
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => findSkillsOffline(goal.id)}
              disabled={isBusy}
              title="Instant offline skill matching — no AI"
            >
              <Compass className="h-3.5 w-3.5 mr-1.5" />
              Find matching skills
            </Button>
            {error && <span className="text-xs text-destructive">{error}</span>}
            {fallback && (
              <span className="text-xs text-muted-foreground">
                AI wasn&apos;t reachable — used the offline template instead.
              </span>
            )}
          </div>

          {/* Guidance */}
          {goal.guidance && renderGuidance(goal)}

          <Separator />

          {/* Steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Steps ({doneCount}/{goal.steps.length} done)
              </Label>
            </div>
            {goal.steps.length > 0 && <Progress value={progressPct} className="h-1.5" />}
            <ul className="space-y-1">
              {goal.steps.map((step) => (
                <li key={step.id} className="group/step flex items-start gap-2 rounded-md px-1 py-1 hover:bg-muted/50">
                  <Checkbox
                    checked={step.done}
                    onCheckedChange={(v) => toggleStep(goal.id, step.id, !!v)}
                    className="mt-0.5"
                    aria-label={`Mark step ${step.done ? "incomplete" : "complete"}`}
                  />
                  <span
                    className={cn(
                      "flex-1 text-sm leading-snug",
                      step.done && "line-through text-muted-foreground"
                    )}
                  >
                    {step.text}
                  </span>
                  <button
                    onClick={() => removeStep(goal.id, step.id)}
                    className="rounded-sm p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/step:opacity-100 print:hidden"
                    aria-label="Remove step"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 print:hidden">
              <Input
                value={stepDrafts[goal.id] ?? ""}
                onChange={(e) => setStepDrafts((d) => ({ ...d, [goal.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addStep(goal.id, stepDrafts[goal.id] ?? "");
                }}
                placeholder="Add a step…"
                className="h-8 text-xs"
                aria-label={`Add step to goal ${index + 1}`}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => addStep(goal.id, stepDrafts[goal.id] ?? "")}
                disabled={!(stepDrafts[goal.id] ?? "").trim()}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Skills */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Skills that can help ({goal.skills.length})
            </Label>
            {goal.skills.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {goal.skills.map((link) => renderSkillChip(goal.id, link.skillId, link.reason))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Run <span className="font-medium">Break it down</span> for AI suggestions, or{" "}
                <span className="font-medium">Find matching skills</span> for instant offline matches —
                both are editable. Click any skill to open its full reference page.
              </p>
            )}
          </div>

          {/* Updated stamp */}
          <p className="text-[10px] text-muted-foreground">
            Last edited {format(new Date(goal.updatedAt), "MMM d, h:mm a")}
          </p>
        </CardContent>
      </Card>
    );
  };

  if (!loaded) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-40 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Sticky action bar — hidden on print */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b print:hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Target className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider truncate">
              My Goals
              {goals.length > 0 && (
                <span className="ml-1.5 text-muted-foreground font-normal">({goals.length})</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              disabled={goals.length === 0}
              aria-label="Print goals"
            >
              <Printer className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Print</span>
            </Button>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportAllPdf}
                    disabled={
                      goals.length === 0 ||
                      !goals.some(
                        (g) => g.title.trim() || g.description.trim() || g.steps.length > 0
                      )
                    }
                    aria-label="Save all goals as PDF"
                  >
                    <FileDown className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">PDF</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download all goals as a formatted PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportJson}
                    disabled={goals.length === 0}
                    aria-label="Export goals as JSON backup"
                  >
                    <Download className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Backup</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export all goals as a JSON backup file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleImportClick}
                    disabled={goals.length >= MAX_GOALS}
                    aria-label="Import goals from JSON backup"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Restore</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Import goals from a JSON backup (skips duplicates)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {goals.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Clear all goals"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Clear all</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all goals?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes every goal, step and breakdown. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear all
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Print-only header */}
        <div className="hidden print:block mb-6 pb-3 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Target className="h-5 w-5" />
            My Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {goals.length} goal{goals.length === 1 ? "" : "s"} · Printed {new Date().toLocaleString()}
          </p>
        </div>

        {/* Header */}
        <div className="print:hidden">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6" />
            My Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Track up to {MAX_GOALS} goals you&apos;re working on. Break each one into small
            steps and see which skills from this app can help.
          </p>
        </div>

        {/* Import result banner — mirrors the worksheets list pattern */}
        {importResult && (
          <div
            className={cn(
              "print:hidden rounded-md border p-2.5 text-xs",
              importResult.success
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            )}
          >
            {importResult.success ? (
              <>
                Imported {importResult.imported} goal{importResult.imported === 1 ? "" : "s"}
                {importResult.skipped > 0 &&
                  `, skipped ${importResult.skipped} duplicate or empty ${importResult.skipped === 1 ? "entry" : "entries"}`}.
              </>
            ) : (
              <>Import failed: {importResult.error}</>
            )}
            <button
              className="ml-2 underline"
              onClick={() => setImportResult(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Empty state */}
        {goals.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center space-y-2">
              <div className="mx-auto w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold">No goals yet</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                Add up to {MAX_GOALS} goals you&apos;re working on right now. For each one, the
                app can break it into small, doable steps and suggest skills from this app that
                might help. Everything stays on this device, and you can edit or clear it any time.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Goal slots */}
        {goals.map((goal, i) => renderGoalCard(goal, i))}

        {goals.length < MAX_GOALS && (
          <button
            onClick={addGoal}
            className="w-full rounded-lg border border-dashed p-6 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors print:hidden"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">
              Add goal {goals.length === 0 ? "" : `(${goals.length} of ${MAX_GOALS})`}
            </span>
            <span className="text-xs">Name what you&apos;re working toward — the app helps with the rest</span>
          </button>
        )}

        {goals.length >= MAX_GOALS && (
          <p className="text-center text-xs text-muted-foreground print:hidden">
            All {MAX_GOALS} goal slots are in use — delete or finish one to add another.
          </p>
        )}

        {/* Footnote */}
        <p className="text-[11px] text-muted-foreground leading-relaxed border-t pt-3">
          Breakdowns use AI and are matched against the {SKILLS.length} skills in this app; skill
          suggestions are editable and skill pages open with a click. Your goals stay on this
          device (like Session Prep). This tool supports — never replaces — your work with your
          therapist and group.
        </p>
      </div>
    </div>
  );
}
