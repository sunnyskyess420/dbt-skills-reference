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
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Link2,
  Scale,
  CalendarRange,
};

interface Props {
  entries: WorksheetEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (entry: WorksheetEntry) => void;
  onCreate: (type: WorksheetType) => void;
}

export function WorksheetList({
  entries,
  selectedEntryId,
  onSelectEntry,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b px-3 py-3 shrink-0">
        <h2 className="text-sm font-semibold mb-2">Worksheets</h2>
        <p className="text-[11px] text-muted-foreground mb-3">
          Fill out, save, and print interactive versions of the core DBT worksheets. Saved to your browser only.
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {WORKSHEET_TYPES.map((type) => {
            const Icon = ICONS[type.icon] ?? FileText;
            return (
              <Button
                key={type.id}
                variant="outline"
                size="sm"
                onClick={() => onCreate(type.id)}
                className="justify-start h-auto py-2 px-2.5"
              >
                <Icon className={cn("h-4 w-4 mr-2 shrink-0", type.color)} />
                <div className="text-left min-w-0">
                  <div className="text-xs font-medium">New {type.shortName}</div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {type.reference}
                  </div>
                </div>
                <Plus className="h-3 w-3 ml-auto shrink-0 opacity-50" />
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 sticky top-0 bg-background/95 backdrop-blur">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Saved worksheets
          </span>
          <span className="ml-1.5 text-[10px] text-muted-foreground">
            ({entries.length})
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              No worksheets yet. Use the buttons above to start a new Chain Analysis, Pros & Cons, or Diary Card.
            </p>
          </div>
        ) : (
          <ul className="pb-2">
            {entries.map((entry) => {
              const meta = getWorksheetTypeMeta(entry.type);
              const Icon = ICONS[meta.icon] ?? FileText;
              const isSelected = entry.id === selectedEntryId;
              return (
                <li key={entry.id}>
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
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
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
