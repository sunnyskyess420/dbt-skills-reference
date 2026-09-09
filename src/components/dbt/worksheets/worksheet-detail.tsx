"use client";

import * as React from "react";
import {
  type WorksheetEntry,
  getWorksheetTypeMeta,
  getSkillForWorksheet,
} from "@/lib/worksheet-storage";
import { SKILLS } from "@/data/skills";
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
  GraduationCap,
  MoreHorizontal,
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/relative-time";
import { useSession } from "next-auth/react";
import { WORKSHEET_FORMS, WorksheetFormLoading } from "./form-registry";
import dynamic from "next/dynamic";

// The diary card summary (heatmap + stats) is also loaded on demand.
const DiaryCardSummary = dynamic(
  () => import("./diary-card-summary").then((m) => m.DiaryCardSummary),
  { loading: WorksheetFormLoading, ssr: false }
);
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
  onViewSkill?: (skillId: string) => void;
}

export function WorksheetDetail({
  entry,
  onBack,
  onChangeTitle,
  onChangeData,
  onDelete,
  onViewSkill,
}: Props) {
  const meta = getWorksheetTypeMeta(entry.type);
  // The form component is loaded on demand from the code-split registry.
  const FormComponent = WORKSHEET_FORMS[entry.type];

  // Sync-aware footer copy: signed-in users see cloud wording, guests see
  // device wording.
  const { status: authStatus } = useSession();
  const isSignedIn = authStatus === "authenticated";

  const linkedSkillId = onViewSkill ? getSkillForWorksheet(entry.type) : undefined;
  const linkedSkill = linkedSkillId ? SKILLS.find((s) => s.id === linkedSkillId) : null;
  const [titleDraft, setTitleDraft] = React.useState(entry.title);
  // Delete lives in an overflow menu now — it used to sit directly beside
  // Export as PDF as small icon buttons, an easy mis-tap on a document
  // someone filled out while distressed.
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  // Persistent save indicator: always shows "Saved · just now / 2m ago / …",
  // flashing emerald briefly whenever the entry autosaves. Replaces the old
  // 1.2s flash that was easy to miss.
  const [, setSaveTick] = React.useState(0);
  const [savedHighlight, setSavedHighlight] = React.useState(false);
  const [view, setView] = React.useState<"form" | "summary">("form");
  // A never-updated entry is an unsaved draft: it only persists to
  // localStorage (and the worksheet list) after the first edit.
  const isDraft = entry.updatedAt === entry.createdAt;

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
      setSavedHighlight(true);
      const t = setTimeout(() => setSavedHighlight(false), 2000);
      return () => clearTimeout(t);
    }
  }, [entry.updatedAt]);

  // Re-render periodically so the relative "Saved · Xm ago" label stays
  // truthful without waiting for an edit.
  React.useEffect(() => {
    const t = setInterval(() => setSaveTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

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
            {!isDraft && (
              <span
                className={cn(
                  "text-[11px] flex items-center gap-0.5",
                  savedHighlight
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                )}
              >
                <Check className="h-3 w-3" />
                Saved · {formatRelativeTime(entry.updatedAt)}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="More actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete worksheet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
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
          {isDraft && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mb-1">
              Draft — saves automatically once you start typing.
            </p>
          )}
          <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1.5">
            <BookOpen className="h-3 w-3 mt-0.5 shrink-0" />
            <span>
              <span className="font-medium">Book reference:</span> {meta.reference}
            </span>
          </div>
          {linkedSkill && onViewSkill && (
            <button
              onClick={() => onViewSkill(linkedSkill.id)}
              className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline w-full text-left"
            >
              <GraduationCap className="h-3 w-3 shrink-0" />
              <span>Related skill: <span className="font-medium">{linkedSkill.name}</span></span>
            </button>
          )}
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

          {entry.type === "diary-card" && view === "summary" ? (
            <DiaryCardSummary entry={entry} />
          ) : FormComponent ? (
            <FormComponent entry={entry} onChange={onChangeData} />
          ) : (
            <p className="text-sm text-muted-foreground">Unknown worksheet type: {entry.type}</p>
          )}

          <div className="mt-12 pt-6 border-t text-xs text-muted-foreground print:mt-6">
            <p>
              Worksheet format based on{" "}
              <span className="italic">
                DBT Skills Training Handouts and Worksheets, Second Edition
              </span>{" "}
              by Marsha M. Linehan (Guilford Press, 2014). Not a substitute for treatment.{" "}
              {isSignedIn
                ? "Your entries are saved automatically and sync to your account."
                : "Your entries are saved on this device."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
