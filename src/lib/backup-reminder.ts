// Auto-backup reminder logic.
// Reminds the user to export a backup after every N new worksheet entries.
// State is persisted in localStorage so it survives across sessions.
//
// The interval N is configurable via app settings (see src/lib/settings.ts).
// We read it dynamically on each check so settings changes take effect immediately.

const STORAGE_KEY_REMINDER = "dbt-skills:backup-reminder";

// Default interval used when settings aren't loaded yet (e.g., during SSR or first paint).
// The actual value comes from loadSettings().backupReminderInterval.
export const DEFAULT_REMINDER_INTERVAL = 5;

import { loadSettings } from "./settings";

/** Get the current reminder interval from settings (1-50, default 5). */
export function getReminderInterval(): number {
  return loadSettings().backupReminderInterval;
}

export interface BackupReminderState {
  lastReminderEntryCount: number; // total entries when last reminded (or last dismissed)
  lastReminderAt: string | null;  // ISO timestamp of last reminder
  lastExportAt: string | null;    // ISO timestamp of last successful export (resets counter)
}

function defaultState(): BackupReminderState {
  return {
    lastReminderEntryCount: 0,
    lastReminderAt: null,
    lastExportAt: null,
  };
}

export function loadReminderState(): BackupReminderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDER);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      lastReminderEntryCount: Number(parsed.lastReminderEntryCount) || 0,
      lastReminderAt: parsed.lastReminderAt ?? null,
      lastExportAt: parsed.lastExportAt ?? null,
    };
  } catch {
    return defaultState();
  }
}

function saveReminderState(state: BackupReminderState) {
  try {
    localStorage.setItem(STORAGE_KEY_REMINDER, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/**
 * Returns true if a backup reminder should be shown for the given current entry count.
 * A reminder is shown when (currentCount - lastReminderCount) >= interval AND
 * currentCount >= interval (so the user isn't nagged when they have just 1-2 entries).
 */
export function shouldShowReminder(currentEntryCount: number): boolean {
  const interval = getReminderInterval();
  if (currentEntryCount < interval) return false;
  const state = loadReminderState();
  const newSinceLast = currentEntryCount - state.lastReminderEntryCount;
  return newSinceLast >= interval;
}

/**
 * Mark that the user has been reminded at the current entry count (so we don't
 * show the reminder again until another interval's worth of new entries are created).
 */
export function markReminderShown(currentEntryCount: number) {
  const state = loadReminderState();
  saveReminderState({
    ...state,
    lastReminderEntryCount: currentEntryCount,
    lastReminderAt: new Date().toISOString(),
  });
}

/**
 * Mark that the user has successfully exported a backup. Resets the reminder
 * counter so the next reminder won't fire for another interval's worth of new entries.
 */
export function markExported(currentEntryCount: number) {
  const state = loadReminderState();
  saveReminderState({
    ...state,
    lastReminderEntryCount: currentEntryCount,
    lastReminderAt: null,
    lastExportAt: new Date().toISOString(),
  });
}

/**
 * Permanently dismiss the reminder for the current cycle. The reminder will fire
 * again after another interval's worth of new entries are created.
 * (Same as markReminderShown, but semantically distinct for clarity.)
 */
export function dismissReminder(currentEntryCount: number) {
  markReminderShown(currentEntryCount);
}
