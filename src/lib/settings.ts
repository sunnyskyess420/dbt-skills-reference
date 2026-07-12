// App-wide settings persisted to localStorage.
// Includes: backup reminder interval, theme default, and other preferences.

const STORAGE_KEY = "dbt-skills:settings";

export interface AppSettings {
  // Backup reminder fires after this many new worksheet entries (min 1, max 50)
  backupReminderInterval: number;
  // Theme preference: "system" | "light" | "dark"
  theme: "system" | "light" | "dark";
}

export const DEFAULT_SETTINGS: AppSettings = {
  backupReminderInterval: 5,
  theme: "system",
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      backupReminderInterval:
        typeof parsed.backupReminderInterval === "number" &&
        parsed.backupReminderInterval >= 1 &&
        parsed.backupReminderInterval <= 50
          ? parsed.backupReminderInterval
          : DEFAULT_SETTINGS.backupReminderInterval,
      theme:
        parsed.theme === "system" ||
        parsed.theme === "light" ||
        parsed.theme === "dark"
          ? parsed.theme
          : DEFAULT_SETTINGS.theme,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function updateSettings(
  partial: Partial<AppSettings>
): AppSettings {
  const current = loadSettings();
  const next = { ...current, ...partial };
  saveSettings(next);
  return next;
}
