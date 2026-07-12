"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useTheme } from "next-themes";
import { Settings, Download, Trash2, Sun, Moon, Monitor } from "lucide-react";
import {
  type AppSettings,
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from "@/lib/settings";
import { downloadJsonBackup } from "@/lib/worksheet-export";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataCleared: () => void;
}

const STORAGE_KEYS = [
  { key: "dbt-skills:worksheets", label: "Worksheets (all entries)" },
  { key: "dbt-skills:bookmarks", label: "Skill bookmarks" },
  { key: "dbt-skills:recent", label: "Recently viewed skills" },
  { key: "dbt-skills:backup-reminder", label: "Backup reminder state" },
  { key: "dbt-skills:settings", label: "App settings" },
];

export function SettingsModal({ open, onOpenChange, onDataCleared }: Props) {
  const { theme: nextTheme, setTheme } = useTheme();
  const [settings, setSettings] = React.useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = React.useState(false);

  // Load settings when modal opens
  React.useEffect(() => {
    if (open) {
      const loaded = loadSettings();
      setSettings(loaded);
      // If next-themes has a different value (e.g., user toggled via top bar),
      // prefer next-themes' value as the source of truth for display.
      if (nextTheme && nextTheme !== loaded.theme) {
        setSettings((s) => ({ ...s, theme: nextTheme as "system" | "light" | "dark" }));
      }
      setLoaded(true);
    }
  }, [open, nextTheme]);

  const handleIntervalChange = (value: number[]) => {
    const next = { ...settings, backupReminderInterval: value[0] };
    setSettings(next);
    saveSettings(next);
  };

  const handleThemeChange = (value: "system" | "light" | "dark") => {
    const next = { ...settings, theme: value };
    setSettings(next);
    saveSettings(next);
    setTheme(value);
  };

  const handleExportNow = () => {
    downloadJsonBackup();
  };

  const handleClearData = (keysToClear: string[]) => {
    for (const key of keysToClear) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    onDataCleared();
    onOpenChange(false);
  };

  const handleResetSettings = () => {
    const next = { ...DEFAULT_SETTINGS };
    setSettings(next);
    saveSettings(next);
    setTheme(next.theme);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Adjust backup reminders, appearance, and data management. Changes
            are saved automatically to your browser.
          </DialogDescription>
        </DialogHeader>

        {loaded && (
          <div className="space-y-6 py-2">
            {/* Section: Backup */}
            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold">Backup</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Control how often the app reminds you to export a JSON backup.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">
                    Remind me every{" "}
                    <span className="font-mono font-semibold tabular-nums">
                      {settings.backupReminderInterval}
                    </span>{" "}
                    new {settings.backupReminderInterval === 1 ? "entry" : "entries"}
                  </Label>
                </div>
                <Slider
                  value={[settings.backupReminderInterval]}
                  onValueChange={handleIntervalChange}
                  min={1}
                  max={50}
                  step={1}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1 (every entry)</span>
                  <span>10</span>
                  <span>25</span>
                  <span>50 (rarely)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportNow}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Export backup now
                </Button>
              </div>
            </section>

            <div className="border-t" />

            {/* Section: Appearance */}
            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold">Appearance</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Choose how the app looks. System follows your operating system setting.
                </p>
              </div>
              <RadioGroup
                value={settings.theme}
                onValueChange={handleThemeChange}
                className="grid grid-cols-3 gap-2"
              >
                <ThemeOption
                  value="system"
                  label="System"
                  description="Follow OS"
                  icon={<Monitor className="h-4 w-4" />}
                  selected={settings.theme === "system"}
                />
                <ThemeOption
                  value="light"
                  label="Light"
                  description="Always light"
                  icon={<Sun className="h-4 w-4" />}
                  selected={settings.theme === "light"}
                />
                <ThemeOption
                  value="dark"
                  label="Dark"
                  description="Always dark"
                  icon={<Moon className="h-4 w-4" />}
                  selected={settings.theme === "dark"}
                />
              </RadioGroup>
            </section>

            <div className="border-t" />

            {/* Section: Data Management */}
            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold">Data management</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  All your data is stored locally in your browser. Export a backup
                  before clearing anything.
                </p>
              </div>

              {/* What's stored */}
              <div className="rounded-md border bg-muted/30 p-3 space-y-1.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  What&apos;s stored in your browser
                </div>
                <ul className="text-[11px] text-muted-foreground space-y-0.5">
                  {STORAGE_KEYS.map((entry) => (
                    <li key={entry.key} className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] bg-background px-1 py-0.5 rounded">
                        {entry.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clear worksheets + bookmarks (keep settings) */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-amber-700 dark:text-amber-300 border-amber-500/50 hover:bg-amber-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Clear worksheets & bookmarks
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      keeps settings
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear worksheets and bookmarks?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all saved worksheets, skill
                      bookmarks, recently-viewed history, and backup reminder state.
                      App settings will be preserved. Consider exporting a backup
                      first. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleClearData([
                          "dbt-skills:worksheets",
                          "dbt-skills:bookmarks",
                          "dbt-skills:recent",
                          "dbt-skills:backup-reminder",
                        ])
                      }
                      className="bg-amber-600 text-white hover:bg-amber-700"
                    >
                      Clear data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Clear everything including settings */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-destructive border-destructive/50 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Clear ALL data
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      resets everything
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear ALL data and reset settings?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete everything stored in your browser
                      by this app: all worksheets, bookmarks, recent history, backup
                      reminder state, AND your settings. The app will return to its
                      default state. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleClearData(STORAGE_KEYS.map((k) => k.key))
                      }
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetSettings}
                className="w-full text-muted-foreground"
              >
                Reset settings to defaults
              </Button>
            </section>

            <div className="border-t pt-3 text-[10px] text-muted-foreground">
              <p>
                All data stays in your browser. Nothing is sent to any server.
                Clearing your browser&apos;s site data will also clear this app&apos;s data.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ThemeOption({
  value,
  label,
  description,
  icon,
  selected,
}: {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
}) {
  return (
    <label
      className={cn(
        "flex flex-col items-center gap-1 rounded-md border p-3 cursor-pointer transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-muted/40"
      )}
    >
      <RadioGroupItem value={value} className="sr-only" />
      <div className={cn(selected ? "text-primary" : "text-muted-foreground")}>
        {icon}
      </div>
      <div className="text-xs font-medium">{label}</div>
      <div className="text-[10px] text-muted-foreground">{description}</div>
    </label>
  );
}
