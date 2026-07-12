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
  BarChart3,
  ListChecks,
  FileDown,
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
import { WalkingMiddlePathForm } from "./walking-middle-path-form";
import { MissingLinksForm } from "./missing-links-form";
import { DearManScriptForm } from "./dear-man-script-form";
import { CheckTheFactsForm } from "./check-the-facts-form";
import { OppositeActionForm } from "./opposite-action-form";
import { RadicalAcceptanceForm } from "./radical-acceptance-form";
import { CrisisSurvivalTrackerForm } from "./crisis-survival-tracker-form";
import { ValuesToActionsForm } from "./values-to-actions-form";
import { PleasantEventsDiaryForm } from "./pleasant-events-diary-form";
import { EmotionDiaryForm } from "./emotion-diary-form";
import { DialecticsPracticeForm } from "./dialectics-practice-form";
import { SelfValidationForm } from "./self-validation-form";
import { DimeGameForm } from "./dime-game-form";
import { DiaryCardSummary } from "./diary-card-summary";
import { exportToPdf } from "@/lib/worksheet-pdf";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [view, setView] = React.useState<"form" | "summary">("form");

  // Reset to form view when entry changes
  React.useEffect(() => {
    setView("form");
  }, [entry.id]);

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
            {/* Summary/Form toggle for diary cards only */}
            {entry.type === "diary-card" && (
              <div className="flex items-center rounded-md border bg-background p-0.5 mr-1">
                <Button
                  variant={view === "form" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("form")}
                  className="h-7 px-2 text-xs"
                >
                  <ListChecks className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Form</span>
                </Button>
                <Button
                  variant={view === "summary" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("summary")}
                  className="h-7 px-2 text-xs"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Summary</span>
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              aria-label="Print worksheet"
            >
              <Printer className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Print</span>
            </Button>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => exportToPdf(entry)}
                    aria-label="Export as PDF"
                  >
                    <FileDown className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">PDF</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download a formatted PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          {entry.type === "diary-card" &&
            (view === "form" ? (
              <DiaryCardForm entry={entry} onChange={onChangeData} />
            ) : (
              <DiaryCardSummary entry={entry} />
            ))}
          {entry.type === "walking-middle-path" && (
            <WalkingMiddlePathForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "missing-links" && (
            <MissingLinksForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "dear-man-script" && (
            <DearManScriptForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "check-the-facts" && (
            <CheckTheFactsForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "opposite-action" && (
            <OppositeActionForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "radical-acceptance" && (
            <RadicalAcceptanceForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "crisis-survival-tracker" && (
            <CrisisSurvivalTrackerForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "values-to-actions" && (
            <ValuesToActionsForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "pleasant-events-diary" && (
            <PleasantEventsDiaryForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "emotion-diary" && (
            <EmotionDiaryForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "dialectics-practice" && (
            <DialecticsPracticeForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "self-validation" && (
            <SelfValidationForm entry={entry} onChange={onChangeData} />
          )}
          {entry.type === "dime-game" && (
            <DimeGameForm entry={entry} onChange={onChangeData} />
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
