// SMART Goals — data model, localStorage persistence and progress math.
//
// Distinct from `goals-storage.ts` (My Goals): My Goals is a lightweight
// "what am I working toward + steps" list. SMART Goals is the structured
// version of the same idea — one goal written so it can actually be worked
// and reviewed:
//
//   S  Specific    — title + exactly what / where / with whom
//   M  Measurable  — a named measure, baseline → target, current reading
//   A  Achievable  — a confidence rating plus obstacles and supports
//   R  Relevant    — why it matters, and which value it serves
//   T  Time-bound  — a real deadline date and a review cadence
//
// On top of that, every goal keeps a *record*: dated check-ins (each one
// stamps the measure reading and a note) and a completed archive that never
// silently disappears.
//
// Storage mirrors goals-storage.ts exactly: `{ goals, savedAt }` under a
// `dbt-skills:` key, a change event for live badge updates, and deletion
// tombstones so a sync merge on another device cannot resurrect a goal.

import {
  matchSkillsForGoal,
  newId,
  type SkillMatch,
} from "@/lib/goals-storage";

export const SMART_GOALS_STORAGE_KEY = "dbt-skills:smart-goals";
export const SMART_GOALS_TOMBSTONES_KEY = "dbt-skills:smart-goal-tombstones";
export const SMART_GOALS_CHANGED_EVENT = "dbt-skills:smart-goals-changed";

/** Active slots. Completed goals move to the archive and free a slot. */
export const MAX_SMART_GOALS = 5;

const MAX_TOMBSTONES = 200;

export type SmartGoalStatus = "active" | "paused" | "done";

export type ReviewCadence = "weekly" | "session" | "monthly";

export interface SmartGoalStep {
  id: string;
  text: string;
  done: boolean;
}

/** One dated entry in the goal's record. */
export interface SmartGoalCheckIn {
  id: string;
  /** ISO timestamp of the check-in. */
  at: string;
  /** The measure reading at this check-in (null when the goal has no measure). */
  value: number | null;
  /** Free-text note: what moved, what got in the way, what to try next. */
  note: string;
  /** Re-rated confidence 1–5, or null when the user skipped it. */
  confidence: number | null;
}

export interface SmartGoalSkillLink {
  skillId: string;
  reason?: string;
}

export interface SmartGoal {
  id: string;
  /** S — the goal in one sentence, starting with a verb. */
  title: string;
  /** S — what exactly, where, with whom, how often. */
  specific: string;
  /** M — what is being counted (e.g. "walks outside"). */
  measureName: string;
  /** M — unit shown after the number (e.g. "times / week"). */
  measureUnit: string;
  /** M — where you are starting from. */
  baseline: number | null;
  /** M — the number that means "done". */
  target: number | null;
  /** M — the latest reading (advanced by check-ins). */
  current: number | null;
  /** A — confidence right now, 1–5 (0 = not rated yet). */
  confidence: number;
  /** A — what is likely to get in the way. */
  obstacles: string[];
  /** A — what / who makes this possible (group, therapist, person, tool). */
  supports: string[];
  /** R — why this goal matters to you. */
  why: string;
  /** R — the value or life area it serves (e.g. "relationships"). */
  value: string;
  /** T — deadline as YYYY-MM-DD ("" when unset). */
  deadline: string;
  /** T — how often you intend to check in. */
  reviewCadence: ReviewCadence;
  /** The plan: small doable steps. */
  steps: SmartGoalStep[];
  /** DBT skills that can help, matched on this device. */
  skills: SmartGoalSkillLink[];
  /** The record: dated check-ins, oldest first. */
  checkIns: SmartGoalCheckIn[];
  status: SmartGoalStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

export function normalizeEntries(value: unknown): string[] {
  const toEntries = (raw: string): string[] =>
    raw
      .split(/\r?\n|\u2022|\u00b7/)
      .map((line) => line.replace(/^\s*[-*•·]\s*/, "").trim())
      .filter((line) => line.length > 0);

  if (typeof value === "string") return toEntries(value);
  if (Array.isArray(value)) {
    return value.flatMap((v) => (typeof v === "string" ? toEntries(v) : []));
  }
  return [];
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function clampConfidence(value: unknown): number {
  const n = toNumberOrNull(value);
  if (n === null) return 0;
  return Math.max(0, Math.min(5, Math.round(n)));
}

function normalizeStatus(value: unknown): SmartGoalStatus {
  return value === "done" || value === "paused" ? value : "active";
}

function normalizeCadence(value: unknown): ReviewCadence {
  return value === "session" || value === "monthly" ? value : "weekly";
}

function normalizeSteps(value: unknown): SmartGoalStep[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const s = raw as Partial<SmartGoalStep>;
    const text = typeof s.text === "string" ? s.text : "";
    if (!text.trim()) return [];
    return [{ id: s.id || newId(), text, done: !!s.done }];
  });
}

function normalizeCheckIns(value: unknown): SmartGoalCheckIn[] {
  if (!Array.isArray(value)) return [];
  const out: SmartGoalCheckIn[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const c = raw as Partial<SmartGoalCheckIn>;
    const at = typeof c.at === "string" && c.at ? c.at : null;
    if (!at) continue;
    out.push({
      id: c.id || newId(),
      at,
      value: toNumberOrNull(c.value),
      note: typeof c.note === "string" ? c.note : "",
      confidence:
        toNumberOrNull(c.confidence) === null ? null : clampConfidence(c.confidence),
    });
  }
  // Oldest first — the UI reverses for display.
  return out.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

function normalizeSkills(value: unknown): SmartGoalSkillLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const s = raw as Partial<SmartGoalSkillLink>;
    if (typeof s.skillId !== "string" || !s.skillId) return [];
    return [
      {
        skillId: s.skillId,
        reason: typeof s.reason === "string" ? s.reason : undefined,
      },
    ];
  });
}

export function normalizeSmartGoal(value: unknown): SmartGoal {
  const g = (value && typeof value === "object" ? value : {}) as Partial<SmartGoal>;
  const base = emptySmartGoal();
  const status = normalizeStatus(g.status);
  return {
    ...base,
    ...g,
    id: g.id || newId(),
    title: typeof g.title === "string" ? g.title : "",
    specific: typeof g.specific === "string" ? g.specific : "",
    measureName: typeof g.measureName === "string" ? g.measureName : "",
    measureUnit: typeof g.measureUnit === "string" ? g.measureUnit : "",
    baseline: toNumberOrNull(g.baseline),
    target: toNumberOrNull(g.target),
    current: toNumberOrNull(g.current),
    confidence: clampConfidence(g.confidence),
    obstacles: normalizeEntries(g.obstacles),
    supports: normalizeEntries(g.supports),
    why: typeof g.why === "string" ? g.why : "",
    value: typeof g.value === "string" ? g.value : "",
    deadline: typeof g.deadline === "string" ? g.deadline : "",
    reviewCadence: normalizeCadence(g.reviewCadence),
    steps: normalizeSteps(g.steps),
    skills: normalizeSkills(g.skills),
    checkIns: normalizeCheckIns(g.checkIns),
    status,
    completedAt:
      status === "done"
        ? typeof g.completedAt === "string" && g.completedAt
          ? g.completedAt
          : new Date().toISOString()
        : null,
    createdAt: typeof g.createdAt === "string" && g.createdAt ? g.createdAt : base.createdAt,
    updatedAt: typeof g.updatedAt === "string" && g.updatedAt ? g.updatedAt : base.updatedAt,
  };
}

export function emptySmartGoal(): SmartGoal {
  const now = new Date().toISOString();
  return {
    id: newId(),
    title: "",
    specific: "",
    measureName: "",
    measureUnit: "",
    baseline: null,
    target: null,
    current: null,
    confidence: 0,
    obstacles: [],
    supports: [],
    why: "",
    value: "",
    deadline: "",
    reviewCadence: "weekly",
    steps: [],
    skills: [],
    checkIns: [],
    status: "active",
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

export interface SaveSmartGoalsResult {
  ok: boolean;
  error?: "quota" | "private-mode" | "unknown";
}

export function loadSmartGoals(): SmartGoal[] | null {
  try {
    const raw = localStorage.getItem(SMART_GOALS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { goals?: unknown };
    if (!parsed || !Array.isArray(parsed.goals)) return null;
    return (parsed.goals as unknown[]).map(normalizeSmartGoal).slice(0, MAX_SMART_GOALS);
  } catch {
    return null;
  }
}

export function saveSmartGoals(goals: SmartGoal[]): SaveSmartGoalsResult {
  try {
    localStorage.setItem(
      SMART_GOALS_STORAGE_KEY,
      JSON.stringify({ goals, savedAt: new Date().toISOString() })
    );
    if (typeof window !== "undefined") {
      // Live badge update in the sidebar.
      window.dispatchEvent(new CustomEvent(SMART_GOALS_CHANGED_EVENT));
      // Sync layer: without this, signed-in users' edits never get pushed and
      // the next pull clobbers them (the bug goals-storage.ts documents).
      window.dispatchEvent(new CustomEvent("dbt-local-changed"));
    }
    return { ok: true };
  } catch (e: unknown) {
    const err = e as { name?: string; code?: number };
    if (err?.name === "QuotaExceededError" || err?.code === 22) {
      return { ok: false, error: "quota" };
    }
    if (err?.name === "SecurityError") {
      return { ok: false, error: "private-mode" };
    }
    return { ok: false, error: "unknown" };
  }
}

/** Goals that are actually filled in and not yet completed. Drives the badge. */
export function getActiveSmartGoalCount(): number {
  const goals = loadSmartGoals() ?? [];
  return goals.filter(
    (g) =>
      g.status !== "done" &&
      (g.title.trim() ||
        g.specific.trim() ||
        g.measureName.trim() ||
        g.steps.length > 0)
  ).length;
}

// ---------------------------------------------------------------------------
// Deletion tombstones (same pattern as goals-storage.ts)
// ---------------------------------------------------------------------------

export interface SmartGoalTombstone {
  id: string;
  deletedAt: string;
}

export function recordSmartGoalTombstones(ids: string[]): void {
  if (ids.length === 0) return;
  try {
    const raw = localStorage.getItem(SMART_GOALS_TOMBSTONES_KEY);
    const existing: SmartGoalTombstone[] = raw ? JSON.parse(raw) : [];
    const known = new Set(existing.map((t) => t.id));
    const now = new Date().toISOString();
    for (const id of ids) {
      if (!known.has(id)) existing.push({ id, deletedAt: now });
    }
    localStorage.setItem(
      SMART_GOALS_TOMBSTONES_KEY,
      JSON.stringify(existing.slice(-MAX_TOMBSTONES))
    );
  } catch {
    // Best effort — a missing tombstone is better than a crash.
  }
}

// ---------------------------------------------------------------------------
// SMART checks and progress
// ---------------------------------------------------------------------------

export type SmartKey = "S" | "M" | "A" | "R" | "T";

export interface SmartCheck {
  key: SmartKey;
  label: string;
  done: boolean;
  /** Shown when the letter is still missing. */
  hint: string;
}

export function smartChecks(goal: SmartGoal): SmartCheck[] {
  return [
    {
      key: "S",
      label: "Specific",
      done: goal.title.trim().length > 0 && goal.specific.trim().length > 0,
      hint: "Name the goal and the exact action.",
    },
    {
      key: "M",
      label: "Measurable",
      done: goal.measureName.trim().length > 0 && goal.target !== null,
      hint: "Pick what you count and a target number.",
    },
    {
      key: "A",
      label: "Achievable",
      done:
        goal.confidence > 0 &&
        (goal.steps.length > 0 || goal.obstacles.length > 0 || goal.supports.length > 0),
      hint: "Rate your confidence, then list steps or obstacles.",
    },
    {
      key: "R",
      label: "Relevant",
      done: goal.why.trim().length > 0 || goal.value.trim().length > 0,
      hint: "Say why it matters and which value it serves.",
    },
    {
      key: "T",
      label: "Time-bound",
      done: isValidDateString(goal.deadline),
      hint: "Set a deadline date.",
    },
  ];
}

export function smartScore(goal: SmartGoal): number {
  return smartChecks(goal).filter((c) => c.done).length;
}

/** True only for a real YYYY-MM-DD date (rejects "next month", 2026-02-30). */
export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  // Round-trip check catches overflow (e.g. Feb 30 → Mar 2).
  return d.toISOString().slice(0, 10) === value;
}

export interface SmartProgress {
  mode: "measure" | "steps" | "none";
  /** 0–100, clamped. */
  pct: number;
  /** One-line summary, e.g. "3 of 5 walks" or "2 of 4 steps". */
  label: string;
}

export function progressFor(goal: SmartGoal): SmartProgress {
  const { baseline, target, current } = goal;
  if (baseline !== null && target !== null && current !== null && target !== baseline) {
    const raw = ((current - baseline) / (target - baseline)) * 100;
    const pct = Math.max(0, Math.min(100, Math.round(raw)));
    return {
      mode: "measure",
      pct,
      label: `${formatNumber(current)} of ${formatNumber(target)}${unitSuffix(goal)}`,
    };
  }
  if (goal.steps.length > 0) {
    const done = goal.steps.filter((s) => s.done).length;
    return {
      mode: "steps",
      pct: Math.round((done / goal.steps.length) * 100),
      label: `${done} of ${goal.steps.length} step${goal.steps.length === 1 ? "" : "s"} done`,
    };
  }
  return { mode: "none", pct: 0, label: "No measure or steps yet" };
}

function unitSuffix(goal: SmartGoal): string {
  const unit = goal.measureUnit.trim();
  return unit ? ` ${unit}` : "";
}

function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 10) / 10);
}

/** Most recent check-in, or null when the record is empty. */
export function lastCheckIn(goal: SmartGoal): SmartGoalCheckIn | null {
  if (goal.checkIns.length === 0) return null;
  return goal.checkIns[goal.checkIns.length - 1];
}

const CADENCE_DAYS: Record<ReviewCadence, number> = {
  weekly: 7,
  session: 7,
  monthly: 30,
};

/**
 * How many days overdue for a check-in (negative = still fresh, 0 = due today).
 * Uses the last check-in, falling back to when the goal was created.
 */
export function reviewDueInDays(goal: SmartGoal, now: Date = new Date()): number {
  const last = lastCheckIn(goal);
  const since = new Date(last ? last.at : goal.createdAt);
  if (Number.isNaN(since.getTime())) return 0;
  const days = CADENCE_DAYS[goal.reviewCadence];
  const dueAt = new Date(since.getTime() + days * 24 * 60 * 60 * 1000);
  return Math.floor((now.getTime() - dueAt.getTime()) / (24 * 60 * 60 * 1000));
}

/** Days until the deadline (negative = past due), or null when unset. */
export function daysUntilDeadline(goal: SmartGoal, now: Date = new Date()): number | null {
  if (!isValidDateString(goal.deadline)) return null;
  const end = new Date(`${goal.deadline}T23:59:59`).getTime();
  return Math.ceil((end - now.getTime()) / (24 * 60 * 60 * 1000));
}

// ---------------------------------------------------------------------------
// Mutations used by the UI
// ---------------------------------------------------------------------------

export function withStep(goal: SmartGoal, text: string): SmartGoal {
  const trimmed = text.trim();
  if (!trimmed) return goal;
  return { ...goal, steps: [...goal.steps, { id: newId(), text: trimmed, done: false }] };
}

export function withCheckIn(
  goal: SmartGoal,
  entry: { value: number | null; note: string; confidence: number | null }
): SmartGoal {
  const checkIn: SmartGoalCheckIn = {
    id: newId(),
    at: new Date().toISOString(),
    value: entry.value,
    note: entry.note.trim(),
    confidence: entry.confidence,
  };
  return {
    ...goal,
    checkIns: [...goal.checkIns, checkIn],
    // A check-in is also the moment the measure advances.
    current: entry.value !== null ? entry.value : goal.current,
    confidence: entry.confidence ?? goal.confidence,
  };
}

/** Skill suggestions for a goal, reusing the My Goals offline matcher. */
export function matchSkillsForSmartGoal(goal: SmartGoal, limit = 6): SkillMatch[] {
  const text = [goal.title, goal.specific, goal.why, goal.measureName].join(" ");
  return matchSkillsForGoal(goal.title, `${goal.specific} ${goal.why} ${text}`, limit);
}
