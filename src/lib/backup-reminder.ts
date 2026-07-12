// Auto-backup reminder logic.
// Reminds the user to export a backup after every N new worksheet entries.
// State is persisted in localStorage so it survives across sessions.

const STORAGE_KEY_REMINDER = "dbt-skills:backup-reminder";

// Remind every 5 new entries since the last reminder (or last export).
export const REMINDER_INTERVAL = 5;

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
 * A reminder is shown when (currentCount - lastReminderCount) >= REMINDER_INTERVAL.
 * First reminder fires after the user has created their first entry (so they know
 * about the feature) — actually, we wait until they have at least REMINDER_INTERVAL
 * entries, so they're not nagged when they have just one or two.
 */
export function shouldShowReminder(currentEntryCount: number): boolean {
  if (currentEntryCount < REMINDER_INTERVAL) return false;
  const state = loadReminderState();
  const newSinceLast = currentEntryCount - state.lastReminderEntryCount;
  return newSinceLast >= REMINDER_INTERVAL;
}

/**
 * Mark that the user has been reminded at the current entry count (so we don't
 * show the reminder again until another REMINDER_INTERVAL new entries are created).
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
 * counter so the next reminder won't fire for another REMINDER_INTERVAL new entries.
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
 * again after another REMINDER_INTERVAL new entries are created.
 * (Same as markReminderShown, but semantically distinct for clarity.)
 */
export function dismissReminder(currentEntryCount: number) {
  markReminderShown(currentEntryCount);
}
