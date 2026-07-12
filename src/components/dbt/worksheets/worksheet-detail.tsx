"use client";

import * as React from "react";
import {
  type WorksheetEntry,
  getWorksheetTypeMeta,
} from "@/lib/worksheet-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Trash2,
  Printer,
  Check,
  BookOpen,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { ChainAnalysisForm } from "./chain-analysis-form";
import { ProsConsForm } from "./pros-cons-form";
import { DiaryCardForm } from "./diary-card-form";

interface Props {
  entry: WorksheetEntry;
  onBack: () => void;
  onChangeTitle: (title: string) => void;
  onChangeData: (data: Record<string, any>) => void;
  onDelete: () => void;
}

export function WorksheetDetail({
  entry,
  onBack,
  onChangeTitle,
  onChangeData,
  onDelete,
}: Props) {
  const meta = getWorksheetTypeMeta(entry.type);
  const [titleDraft, setTitleDraft] = React.useState(entry.title);
  const [savedFlash, setSavedFlash] = React.useState(false);

  // Sync title draft if entry changes (e.g., new entry selected)
  React.useEffect(() => {
    setTitleDraft(entry.title);
  }, [entry.id, entry.title]);

  // Show "saved" flash when updatedAt changes
  const lastSavedRef = React.useRef(entry.updatedAt);
  React.useEffect(() => {
    if (entry.updatedAt !== lastSavedRef.current) {
      lastSavedRef.current = entry.updatedAt;
      setSavedFlash(true);
      const t = setTimeout(() => setSavedFlash(false), 1200);
      return () => clearTimeout(t);
    }
  }, [entry.updatedAt]);

  const handleTitleBlur = () => {
    if (titleDraft !== entry.title) {
      onChangeTitle(titleDraft);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header — hidden on print */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b print:hidden">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="lg:hidden shrink-0"
              aria-label="Back to list"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className={cn("text-xs font-semibold uppercase tracking-wider", meta.color)}>
              {meta.shortName}
            </span>
            {savedFlash && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <Check className="h-3 w-3" />
                Saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              aria-label="Print worksheet"
            >
              <Printer className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Print</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Delete worksheet"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this worksheet?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &quot;{entry.title}&quot;. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {/* Editable title row */}
        <div className="px-4 sm:px-6 pb-3">
          <Input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Worksheet title..."
            className="text-base font-semibold border-0 px-0 focus-visible:ring-0 h-auto py-0"
          />
          <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1.5">
            <BookOpen className="h-3 w-3 mt-0.5 shrink-0" />
            <span>
              <span className="font-medium">Book reference:</span> {meta.reference}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Print-only header */}
          <div className="hidden print:block mb-6 pb-3 border-b">
            <h1 className="text-xl font-bold">{entry.title}</h1>
            <p className="text-sm text-muted-foreground">{meta.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{meta.reference}</p>
            <p className="text-xs mt-1">
              Created: {new Date(entry.createdAt).toLocaleString()} · Last updated:{" "}
              {new Date(entry.updatedAt).toLocaleString()}
            </p>
          </div>

          {entry.type === "chain-analysis" && (
            <ChainAnalysisForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "pros-cons" && (
            <ProsConsForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "diary-card" && (
            <DiaryCardForm entry={entry} onChange={onChangeData} />
          )}

          <div className="mt-12 pt-6 border-t text-xs text-muted-foreground print:mt-6">
            <p>
              Worksheet format based on{" "}
              <span className="italic">
                DBT Skills Training Handouts and Worksheets, Second Edition
              </span>{" "}
              by Marsha M. Linehan (Guilford Press, 2014). Not a substitute for treatment.
              Your entries are saved in this browser only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
