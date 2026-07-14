// JSON export/import utilities for worksheets.
// All operations happen client-side — no data leaves the browser.

import {
  type WorksheetEntry,
  type WorksheetType,
  listEntries,
  getWorksheetTypeMeta,
} from "./worksheet-storage";

const STORAGE_KEY = "dbt-skills:worksheets";

export interface BackupFile {
  app: "dbt-skills-reference";
  version: 1;
  exportedAt: string;
  count: number;
  entries: WorksheetEntry[];
}

export function exportToJson(): BackupFile {
  const entries = listEntries();
  return {
    app: "dbt-skills-reference",
    version: 1,
    exportedAt: new Date().toISOString(),
    count: entries.length,
    entries,
  };
}

export function downloadJsonBackup() {
  const data = exportToJson();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `dbt-worksheets-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  error?: string;
}

export function importFromJson(jsonString: string): ImportResult {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") {
      return { success: false, imported: 0, skipped: 0, error: "Invalid JSON file." };
    }
    const incomingEntries: WorksheetEntry[] = Array.isArray(parsed)
      ? parsed
      : parsed.entries;
    if (!Array.isArray(incomingEntries)) {
      return { success: false, imported: 0, skipped: 0, error: "No 'entries' array found." };
    }

    const existing = listEntries();
    const existingIds = new Set(existing.map((e) => e.id));

    let imported = 0;
    let skipped = 0;
    const merged = [...existing];

    for (const entry of incomingEntries) {
      // Validate basic structure
      if (
        !entry ||
        typeof entry !== "object" ||
        !entry.id ||
        !entry.type ||
        !entry.data
      ) {
        skipped++;
        continue;
      }
      // Validate type — accept any valid WorksheetType
      const validTypes: WorksheetType[] = [
        "chain-analysis",
        "pros-cons",
        "diary-card",
        "walking-middle-path",
        "missing-links",
        "dear-man-script",
        "check-the-facts",
        "opposite-action",
        "radical-acceptance",
        "crisis-survival-tracker",
        "values-to-actions",
        "pleasant-events-diary",
        "emotion-diary",
        "dialectics-practice",
        "self-validation",
        "dime-game",
        "cope-ahead",
        "build-mastery",
        "please-tracker",
        "nightmare-protocol",
        "mindfulness-emotions",
        "mindfulness-thoughts",
        "turning-mind-willingness",
        "clarifying-priorities",
        "troubleshooting-ie",
        "validating-others",
        "myths-emotions",
      ];
      if (!validTypes.includes(entry.type)) {
        skipped++;
        continue;
      }
      // Skip duplicates (same id) — keep existing
      if (existingIds.has(entry.id)) {
        skipped++;
        continue;
      }
      // Ensure required fields
      const safeEntry: WorksheetEntry = {
        id: entry.id,
        type: entry.type,
        title: entry.title ?? getWorksheetTypeMeta(entry.type).shortName,
        createdAt: entry.createdAt ?? new Date().toISOString(),
        updatedAt: entry.updatedAt ?? new Date().toISOString(),
        data: entry.data,
      };
      merged.push(safeEntry);
      imported++;
    }

    if (imported > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        return {
          success: false,
          imported: 0,
          skipped,
          error: "Failed to save to localStorage (storage may be full).",
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
