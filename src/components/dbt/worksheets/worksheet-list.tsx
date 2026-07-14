"use client";

import * as React from "react";
import {
  WORKSHEET_TYPES,
  type WorksheetEntry,
  type WorksheetType,
  getWorksheetTypeMeta,
} from "@/lib/worksheet-storage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Link2,
  Scale,
  CalendarRange,
  Plus,
  FileText,
  Clock,
  GitMerge,
  Unplug,
  Download,
  Upload,
  GitCompare,
  MessageSquareText,
  SearchCheck,
  FlipHorizontal,
  HeartHandshake,
  ShieldCheck,
  Target,
  Smile,
  Activity,
  HeartPulse,
  Coins,
  Pin,
  PinOff,
  BrainCog,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadJsonBackup, importFromJson, type ImportResult } from "@/lib/worksheet-export";
import {
  shouldShowReminder,
  markExported,
  dismissReminder,
  getReminderInterval,
} from "@/lib/backup-reminder";
import { getPinnedIds, togglePin } from "@/lib/pinned-worksheets";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Link2,
  Scale,
  CalendarRange,
  GitMerge,
  Unplug,
  MessageSquareText,
  SearchCheck,
  FlipHorizontal,
  HeartHandshake,
  ShieldCheck,
  Target,
  Smile,
  Activity,
  HeartPulse,
  Coins,
  BrainCog,
};

// Group worksheet types by module for the dropdown menu
const WORKSHEET_GROUPS: { label: string; types: typeof WORKSHEET_TYPES }[] = [
  {
    label: "General",
    types: WORKSHEET_TYPES.filter((t) => ["chain-analysis", "missing-links"].includes(t.id)),
  },
  {
    label: "Distress Tolerance",
    types: WORKSHEET_TYPES.filter((t) => ["pros-cons", "radical-acceptance", "crisis-survival-tracker"].includes(t.id)),
  },
  {
    label: "Emotion Regulation",
    types: WORKSHEET_TYPES.filter((t) => ["diary-card", "check-the-facts", "opposite-action", "values-to-actions", "pleasant-events-diary", "emotion-diary", "cope-ahead"].includes(t.id)),
  },
  {
    label: "Interpersonal",
    types: WORKSHEET_TYPES.filter((t) => ["dear-man-script", "dialectics-practice", "self-validation", "dime-game"].includes(t.id)),
  },
  {
    label: "Mindfulness",
    types: WORKSHEET_TYPES.filter((t) => ["walking-middle-path"].includes(t.id)),
  },
];

interface Props {
  entries: WorksheetEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (entry: WorksheetEntry) => void;
  onCreate: (type: WorksheetType) => void;
  onImportComplete: () => void;
  onOpenCompare: () => void;
}

export function WorksheetList({
  entries,
  selectedEntryId,
  onSelectEntry,
  onCreate,
  onImportComplete,
  onOpenCompare,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = React.useState<ImportResult | null>(null);
  const [showBackupReminder, setShowBackupReminder] = React.useState(false);
  const [pinnedIds, setPinnedIds] = React.useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = React.useState<"recent" | "created" | "type" | "name">("recent");

  // Load pinned IDs on mount and when entries change
  React.useEffect(() => {
    setPinnedIds(getPinnedIds());
    // Load saved sort preference
    try {
      const saved = localStorage.getItem("dbt-skills:worksheet-sort");
      if (saved && ["recent", "created", "type", "name"].includes(saved)) {
        setSortBy(saved as typeof sortBy);
      }
    } catch {
      // ignore
    }
  }, [entries]);

  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    togglePin(id);
    setPinnedIds(getPinnedIds());
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as typeof sortBy);
    try {
      localStorage.setItem("dbt-skills:worksheet-sort", value);
    } catch {
      // ignore
    }
  };

  // Sort: pinned first, then by selected sort method
  const sortedEntries = React.useMemo(() => {
    const sorted = [...entries].sort((a, b) => {
      switch (sortBy) {
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "type": {
          const aType = getWorksheetTypeMeta(a.type).shortName;
          const bType = getWorksheetTypeMeta(b.type).shortName;
          if (aType !== bType) return aType.localeCompare(bType);
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        case "name":
          return (a.title || "").localeCompare(b.title || "");
        case "recent":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
    // Always move pinned to top
    return sorted.sort((a, b) => {
      const aPinned = pinnedIds.has(a.id);
      const bPinned = pinnedIds.has(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [entries, pinnedIds, sortBy]);

  const diaryCardCount = entries.filter((e) => e.type === "diary-card").length;
  const entryCount = entries.length;

  // Check whether to show the backup reminder whenever entry count changes
  React.useEffect(() => {
    if (shouldShowReminder(entryCount)) {
      setShowBackupReminder(true);
    } else {
      setShowBackupReminder(false);
    }
  }, [entryCount]);

  const handleExport = () => {
    downloadJsonBackup();
    // Mark exported so the reminder resets (next reminder fires after REMINDER_INTERVAL more entries)
    markExported(entryCount);
    setShowBackupReminder(false);
  };

  const handleDismissReminder = () => {
    dismissReminder(entryCount);
    setShowBackupReminder(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importFromJson(text);
    setImportResult(result);
    if (result.success && result.imported > 0) {
      onImportComplete();
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b px-3 py-3 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Worksheets</h2>
          <div className="flex items-center gap-0.5">
            {diaryCardCount >= 2 && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={onOpenCompare}
                      aria-label="Compare two diary cards"
                    >
                      <GitCompare className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Compare two diary cards</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleExport}
                    disabled={entries.length === 0}
                    aria-label="Export all worksheets as JSON"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export all as JSON (backup)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleImportClick}
                    aria-label="Import worksheets from JSON"
                  >
                    <Upload className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import from JSON (restore)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">
          Fill out, save, and print interactive versions of the core DBT worksheets. Saved to your browser only.
        </p>

        {importResult && (
          <div
            className={cn(
              "mb-2 rounded-md border p-2 text-[11px]",
              importResult.success
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            )}
          >
            {importResult.success ? (
              <>
                Imported {importResult.imported} worksheet(s)
                {importResult.skipped > 0 && `, skipped ${importResult.skipped} duplicate(s)`}.
              </>
            ) : (
              <>Import failed: {importResult.error}</>
            )}
            <button
              className="ml-2 underline"
              onClick={() => setImportResult(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Auto-backup reminder */}
        {showBackupReminder && (
          <div className="mb-3 rounded-md border border-amber-500/50 bg-amber-500/10 p-2.5 text-[11px] text-amber-800 dark:text-amber-200">
            <div className="flex items-start gap-1.5">
              <span className="text-base leading-none mt-0.5" aria-hidden>⚠</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Time to back up your worksheets</p>
                <p className="mt-0.5">
                  You now have {entryCount} saved worksheet{entryCount === 1 ? "" : "s"}. If your
                  browser data is cleared, you&apos;ll lose them. Export a JSON backup now to keep
                  them safe.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[11px] px-2 border-amber-500/50 hover:bg-amber-500/20"
                    onClick={handleExport}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export now
                  </Button>
                  <button
                    className="underline text-[11px]"
                    onClick={handleDismissReminder}
                  >
                    Remind me later
                  </button>
                </div>
                <p className="text-[10px] mt-1.5 opacity-70">
                  Next reminder after {getReminderInterval()} more new entries.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="w-full">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New worksheet
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 max-h-[400px] overflow-y-auto">
              {WORKSHEET_GROUPS.map((group) => (
                <React.Fragment key={group.label}>
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </DropdownMenuLabel>
                  {group.types.map((type) => {
                    const Icon = ICONS[type.icon] ?? FileText;
                    return (
                      <DropdownMenuItem
                        key={type.id}
                        onClick={() => onCreate(type.id)}
                        className="cursor-pointer py-2"
                      >
                        <Icon className={cn("h-4 w-4 mr-2 shrink-0", type.color)} />
                        <div className="min-w-0">
                          <div className="text-xs font-medium">{type.shortName}</div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {type.description.slice(0, 50)}...
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 sticky top-0 bg-background/95 backdrop-blur z-10 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Saved worksheets
            </span>
            <span className="ml-1.5 text-[10px] text-muted-foreground">
              ({entries.length})
            </span>
          </div>
          {entries.length > 1 && (
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="h-7 w-[110px] text-[10px] shrink-0 border-none bg-muted/50 px-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent" className="text-xs">Recent</SelectItem>
                <SelectItem value="created" className="text-xs">Created</SelectItem>
                <SelectItem value="type" className="text-xs">Type</SelectItem>
                <SelectItem value="name" className="text-xs">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              No worksheets yet. Use the buttons above to start a new worksheet.
            </p>
          </div>
        ) : (
          <ul className="pb-2">
            {sortedEntries.map((entry) => {
              const meta = getWorksheetTypeMeta(entry.type);
              const Icon = ICONS[meta.icon] ?? FileText;
              const isSelected = entry.id === selectedEntryId;
              const isPinned = pinnedIds.has(entry.id);
              return (
                <li key={entry.id} className="relative group">
                  <button
                    onClick={() => onSelectEntry(entry)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 border-l-2 transition-colors",
                      isSelected
                        ? "bg-muted/60 border-primary"
                        : "border-transparent hover:bg-muted/40 hover:border-muted"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", meta.color)} />
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="text-sm font-medium truncate flex items-center gap-1">
                          {isPinned && <Pin className="h-3 w-3 fill-primary text-primary shrink-0" />}
                          {entry.title || meta.shortName}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <span>{meta.shortName}</span>
                          <span>·</span>
                          <Clock className="h-2.5 w-2.5" />
                          <span>{formatRelative(entry.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                  {/* Pin button — appears on hover or when pinned */}
                  <button
                    onClick={(e) => handleTogglePin(e, entry.id)}
                    className={cn(
                      "absolute right-2 top-2.5 h-6 w-6 flex items-center justify-center rounded transition-all",
                      isPinned
                        ? "opacity-100 text-primary"
                        : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                    )}
                    aria-label={isPinned ? "Unpin" : "Pin to top"}
                  >
                    {isPinned ? (
                      <Pin className="h-3.5 w-3.5 fill-primary" />
                    ) : (
                      <PinOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
