// JSON backup / restore for SMART Goals.
// Mirrors goals-export.ts: client-side only, `{ app, kind, version, goals }`
// envelope so a restore can tell a SMART-goals file from a My Goals file.

import {
  type SmartGoal,
  loadSmartGoals,
  saveSmartGoals,
  normalizeSmartGoal,
  emptySmartGoal,
  MAX_SMART_GOALS,
  SMART_GOALS_STORAGE_KEY,
} from "./smart-goals-storage";
import { newId } from "./goals-storage";

export interface SmartGoalsBackupFile {
  app: "dbt-skills-reference";
  kind: "smart-goals";
  version: 1;
  exportedAt: string;
  count: number;
  goals: SmartGoal[];
}

export function exportSmartGoalsToJson(): SmartGoalsBackupFile {
  const goals = loadSmartGoals() ?? [];
  return {
    app: "dbt-skills-reference",
    kind: "smart-goals",
    version: 1,
    exportedAt: new Date().toISOString(),
    count: goals.length,
    goals,
  };
}

/** Download `dbt-smart-goals-backup-YYYY-MM-DD.json`. */
export function downloadSmartGoalsJsonBackup() {
  const data = exportSmartGoalsToJson();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `dbt-smart-goals-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface SmartGoalsImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  error?: string;
}

/**
 * Merge a SMART-goals backup into storage.
 *   - Duplicate ids are skipped (existing entries always win).
 *   - Empty entries are skipped.
 *   - The active cap is enforced; extras are counted in `skipped`.
 */
export function importSmartGoalsFromJson(jsonString: string): SmartGoalsImportResult {
  try {
    const parsed = JSON.parse(jsonString) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return { success: false, imported: 0, skipped: 0, error: "Invalid JSON file." };
    }

    const envelope = parsed as { goals?: unknown; kind?: unknown };
    const incoming: unknown[] = Array.isArray(parsed)
      ? (parsed as unknown[])
      : Array.isArray(envelope.goals)
      ? envelope.goals
      : [];

    if (!Array.isArray(incoming)) {
      return { success: false, imported: 0, skipped: 0, error: "No 'goals' array found." };
    }
    if (envelope.kind && envelope.kind !== "smart-goals") {
      return {
        success: false,
        imported: 0,
        skipped: 0,
        error: "That looks like a My Goals backup, not a SMART goals backup.",
      };
    }

    const existing = loadSmartGoals() ?? [];
    const existingIds = new Set(existing.map((g) => g.id));
    const merged: SmartGoal[] = [...existing];
    let imported = 0;
    let skipped = 0;

    for (const raw of incoming) {
      // Only active goals occupy the limited slots — an imported archive
      // should not be rejected because the completed list is long.
      const activeCount = merged.filter((g) => g.status !== "done").length;
      if (activeCount >= MAX_SMART_GOALS) {
        skipped++;
        continue;
      }
      if (!raw || typeof raw !== "object") {
        skipped++;
        continue;
      }
      const candidate = raw as Partial<SmartGoal>;
      if (candidate.id && existingIds.has(candidate.id)) {
        skipped++;
        continue;
      }
      // Empty slot noise — no title, no description, no measure, no steps.
      if (
        !(candidate.title ?? "").trim() &&
        !(candidate.specific ?? "").trim() &&
        !(candidate.measureName ?? "").trim() &&
        (candidate.steps ?? []).length === 0
      ) {
        skipped++;
        continue;
      }
      const safe: SmartGoal = {
        ...emptySmartGoal(),
        ...normalizeSmartGoal(candidate),
        id: candidate.id || newId(),
      };
      merged.push(safe);
      existingIds.add(safe.id);
      imported++;
    }

    if (imported > 0) {
      const res = saveSmartGoals(merged);
      if (!res.ok) {
        const reason =
          res.error === "quota"
            ? "browser storage is full — delete an old goal or export a backup first."
            : res.error === "private-mode"
            ? "browser storage is blocked (private mode or cookies disabled)."
            : "browser storage could not be written.";
        return { success: false, imported: 0, skipped, error: `Could not save: ${reason}` };
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

export { SMART_GOALS_STORAGE_KEY };
