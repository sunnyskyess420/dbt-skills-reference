"use client";

// SMART Goals — a structured goal section that sits beside My Goals.
//
// My Goals answers "what am I working toward?"; this answers the harder
// questions: is it specific enough to act on, how will I know it moved, is
// it realistic, why does it matter, and by when — and then it keeps a dated
// record of every check-in so progress is visible instead of remembered.

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
import {
  Crosshair,
  Plus,
  X,
  Trash2,
  Printer,
  FileDown,
  Download,
  Upload,
  Check,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Compass,
  Users,
  TrendingUp,
  Activity,
  RotateCcw,
  Flag,
  Pause,
  Play,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { newId } from "@/lib/goals-storage";
import {
  type SmartGoal,
  type ReviewCadence,
  loadSmartGoals,
  saveSmartGoals,
  emptySmartGoal,
  recordSmartGoalTombstones,
  smartChecks,
  progressFor,
  matchSkillsForSmartGoal,
  reviewDueInDays,
  daysUntilDeadline,
  isValidDateString,
  lastCheckIn,
  withCheckIn,
  MAX_SMART_GOALS,
} from "@/lib/smart-goals-storage";
import {
  downloadSmartGoalsJsonBackup,
  importSmartGoalsFromJson,
  type SmartGoalsImportResult,
} from "@/lib/smart-goals-export";

interface Props {
  /** Open a skill's reference page from a suggestion chip. */
  onViewSkill: (skillId: string) => void;
}

const CADENCES: { id: ReviewCadence; label: string }[] = [
  { id: "weekly", label: "Weekly" },
  { id: "session", label: "Each session" },
  { id: "monthly", label: "Monthly" },
];

const SMART_LEGEND: { key: string; label: string; text: string }[] = [
  { key: "S", label: "Specific", text: "One clear action, not a wish." },
  { key: "M", label: "Measurable", text: "A number you can read off." },
  { key: "A", label: "Achievable", text: "Steps you can actually take." },
  { key: "R", label: "Relevant", text: "Tied to what you care about." },
  { key: "T", label: "Time-bound", text: "A real date to review it." },
];

export function SmartGoals({ onViewSkill }: Props) {
  const [goals, setGoals] = React.useState<SmartGoal[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set());
  const [matchErrors, setMatchErrors] = React.useState<Record<string, string>>({});
  const [importResult, setImportResult] = React.useState<SmartGoalsImportResult | null>(null);
  const [savedFlash, setSavedFlash] = React.useState(false);
  const [showArchive, setShowArchive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const flashTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    setGoals(loadSmartGoals() ?? []);
    setLoaded(true);
  }, []);

  // Another tab, or a cloud-sync restore, rewrote storage. Re-read so this
  // section never shows a pre-restore copy.
  React.useEffect(() => {
    const reload = () => setGoals(loadSmartGoals() ?? []);
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "dbt-skills:smart-goals") reload();
    };
    window.addEventListener("dbt-sync-restored", reload);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("dbt-sync-restored", reload);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
    };
  }, []);

  const flashSaved = React.useCallback(() => {
    setSavedFlash(true);
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setSavedFlash(false), 1200);
  }, []);

  const commit = React.useCallback(
    (next: SmartGoal[]) => {
      setGoals(next);
      const res = saveSmartGoals(next);
      if (res.ok) {
        flashSaved();
      } else {
        const reason =
          res.error === "quota"
            ? "Browser storage is full. Export a backup, then delete an old goal or worksheet."
            : res.error === "private-mode"
            ? "Browser storage is blocked (private mode or cookies disabled), so goals won't persist."
            : "Goals could not be saved — browser storage is unavailable.";
        toast({ title: "Couldn't save your goal", description: reason, variant: "destructive" });
      }
    },
    [flashSaved]
  );

  const updateGoal = React.useCallback(
    (id: string, patch: Partial<SmartGoal>) => {
      commit(
        goals.map((g) =>
          g.id === id ? { ...g, ...patch, updatedAt: new Date().toISOString() } : g
        )
      );
    },
    [goals, commit]
  );

  const activeGoals = goals.filter((g) => g.status !== "done");
  const archivedGoals = goals.filter((g) => g.status === "done");

  const addGoal = () => {
    if (activeGoals.length >= MAX_SMART_GOALS) return;
    const goal = emptySmartGoal();
    commit([...goals, goal]);
    setOpenIds((s) => new Set(s).add(goal.id));
  };

  const deleteGoal = (id: string) => {
    recordSmartGoalTombstones([id]);
    commit(goals.filter((g) => g.id !== id));
  };

  const toggleOpen = (id: string) => {
    setOpenIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setStatus = (goal: SmartGoal, status: SmartGoal["status"]) => {
    updateGoal(goal.id, {
      status,
      completedAt: status === "done" ? new Date().toISOString() : null,
    });
    if (status === "done") {
      setOpenIds((s) => {
        const next = new Set(s);
        next.delete(goal.id);
        return next;
      });
    }
  };

  const findSkills = (goal: SmartGoal) => {
    const matches = matchSkillsForSmartGoal(goal, 6);
    if (matches.length === 0) {
      setMatchErrors((e) => ({
        ...e,
        [goal.id]: "No keyword matches yet — add more words about what the goal involves.",
      }));
      return;
    }
    setMatchErrors((e) => {
      const { [goal.id]: _drop, ...rest } = e;
      return rest;
    });
    updateGoal(goal.id, {
      skills: matches.map((m) => ({ skillId: m.skillId, reason: m.reason })),
    });
  };

  const removeSkill = (goal: SmartGoal, skillId: string) => {
    updateGoal(goal.id, { skills: goal.skills.filter((s) => s.skillId !== skillId) });
  };

  // ----- print / pdf / backup ------------------------------------------------

  const handleExportAllPdf = async () => {
    if (goals.length === 0) return;
    const { exportAllSmartGoalsToPdf } = await import("@/lib/smart-goals-pdf");
    exportAllSmartGoalsToPdf(goals);
  };

  const handleExportGoalPdf = async (goal: SmartGoal) => {
    const { exportSmartGoalToPdf } = await import("@/lib/smart-goals-pdf");
    exportSmartGoalToPdf(goal);
  };

  const handleExportJson = () => {
    downloadSmartGoalsJsonBackup();
    toast({
      title: "Backup downloaded",
      description: `Exported ${goals.length} goal${goals.length === 1 ? "" : "s"} to dbt-smart-goals-backup.json`,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importSmartGoalsFromJson(text);
    setImportResult(result);
    if (result.success && result.imported > 0) {
      setGoals(loadSmartGoals() ?? []);
    }
    e.target.value = "";
  };

  // ----- render --------------------------------------------------------------

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
      {/* Sticky action bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b print:hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Crosshair className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider truncate">
              SMART Goals
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
              size="sm"
              variant="ghost"
              onClick={() => window.print()}
              disabled={goals.length === 0}
              aria-label="Print SMART goals"
            >
              <Printer className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Print</span>
            </Button>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleExportAllPdf}
                    disabled={goals.length === 0}
                    aria-label="Save all SMART goals as PDF"
                  >
                    <FileDown className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">PDF</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download every goal and its check-in record as a PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleExportJson}
                    disabled={goals.length === 0}
                    aria-label="Export SMART goals as JSON backup"
                  >
                    <Download className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Backup</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export all SMART goals as a JSON backup</TooltipContent>
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
                    size="sm"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Import SMART goals from JSON backup"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Restore</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import goals from a JSON backup (skips duplicates)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Print-only header */}
        <div className="hidden print:block mb-6 pb-3 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Crosshair className="h-5 w-5" />
            SMART Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {goals.length} goal{goals.length === 1 ? "" : "s"} · Printed{" "}
            {new Date().toLocaleString()}
          </p>
        </div>

        <div className="print:hidden">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Crosshair className="h-6 w-6" />
            SMART Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Write a goal you can actually work: specific, measurable, achievable, relevant and
            time-bound. Plan the steps, log check-ins as you go, and keep a record you can bring
            to session.
          </p>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 print:hidden">
          {SMART_LEGEND.map((l) => (
            <div key={l.key} className="rounded-md border bg-muted/30 px-2 py-1.5">
              <div className="text-[11px] font-bold text-primary">{l.key}</div>
              <div className="text-[11px] font-medium leading-tight">{l.label}</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                {l.text}
              </div>
            </div>
          ))}
        </div>

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
                  `, skipped ${importResult.skipped} duplicate or empty ${importResult.skipped === 1 ? "entry" : "entries"}`}
                .
              </>
            ) : (
              <>Import failed: {importResult.error}</>
            )}
            <button className="ml-2 underline" onClick={() => setImportResult(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Empty state */}
        {goals.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center space-y-2">
              <div className="mx-auto w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                <Crosshair className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold">No SMART goals yet</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                Start with one thing you want to change, then make it measurable. For example:
                &ldquo;Walk outside alone 3 times a week, for 20 minutes, starting at my front
                door&rdquo; — with a target of 12 walks by the end of next month.
              </p>
            </CardContent>
          </Card>
        )}

        {activeGoals.map((goal, i) => renderGoalCard(goal, i))}

        {activeGoals.length < MAX_SMART_GOALS && (
          <button
            onClick={addGoal}
            className="w-full rounded-lg border border-dashed p-6 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors print:hidden"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">
              Add a SMART goal{goals.length === 0 ? "" : ` (${activeGoals.length} of ${MAX_SMART_GOALS})`}
            </span>
            <span className="text-xs">
              Name it, make it measurable, give it a date — then break it into steps
            </span>
          </button>
        )}

        {activeGoals.length >= MAX_SMART_GOALS && (
          <p className="text-center text-xs text-muted-foreground print:hidden">
            All {MAX_SMART_GOALS} active slots are in use — complete or delete one to add another.
            Completed goals move to the record below.
          </p>
        )}

        {/* Completed archive */}
        {archivedGoals.length > 0 && (
          <div className="print:break-inside-avoid rounded-lg border">
            <button
              onClick={() => setShowArchive((v) => !v)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-muted/40 rounded-lg print:hidden"
            >
              {showArchive ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium flex-1">
                Completed goals — your record ({archivedGoals.length})
              </span>
              <Flag className="h-4 w-4 text-emerald-600" />
            </button>
            <div className={cn("px-3 pb-3 space-y-2", !showArchive && "hidden print:block")}>
              {archivedGoals.map((goal) => {
                const progress = progressFor(goal);
                return (
                  <div
                    key={goal.id}
                    className="rounded-md border bg-muted/20 px-3 py-2 space-y-1"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium leading-snug">
                          {goal.title.trim() || "Untitled goal"}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {goal.completedAt
                            ? `Completed ${format(new Date(goal.completedAt), "MMM d, yyyy")}`
                            : "Completed"}
                          {progress.mode !== "none" && ` · ${progress.label}`}
                          {goal.checkIns.length > 0 &&
                            ` · ${goal.checkIns.length} check-in${goal.checkIns.length === 1 ? "" : "s"}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0 print:hidden">
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground"
                                onClick={() => setStatus(goal, "active")}
                                aria-label="Reopen this goal"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reopen</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground"
                          onClick={() => handleExportGoalPdf(goal)}
                          aria-label="Save this goal as PDF"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              aria-label="Delete this completed goal"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently deletes &ldquo;{goal.title.trim() || "Untitled goal"}
                                &rdquo; and its check-ins. Export a PDF first if you want to keep it.
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
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground leading-relaxed border-t pt-3">
          Everything stays on this device unless you sign in, which backs goals up through cloud
          sync. Skill suggestions are matched on-device against the {SKILLS.length} skills in this
          app. This tool supports — never replaces — your work with your therapist and group.
        </p>
      </div>
    </div>
  );

  // ----- one goal card -------------------------------------------------------

  function renderGoalCard(goal: SmartGoal, index: number) {
    const checks = smartChecks(goal);
    const score = checks.filter((c) => c.done).length;
    const progress = progressFor(goal);
    const open = openIds.has(goal.id);
    const dueIn = reviewDueInDays(goal);
    const daysLeft = daysUntilDeadline(goal);
    const error = matchErrors[goal.id];
    const latest = lastCheckIn(goal);

    return (
      <Card key={goal.id} className="print:break-inside-avoid">
        {/* Collapsed header — always visible */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <button
              onClick={() => toggleOpen(goal.id)}
              className="flex items-start gap-3 flex-1 min-w-0 text-left"
              aria-expanded={open}
              aria-label={open ? "Collapse goal" : "Expand goal"}
            >
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="text-base font-semibold leading-snug break-words">
                  {goal.title.trim() || "Untitled SMART goal"}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {checks.map((c) => (
                    <span
                      key={c.key}
                      title={`${c.label}: ${c.done ? "done" : c.hint}`}
                      className={cn(
                        "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold border",
                        c.done
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "border-dashed text-muted-foreground"
                      )}
                    >
                      {c.done ? <Check className="h-2.5 w-2.5" /> : null}
                      {c.key}
                    </span>
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-1">{score}/5</span>
                  {goal.status === "paused" && (
                    <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 ml-1">
                      Paused
                    </span>
                  )}
                </div>
                {progress.mode !== "none" && (
                  <div className="space-y-1 pt-0.5">
                    <Progress value={progress.pct} className="h-1.5" />
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground/80">{progress.label}</span>
                      {isValidDateString(goal.deadline) && daysLeft !== null && (
                        <span
                          className={cn(
                            daysLeft < 0 && "text-rose-600 dark:text-rose-400 font-medium",
                            daysLeft >= 0 && daysLeft <= 7 && "text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {daysLeft < 0
                            ? `overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"}`
                            : daysLeft === 0
                            ? "due today"
                            : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
                        </span>
                      )}
                      {dueIn > 0 && goal.status !== "done" && (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          check-in due
                        </span>
                      )}
                      {latest && (
                        <span>
                          last check-in {format(new Date(latest.at), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {open ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              )}
            </button>

            <div className="flex items-center gap-0.5 shrink-0 print:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleExportGoalPdf(goal)}
                aria-label="Save this goal as PDF"
              >
                <FileDown className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    aria-label="Delete goal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently deletes &ldquo;{goal.title.trim() || `Goal ${index + 1}`}
                      &rdquo;, its steps and its check-in record. Export a PDF first if you want
                      to keep the record.
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
        </div>

        {!open && <div className="hidden print:block px-4 sm:px-5 pb-4">{renderPrintBody(goal)}</div>}

        {open && (
          <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
            <Separator />

            <Input
              value={goal.title}
              onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
              placeholder="Goal in one sentence — start with a verb"
              className="h-auto py-1.5 text-base font-semibold border-transparent bg-transparent px-2 -ml-2 hover:border-input focus:bg-background"
              aria-label={`Goal ${index + 1} title`}
            />

            {/* S — specific */}
            <Field label="S · Specific" hint="What exactly will you do, where, with whom, how often?">
              <Textarea
                value={goal.specific}
                onChange={(e) => updateGoal(goal.id, { specific: e.target.value })}
                placeholder="e.g. Walk outside alone for 20 minutes, three mornings a week, starting from my front door."
                rows={2}
                className="text-sm resize-none"
              />
            </Field>

            {/* M — measurable */}
            <Field label="M · Measurable" hint="Name what you count, then set a target.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  value={goal.measureName}
                  onChange={(e) => updateGoal(goal.id, { measureName: e.target.value })}
                  placeholder="What you count — e.g. walks outside"
                  className="h-8 text-xs"
                  aria-label="Measure name"
                />
                <Input
                  value={goal.measureUnit}
                  onChange={(e) => updateGoal(goal.id, { measureUnit: e.target.value })}
                  placeholder="Unit — e.g. per week"
                  className="h-8 text-xs"
                  aria-label="Measure unit"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <NumberField
                  label="Start"
                  value={goal.baseline}
                  onChange={(v) =>
                    updateGoal(goal.id, {
                      baseline: v,
                      // Seed "current" from the starting point so the bar has a floor.
                      current: goal.current === null ? v : goal.current,
                    })
                  }
                />
                <NumberField
                  label="Now"
                  value={goal.current}
                  onChange={(v) => updateGoal(goal.id, { current: v })}
                />
                <NumberField
                  label="Target"
                  value={goal.target}
                  onChange={(v) =>
                    updateGoal(goal.id, {
                      target: v,
                      current: goal.current === null ? goal.baseline : goal.current,
                    })
                  }
                />
              </div>
              <div className="space-y-1 pt-0.5">
                <Progress value={progress.pct} className="h-1.5" />
                <div className="text-[11px] text-muted-foreground">
                  {progress.mode === "measure"
                    ? `${progress.label} · ${progress.pct}% of the way`
                    : "Set start, now and target to track a number."}
                </div>
              </div>
            </Field>

            {/* A — achievable */}
            <Field label="A · Achievable" hint="How confident are you that you can do this?">
              <ConfidencePicker
                value={goal.confidence}
                onChange={(v) => updateGoal(goal.id, { confidence: v })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <BulletList
                  label="Obstacles"
                  placeholder="What could get in the way?"
                  items={goal.obstacles}
                  onChange={(items) => updateGoal(goal.id, { obstacles: items })}
                />
                <BulletList
                  label="Supports"
                  placeholder="Who or what makes this possible?"
                  items={goal.supports}
                  onChange={(items) => updateGoal(goal.id, { supports: items })}
                />
              </div>
            </Field>

            {/* R — relevant */}
            <Field label="R · Relevant" hint="Why does this matter right now?">
              <Textarea
                value={goal.why}
                onChange={(e) => updateGoal(goal.id, { why: e.target.value })}
                placeholder="e.g. I want to feel less trapped at home, and being outside is where I feel most like myself."
                rows={2}
                className="text-sm resize-none"
              />
              <Input
                value={goal.value}
                onChange={(e) => updateGoal(goal.id, { value: e.target.value })}
                placeholder="Value or life area — e.g. health, relationships, work"
                className="h-8 text-xs"
                aria-label="Value or life area"
              />
            </Field>

            {/* T — time-bound */}
            <Field label="T · Time-bound" hint="A real date, and how often you'll review.">
              <div className="flex flex-wrap items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  type="date"
                  value={goal.deadline}
                  onChange={(e) => updateGoal(goal.id, { deadline: e.target.value })}
                  className="h-8 text-xs w-auto"
                  aria-label="Deadline"
                />
                <div className="flex items-center gap-1">
                  {CADENCES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateGoal(goal.id, { reviewCadence: c.id })}
                      className={cn(
                        "rounded px-2 py-1 text-[11px] border transition-colors",
                        goal.reviewCadence === c.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                      aria-pressed={goal.reviewCadence === c.id}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </Field>

            <Separator />

            {/* Plan — steps */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Plan · steps ({goal.steps.filter((s) => s.done).length}/{goal.steps.length})
              </Label>
              {goal.steps.length > 0 && (
                <Progress
                  value={Math.round(
                    (goal.steps.filter((s) => s.done).length / goal.steps.length) * 100
                  )}
                  className="h-1.5"
                />
              )}
              <ul className="space-y-1">
                {goal.steps.map((step) => (
                  <li
                    key={step.id}
                    className="group/step flex items-start gap-2 rounded-md px-1 py-1 hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={step.done}
                      onCheckedChange={(v) =>
                        updateGoal(goal.id, {
                          steps: goal.steps.map((s) =>
                            s.id === step.id ? { ...s, done: !!v } : s
                          ),
                        })
                      }
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
                      onClick={() =>
                        updateGoal(goal.id, {
                          steps: goal.steps.filter((s) => s.id !== step.id),
                        })
                      }
                      className="rounded-sm p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/step:opacity-100 print:hidden"
                      aria-label="Remove step"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <AddRow
                placeholder="Add a small next step…"
                addLabel="Add step"
                onAdd={(text) =>
                  updateGoal(goal.id, {
                    steps: [...goal.steps, { id: newId(), text, done: false }],
                  })
                }
              />
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Skills that can help ({goal.skills.length})
                </Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => findSkills(goal)}
                  title="Instant skill matching — runs on your device"
                >
                  <Compass className="h-3.5 w-3.5 mr-1.5" />
                  Find matching skills
                </Button>
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              {goal.skills.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {goal.skills.map((link) => {
                    const skill: Skill | undefined = SKILLS.find((s) => s.id === link.skillId);
                    if (!skill) return null;
                    const mod = MODULES.find((m) => m.id === skill.module);
                    return (
                      <div
                        key={link.skillId}
                        className="group/chip relative flex items-start gap-2 rounded-md border bg-muted/40 px-2.5 py-2 pr-7"
                      >
                        <button
                          onClick={() => onViewSkill(link.skillId)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <div className="text-xs font-medium leading-tight hover:underline">
                            {skill.name}
                            {skill.acronym ? ` (${skill.acronym})` : ""}
                          </div>
                          <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                            {link.reason || skill.oneLiner}
                          </div>
                          {mod && (
                            <div
                              className={cn(
                                "text-[10px] font-medium uppercase tracking-wide mt-1",
                                mod.color
                              )}
                            >
                              {mod.name.replace(" Skills", "")}
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => removeSkill(goal, link.skillId)}
                          className="absolute right-1.5 top-1.5 rounded-sm p-0.5 text-muted-foreground hover:text-foreground hover:bg-background"
                          aria-label={`Remove ${skill.name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use <span className="font-medium">Find matching skills</span> for instant,
                  editable suggestions — matched on this device. Click any skill to read it.
                </p>
              )}
            </div>

            <Separator />

            {/* Record — check-ins */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Record · check-ins ({goal.checkIns.length})
                </Label>
              </div>
              <CheckInComposer
                goal={goal}
                onLog={(entry) => updateGoal(goal.id, withCheckIn(goal, entry))}
              />
              {goal.checkIns.length > 0 ? (
                <ul className="space-y-1 pt-1">
                  {[...goal.checkIns].reverse().map((c) => (
                    <li
                      key={c.id}
                      className="group/ci flex items-start gap-2 rounded-md border bg-muted/20 px-2 py-1.5"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-muted-foreground">
                          {format(new Date(c.at), "MMM d, yyyy · h:mm a")}
                          {c.confidence !== null && ` · confidence ${c.confidence}/5`}
                          {c.value !== null && (
                            <span className="font-medium text-foreground/80">
                              {" "}
                              · {c.value}
                              {goal.measureUnit.trim() ? ` ${goal.measureUnit.trim()}` : ""}
                            </span>
                          )}
                        </div>
                        {c.note && (
                          <div className="text-xs leading-snug mt-0.5 whitespace-pre-wrap break-words">
                            {c.note}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          updateGoal(goal.id, {
                            checkIns: goal.checkIns.filter((x) => x.id !== c.id),
                          })
                        }
                        className="rounded-sm p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/ci:opacity-100 print:hidden"
                        aria-label="Remove check-in"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Log a check-in whenever you review the goal. Each one stamps the date, the
                  current number and a note — that becomes the record you bring to session.
                </p>
              )}
            </div>

            <Separator />

            <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
              <p className="text-[10px] text-muted-foreground">
                Last edited {format(new Date(goal.updatedAt), "MMM d, h:mm a")}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={goal.status === "paused" ? "default" : "outline"}
                  className="h-7 text-xs"
                  onClick={() => setStatus(goal, goal.status === "paused" ? "active" : "paused")}
                >
                  {goal.status === "paused" ? (
                    <>
                      <Play className="h-3.5 w-3.5 mr-1" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-3.5 w-3.5 mr-1" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs text-emerald-700 dark:text-emerald-400"
                  onClick={() => setStatus(goal, "done")}
                >
                  <Flag className="h-3.5 w-3.5 mr-1" />
                  Mark complete
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  /** Plain-text body for print when the card is collapsed on screen. */
  function renderPrintBody(goal: SmartGoal) {
    const checks = smartChecks(goal);
    return (
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-semibold">SMART {checks.filter((c) => c.done).length}/5</span>
          {goal.specific.trim() && <span> · {goal.specific}</span>}
        </div>
        {goal.measureName.trim() && (
          <div>
            <span className="font-semibold">Measure:</span> {goal.measureName}
            {goal.baseline !== null && ` · start ${goal.baseline}`}
            {goal.current !== null && ` · now ${goal.current}`}
            {goal.target !== null && ` · target ${goal.target}`}
            {goal.measureUnit.trim() && ` ${goal.measureUnit}`}
          </div>
        )}
        {goal.why.trim() && (
          <div>
            <span className="font-semibold">Why:</span> {goal.why}
          </div>
        )}
        {isValidDateString(goal.deadline) && (
          <div>
            <span className="font-semibold">Deadline:</span>{" "}
            {format(new Date(`${goal.deadline}T00:00:00`), "MMM d, yyyy")}
          </div>
        )}
        {goal.steps.length > 0 && (
          <ul className="list-disc pl-5 space-y-0.5">
            {goal.steps.map((s) => (
              <li key={s.id} className={cn(s.done && "line-through text-muted-foreground")}>
                {s.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </Label>
        {hint && <p className="text-[11px] text-muted-foreground leading-snug">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <label className="space-y-0.5 block">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <Input
        type="number"
        inputMode="decimal"
        step="any"
        value={value === null ? "" : String(value)}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw.trim() === "") {
            onChange(null);
            return;
          }
          const n = Number(raw);
          onChange(Number.isFinite(n) ? n : null);
        }}
        placeholder="—"
        className="h-8 text-xs"
        aria-label={label}
      />
    </label>
  );
}

function ConfidencePicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(value === n ? 0 : n)}
          className={cn(
            "h-7 w-7 rounded-md border text-xs font-semibold transition-colors",
            value >= n
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted"
          )}
          aria-label={`Confidence ${n} of 5`}
          aria-pressed={value === n}
        >
          {n}
        </button>
      ))}
      <span className="text-[11px] text-muted-foreground ml-1">
        {value > 0 ? `${value}/5` : "not rated"}
      </span>
    </div>
  );
}

function BulletList({
  label,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3 text-muted-foreground" />
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label} ({items.length})
        </span>
      </div>
      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={`${i}-${item}`} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
              <span className="flex-1 text-xs leading-snug break-words">{item}</span>
              <button
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground print:hidden"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <AddRow
        placeholder={placeholder}
        addLabel={`Add ${label.toLowerCase()}`}
        onAdd={(text) => onChange([...items, text])}
      />
    </div>
  );
}

function AddRow({
  placeholder,
  addLabel,
  onAdd,
}: {
  placeholder: string;
  addLabel: string;
  onAdd: (text: string) => void;
}) {
  const [draft, setDraft] = React.useState("");
  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft("");
  };
  return (
    <div className="flex items-center gap-2">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        className="h-8 text-xs"
        aria-label={addLabel}
      />
      <Button
        variant="outline"
        size="sm"
        className="h-8 shrink-0"
        onClick={submit}
        disabled={!draft.trim()}
        aria-label={addLabel}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function CheckInComposer({
  goal,
  onLog,
}: {
  goal: SmartGoal;
  onLog: (entry: { value: number | null; note: string; confidence: number | null }) => void;
}) {
  const [value, setValue] = React.useState<string>(
    goal.current === null ? "" : String(goal.current)
  );
  const [note, setNote] = React.useState("");
  const [confidence, setConfidence] = React.useState<number>(0);

  const submit = () => {
    if (!note.trim() && value.trim() === "") return;
    const parsed = value.trim() === "" ? null : Number(value);
    onLog({
      value: parsed !== null && Number.isFinite(parsed) ? parsed : null,
      note,
      confidence: confidence > 0 ? confidence : null,
    });
    setNote("");
    setConfidence(0);
  };

  return (
    <div className="rounded-md border border-dashed p-2 space-y-2 print:hidden">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Input
          type="number"
          inputMode="decimal"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={goal.measureName.trim() || "Where are you now?"}
          className="h-8 text-xs flex-1"
          aria-label="Check-in value"
        />
        {goal.measureUnit.trim() && (
          <span className="text-[11px] text-muted-foreground shrink-0">
            {goal.measureUnit.trim()}
          </span>
        )}
        <div className="flex items-center gap-0.5 shrink-0">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setConfidence(confidence === n ? 0 : n)}
              className={cn(
                "h-6 w-6 rounded border text-[11px] font-semibold transition-colors",
                confidence >= n
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
              aria-label={`Rate confidence ${n} of 5 at this check-in`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What moved? What got in the way? What will you try next?"
        rows={2}
        className="text-xs resize-none"
        aria-label="Check-in note"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          className="h-7 text-xs"
          onClick={submit}
          disabled={!note.trim() && value.trim() === ""}
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          Log check-in
        </Button>
      </div>
    </div>
  );
}
