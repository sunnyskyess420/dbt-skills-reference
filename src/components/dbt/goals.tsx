"use client";

import * as React from "react";
import { SKILLS, MODULES, type Skill } from "@/data/skills";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  Plus,
  X,
  Trash2,
  Compass,
  Users,
  CalendarDays,
  Printer,
  FileDown,
  Download,
  Upload,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  type Goal,
  loadGoals,
  saveGoals,
  emptyGoal,
  newId,
  matchSkillsForGoal,
  recordGoalTombstones,
  MAX_GOALS,
} from "@/lib/goals-storage";
import { exportGoalToPdf, exportAllGoalsToPdf } from "@/lib/goals-pdf";
import {
  downloadGoalsJsonBackup,
  importGoalsFromJson,
  type GoalsImportResult,
} from "@/lib/goals-export";
import {
  shouldShowGoalsReminder,
  markGoalsReminderShown,
  dismissGoalsReminder,
  markGoalsExported,
  getGoalsReminderInterval,
} from "@/lib/goals-backup-reminder";
import { toast } from "@/hooks/use-toast";
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
  const [errorIds, setErrorIds] = React.useState<Record<string, string>>({});
  const [stepDrafts, setStepDrafts] = React.useState<Record<string, string>>({});
  const [supportDrafts, setSupportDrafts] = React.useState<Record<string, string>>({});
  const [importResult, setImportResult] = React.useState<GoalsImportResult | null>(null);
  const [savedFlash, setSavedFlash] = React.useState(false);
  const [showBackupReminder, setShowBackupReminder] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load on first mount. The section starts empty — users add their own
  // goals. (loadGoals also wipes any leftover auto-seeded example data.)
  React.useEffect(() => {
    const loaded = loadGoals() ?? [];
    setGoals(loaded);
    setLoaded(true);
    // Re-evaluate the backup reminder whenever goals change between sessions.
    if (shouldShowGoalsReminder(loaded.length)) {
      setShowBackupReminder(true);
    }
  }, []);

  // Track the latest updatedAt across all goals — when it changes, flash "Saved ✓".
  // The flash only fires after a save that ACTUALLY succeeded (see saveOkRef in
  // commit): previously it flashed on any state change, so it appeared even when
  // the localStorage write failed — the exact "green checkmark but nothing saved"
  // report. lastSavedRef still guards against flashing on hydration/restore.
  const lastSavedRef = React.useRef<string>("");
  const saveOkRef = React.useRef(false);
  React.useEffect(() => {
    if (goals.length === 0) return;
    // Find the latest updatedAt without using Array.prototype.at(), which
    // isn't supported on older browsers (Safari <15.4, some mobile webviews).
    let latest = "";
    for (const g of goals) {
      if (g.updatedAt > latest) latest = g.updatedAt;
    }
    if (!latest) return;
    if (latest !== lastSavedRef.current) {
      const isFirstHydration = lastSavedRef.current === "";
      lastSavedRef.current = latest;
      // Don't flash on hydration/restore, and never flash for a failed write.
      if (!isFirstHydration && saveOkRef.current) {
        setSavedFlash(true);
        const t = setTimeout(() => setSavedFlash(false), 1200);
        return () => clearTimeout(t);
      }
    }
  }, [goals]);

  // Re-read storage after a cloud sync restore (sign-in, account switch,
  // manual "Sync now") or when another tab edits goals — otherwise this
  // component kept showing its pre-restore in-memory copy until a full reload.
  React.useEffect(() => {
    const reloadFromStorage = () => {
      const fresh = loadGoals() ?? [];
      setGoals(fresh);
      // Reset the flash baseline so restoring doesn't look like a fresh save.
      let latest = "";
      for (const g of fresh) {
        if (g.updatedAt > latest) latest = g.updatedAt;
      }
      if (latest) lastSavedRef.current = latest;
      saveOkRef.current = false;
    };
    window.addEventListener("dbt-sync-restored", reloadFromStorage);
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "dbt-skills:goals") reloadFromStorage();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("dbt-sync-restored", reloadFromStorage);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const commit = React.useCallback((next: Goal[]) => {
    setGoals(next);
    const res = saveGoals(next);
    saveOkRef.current = res.ok; // the "Saved ✓" flash only fires when this is true
    if (!res.ok) {
      // Surface save failures so users know their data didn't persist —
      // previously these were silently swallowed.
      const reason =
        res.error === "quota"
          ? "Browser storage is full. Try deleting unused worksheets, or export a backup and clear old data."
          : res.error === "private-mode"
          ? "Browser storage is blocked (private mode or cookies disabled). Your goals won't persist."
          : "Goals could not be saved — browser storage is unavailable.";
      toast({
        title: "Couldn't save your goals",
        description: reason,
        variant: "destructive",
      });
    }
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
    const next = [...goals, emptyGoal()];
    commit(next);
    // Check whether the new goal count should trigger a backup reminder.
    if (shouldShowGoalsReminder(next.length)) {
      setShowBackupReminder(true);
      markGoalsReminderShown(next.length);
    }
  };

  const deleteGoal = (id: string) => {
    // Tombstone the deletion first so a later sync merge (pull from the
    // server, merge across devices) can't resurrect this goal from a stale
    // server-side copy.
    recordGoalTombstones([id]);
    commit(goals.filter((g) => g.id !== id));
  };

  const clearAll = () => {
    // Tombstone every existing goal — same resurrection guard as deleteGoal.
    recordGoalTombstones(goals.map((g) => g.id));
    commit([]);
    // Clearing all goals effectively resets the reminder counter — a user who
    // wipes everything doesn't need to be nagged about backups for stale data.
    markGoalsExported(0);
    setShowBackupReminder(false);
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
    // A successful export resets the reminder counter (mirrors the worksheets pattern).
    markGoalsExported(goals.length);
    setShowBackupReminder(false);
    toast({
      title: "Backup downloaded",
      description: `Exported ${goals.length} goal${goals.length === 1 ? "" : "s"} to dbt-goals-backup.json`,
    });
  };

  const handleDismissReminder = () => {
    dismissGoalsReminder(goals.length);
    setShowBackupReminder(false);
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
      const refreshed = loadGoals() ?? [];
      setGoals(refreshed);
      // An import is functionally a backup restore — reset the reminder counter.
      markGoalsExported(refreshed.length);
      setShowBackupReminder(false);
      // Reset the saved-flash baseline so we don't flash on this hydration.
      let latest = "";
      for (const g of refreshed) {
        if (g.updatedAt > latest) latest = g.updatedAt;
      }
      if (latest) lastSavedRef.current = latest;
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

  // ----- support entries ("how my group / therapist can help") ------------

  const addSupportItem = (goalId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, { groupSupport: [...goal.groupSupport, trimmed] });
    setSupportDrafts((d) => ({ ...d, [goalId]: "" }));
  };

  const updateSupportItem = (goalId: string, index: number, text: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, {
      groupSupport: goal.groupSupport.map((item, i) => (i === index ? text : item)),
    });
  };

  const removeSupportItem = (goalId: string, index: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, {
      groupSupport: goal.groupSupport.filter((_, i) => i !== index),
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

  const renderGoalCard = (goal: Goal, index: number) => {
    const doneCount = goal.steps.filter((s) => s.done).length;
    const progressPct = goal.steps.length > 0 ? (doneCount / goal.steps.length) * 100 : 0;
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
                placeholder="What is this goal about? What makes it hard? The more you write, the better the skill matches."
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
                <Users className="h-4 w-4 text-muted-foreground mt-2 shrink-0" />
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Support requests as individual bullet entries — one
                      editable item per line, add/remove at will. Replaces the
                      old single free-text box. */}
                  {goal.groupSupport.map((item, i) => (
                    <div
                      key={i}
                      className="group/support flex items-center gap-1.5"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 shrink-0"
                        aria-hidden
                      />
                      <Input
                        value={item}
                        onChange={(e) => updateSupportItem(goal.id, i, e.target.value)}
                        placeholder="Support entry…"
                        className="h-8 text-xs border-dashed bg-transparent"
                        aria-label={`Goal ${index + 1} support entry ${i + 1}`}
                      />
                      <button
                        onClick={() => removeSupportItem(goal.id, i)}
                        className="rounded-sm p-1 text-muted-foreground hover:text-foreground shrink-0"
                        aria-label={`Remove support entry ${i + 1}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      value={supportDrafts[goal.id] ?? ""}
                      onChange={(e) =>
                        setSupportDrafts((d) => ({ ...d, [goal.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addSupportItem(goal.id, supportDrafts[goal.id] ?? "");
                      }}
                      placeholder="How can my group / therapist support me? Add an entry…"
                      className="h-8 text-xs border-dashed"
                      aria-label={`Add support entry to goal ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 shrink-0"
                      onClick={() => addSupportItem(goal.id, supportDrafts[goal.id] ?? "")}
                      disabled={!(supportDrafts[goal.id] ?? "").trim()}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {goal.groupSupport.length === 0 && (
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Each entry is its own bullet — e.g. “check in on how exposure homework
                      went” or “text me the morning of”. Press Enter to add.
                    </p>
                  )}
                </div>
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
                      with its steps and saved skills. This action cannot be undone.
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
              variant="outline"
              onClick={() => findSkillsOffline(goal.id)}
              title="Instant skill matching — runs on your device"
            >
              <Compass className="h-3.5 w-3.5 mr-1.5" />
              Find matching skills
            </Button>
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>

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
                Use <span className="font-medium">Find matching skills</span> for instant,
                editable matches — they run on your device. Click any skill to open its full
                reference page.
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
            </span>
            {savedFlash && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 shrink-0">
                <Check className="h-3 w-3" />
                Saved
              </span>
            )}
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
                      This removes every goal, step and saved skill. This action cannot be undone.
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

        {/* Auto-backup reminder — fires every N new goals. Mirrors the
            worksheets list's amber backup-reminder banner. */}
        {showBackupReminder && goals.length > 0 && (
          <div className="print:hidden rounded-md border border-amber-500/50 bg-amber-500/10 p-2.5 text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-start gap-1.5">
              <span className="text-base leading-none mt-0.5" aria-hidden>⚠</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Back up your goals</p>
                <p className="mt-0.5">
                  You now have {goals.length} goal{goals.length === 1 ? "" : "s"}. If your browser
                  data is cleared, you&apos;ll lose them. Export a JSON backup now so you can
                  restore them later.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[11px] px-2 border-amber-500/50 hover:bg-amber-500/20"
                    onClick={handleExportJson}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Backup now
                  </Button>
                  <button
                    className="underline text-[11px]"
                    onClick={handleDismissReminder}
                  >
                    Remind me later
                  </button>
                </div>
                <p className="text-[10px] mt-1.5 opacity-70">
                  Next reminder after {getGoalsReminderInterval()} more new goal{getGoalsReminderInterval() === 1 ? "" : "s"}.
                </p>
              </div>
            </div>
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
                Add up to {MAX_GOALS} goals you&apos;re working on right now. For each one, list
                your own small, doable steps and match skills from this app that might help.
                Everything stays on this device, and you can edit or clear it any time.
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
            <span className="text-xs">Name what you&apos;re working toward — add steps, support requests and skills</span>
          </button>
        )}

        {goals.length >= MAX_GOALS && (
          <p className="text-center text-xs text-muted-foreground print:hidden">
            All {MAX_GOALS} goal slots are in use — delete or finish one to add another.
          </p>
        )}

        {/* Footnote */}
        <p className="text-[11px] text-muted-foreground leading-relaxed border-t pt-3">
          Skill suggestions are matched on your device against the {SKILLS.length} skills in this
          app — no AI service, no waiting. Suggestions are editable and skill pages open with a
          click. Your goals stay on this device, and signed-in accounts back them up automatically
          through cloud sync. This tool supports — never replaces — your work with your therapist
          and group.
        </p>
      </div>
    </div>
  );
}
