// Auto-backup reminder for My Goals.
// Mirrors src/lib/backup-reminder.ts but with its own localStorage key and
// a tighter default interval (2) because goals are scarcer and more precious
// than worksheet entries — losing 2 goals hurts more than losing 2 worksheets.
//
// State is persisted in localStorage so it survives across sessions.

const STORAGE_KEY_REMINDER = "dbt-skills:goals-backup-reminder";

// Default interval — number of new goals created since the last backup before
// we nag the user to export. Goals are capped at MAX_GOALS (3), so 2 is the
// right granularity (remind after the 2nd new goal, not the 1st).
export const DEFAULT_GOALS_REMINDER_INTERVAL = 2;

export interface GoalsBackupReminderState {
  lastReminderGoalCount: number; // total goal count when last reminded (or dismissed)
  lastReminderAt: string | null; // ISO timestamp of last reminder
  lastExportAt: string | null;   // ISO timestamp of last successful export (resets counter)
}

function defaultState(): GoalsBackupReminderState {
  return {
    lastReminderGoalCount: 0,
    lastReminderAt: null,
    lastExportAt: null,
  };
}

export function loadGoalsReminderState(): GoalsBackupReminderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDER);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      lastReminderGoalCount: Number(parsed.lastReminderGoalCount) || 0,
      lastReminderAt: parsed.lastReminderAt ?? null,
      lastExportAt: parsed.lastExportAt ?? null,
    };
  } catch {
    return defaultState();
  }
}

function saveReminderState(state: GoalsBackupReminderState) {
  try {
    localStorage.setItem(STORAGE_KEY_REMINDER, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/**
 * Returns true if a backup reminder should be shown for the given current
 * goal count. A reminder fires when:
 *   - currentCount >= interval (so a brand-new user isn't nagged), AND
 *   - (currentCount - lastReminderCount) >= interval
 */
export function shouldShowGoalsReminder(currentGoalCount: number): boolean {
  if (currentGoalCount < DEFAULT_GOALS_REMINDER_INTERVAL) return false;
  const state = loadGoalsReminderState();
  const newSinceLast = currentGoalCount - state.lastReminderGoalCount;
  return newSinceLast >= DEFAULT_GOALS_REMINDER_INTERVAL;
}

/** Mark that the user has been reminded at the current goal count. */
export function markGoalsReminderShown(currentGoalCount: number) {
  const state = loadGoalsReminderState();
  saveReminderState({
    ...state,
    lastReminderGoalCount: currentGoalCount,
    lastReminderAt: new Date().toISOString(),
  });
}

/**
 * Mark that the user has successfully exported a backup. Resets the reminder
 * counter so the next reminder won't fire for another interval's worth of
 * new goals.
 */
export function markGoalsExported(currentGoalCount: number) {
  const state = loadGoalsReminderState();
  saveReminderState({
    ...state,
    lastReminderGoalCount: currentGoalCount,
    lastReminderAt: null,
    lastExportAt: new Date().toISOString(),
  });
}

/**
 * Permanently dismiss the reminder for the current cycle. The reminder will
 * fire again after another interval's worth of new goals are created.
 */
export function dismissGoalsReminder(currentGoalCount: number) {
  markGoalsReminderShown(currentGoalCount);
}

/**
 * Get the current reminder interval. Goals are scarcer than worksheets, so
 * the interval is fixed at DEFAULT_GOALS_REMINDER_INTERVAL (2) — but we expose
 * it as a function to mirror the worksheets' getReminderInterval() API and
 * leave the door open for a future settings toggle.
 */
export function getGoalsReminderInterval(): number {
  return DEFAULT_GOALS_REMINDER_INTERVAL;
}
