// JSON export/import utilities for My Goals.
// Mirrors worksheet-export.ts — all operations happen client-side, no data
// leaves the browser. Goals are stored under GOALS_STORAGE_KEY as
// { goals, savedAt } so we read/write that shape directly.

import {
  type Goal,
  loadGoals,
  saveGoals,
  emptyGoal,
  newId,
  normalizeGroupSupport,
  MAX_GOALS,
  GOALS_STORAGE_KEY,
} from "./goals-storage";

export interface GoalsBackupFile {
  app: "dbt-skills-reference";
  kind: "goals";
  version: 1;
  exportedAt: string;
  count: number;
  goals: Goal[];
}

/**
 * Read the current goals from storage and return them in a backup-shaped object.
 */
export function exportGoalsToJson(): GoalsBackupFile {
  const goals = loadGoals() ?? [];
  return {
    app: "dbt-skills-reference",
    kind: "goals",
    version: 1,
    exportedAt: new Date().toISOString(),
    count: goals.length,
    goals,
  };
}

/**
 * Trigger a browser download of the goals backup as a JSON file.
 * Filename mirrors the worksheets backup convention:
 *   dbt-goals-backup-YYYY-MM-DD.json
 */
export function downloadGoalsJsonBackup() {
  const data = exportGoalsToJson();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `dbt-goals-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface GoalsImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  /** When set, the caller should refresh its in-memory state. */
  error?: string;
}

/**
 * Parse a goals-backup JSON string and merge new goals into storage.
 * Rules:
 *   - Goals whose id already exists in storage are skipped (no overwrite).
 *   - Empty / malformed entries are skipped.
 *   - Never exceeds MAX_GOALS — extra goals are dropped with a count in `skipped`.
 *   - Storage shape is always { goals, savedAt } so future loads stay clean.
 *
 * Returns the merged goal list via loadGoals() so the caller can refresh UI.
 */
export function importGoalsFromJson(jsonString: string): GoalsImportResult {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") {
      return { success: false, imported: 0, skipped: 0, error: "Invalid JSON file." };
    }

    // Accept either a raw array or a { goals: [...] } backup object.
    const incomingGoals: unknown[] = Array.isArray(parsed)
      ? parsed
      : parsed.goals;

    if (!Array.isArray(incomingGoals)) {
      return { success: false, imported: 0, skipped: 0, error: "No 'goals' array found." };
    }

    const existing = loadGoals() ?? [];
    const existingIds = new Set(existing.map((g) => g.id));

    let imported = 0;
    let skipped = 0;
    const merged: Goal[] = [...existing];

    for (const raw of incomingGoals) {
      // Enforce MAX_GOALS — stop adding once we hit the cap.
      if (merged.length >= MAX_GOALS) {
        skipped++;
        continue;
      }
      // Validate basic shape: must be an object. We're lenient about field
      // presence because emptyGoal() + spread will fill in defaults.
      if (!raw || typeof raw !== "object") {
        skipped++;
        continue;
      }
      const g = raw as Partial<Goal>;
      // Skip duplicates (same id) — keep the existing goal untouched.
      if (g.id && existingIds.has(g.id)) {
        skipped++;
        continue;
      }
      // Skipper: a goal with no title, no description, no support entries and
      // no steps is empty noise from a backup slot that was never filled in.
      if (
        !(g.title ?? "").trim() &&
        !(g.description ?? "").trim() &&
        (g.steps ?? []).length === 0 &&
        normalizeGroupSupport(g.groupSupport).length === 0
      ) {
        skipped++;
        continue;
      }
      // Merge against emptyGoal() so any missing field gets a safe default.
      // groupSupport is normalized so legacy string backups become bullet
      // entries on the way in.
      const safeGoal: Goal = {
        ...emptyGoal(),
        ...g,
        id: g.id || newId(),
        createdAt: g.createdAt ?? new Date().toISOString(),
        updatedAt: g.updatedAt ?? new Date().toISOString(),
        groupSupport: normalizeGroupSupport(g.groupSupport),
        steps: Array.isArray(g.steps)
          ? g.steps.map((s) => ({
              id: s?.id || newId(),
              text: (s?.text ?? "").toString(),
              done: !!s?.done,
            }))
          : [],
        skills: Array.isArray(g.skills)
          ? g.skills
              .filter((s) => s && typeof s.skillId === "string")
              .map((s) => ({
                skillId: s.skillId as string,
                reason: typeof s?.reason === "string" ? s.reason : undefined,
              }))
          : [],
      };
      merged.push(safeGoal);
      imported++;
    }

    if (imported > 0) {
      const res = saveGoals(merged);
      if (!res.ok) {
        const reason =
          res.error === "quota"
            ? "localStorage is full — try deleting unused worksheets or exporting a backup first."
            : res.error === "private-mode"
            ? "browser storage is blocked (private mode or cookies disabled)."
            : "localStorage could not be written.";
        return {
          success: false,
          imported: 0,
          skipped,
          error: `Failed to save goals: ${reason}`,
        };
      }
    }

    return { success: true, imported, skipped };
  } catch (e) {
    return {
      success: false,
      imported: 0,
      skipped: 0,
      error: `Failed to parse JSON: ${(e as Error).message}`,
    };
  }
}

// Re-export the storage key so callers don't need to reach into goals-storage
// for it — mirrors how worksheet-export.ts holds its own STORAGE_KEY constant.
export { GOALS_STORAGE_KEY };
