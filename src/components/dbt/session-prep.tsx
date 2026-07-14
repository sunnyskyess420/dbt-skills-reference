"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { getWorksheetTypeMeta } from "@/lib/worksheet-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, Printer, FileDown, CheckCircle2 } from "lucide-react";
import { exportToPdf } from "@/lib/worksheet-pdf";
import { cn } from "@/lib/utils";

interface Props {
  entries: WorksheetEntry[];
  onSelectWorksheet?: (entry: WorksheetEntry) => void;
}

interface SessionPrepState {
  // Checklist
  reviewedDiaryCards: boolean;
  reviewedChainAnalyses: boolean;
  reviewedWorksheets: boolean;
  identifiedPatterns: boolean;
  preparedQuestions: boolean;
  // Free text
  weekSummary: string;
  patterns: string;
  skillsWorked: string;
  skillsStruggled: string;
  questionsForTherapist: string;
  topicsToDiscuss: string;
  winsThisWeek: string;
}

function defaultState(): SessionPrepState {
  return {
    reviewedDiaryCards: false,
    reviewedChainAnalyses: false,
    reviewedWorksheets: false,
    identifiedPatterns: false,
    preparedQuestions: false,
    weekSummary: "",
    patterns: "",
    skillsWorked: "",
    skillsStruggled: "",
    questionsForTherapist: "",
    topicsToDiscuss: "",
    winsThisWeek: "",
  };
}

const STORAGE_KEY = "dbt-skills:session-prep";

const CHECKLIST_ITEMS: { key: keyof SessionPrepState; label: string; description: string }[] = [
  { key: "reviewedDiaryCards", label: "Review this week's diary card(s)", description: "Look at urges, emotions, and skills used" },
  { key: "reviewedChainAnalyses", label: "Review recent chain analyses", description: "Any problem behaviors to discuss?" },
  { key: "reviewedWorksheets", label: "Review other worksheets", description: "DEAR MAN scripts, check the facts, etc." },
  { key: "identifiedPatterns", label: "Identify patterns", description: "What triggers keep coming up? What works?" },
  { key: "preparedQuestions", label: "Prepare questions for therapist", description: "What do you want to ask or get help with?" },
];

export function SessionPrep({ entries, onSelectWorksheet }: Props) {
  const [state, setState] = React.useState<SessionPrepState>(defaultState);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState({ ...defaultState(), ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on change
  const update = (key: keyof SessionPrepState, value: any) => {
    const next = { ...state, [key]: value };
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // Get recent worksheets for reference
  const recentDiaryCards = entries
    .filter((e) => e.type === "diary-card")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const recentChainAnalyses = entries
    .filter((e) => e.type === "chain-analysis")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const checklistComplete = CHECKLIST_ITEMS.every((item) => state[item.key]);

  const handlePrint = () => {
    window.print();
  };

  const handleClear = () => {
    const cleared = defaultState();
    setState(cleared);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 print:hidden">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              Therapy Session Prep
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Prepare for your next therapy session. Review your week, identify patterns, and plan what to discuss.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handlePrint} className="shrink-0">
            <Printer className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>

        {/* Print-only header */}
        <div className="hidden print:block mb-6 pb-3 border-b">
          <h1 className="text-xl font-bold">Therapy Session Prep</h1>
          <p className="text-sm text-muted-foreground">Prepared {new Date().toLocaleDateString()}</p>
        </div>

        {/* Checklist */}
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              {checklistComplete ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground/30 text-[10px]">
                  {CHECKLIST_ITEMS.filter((i) => state[i.key]).length}/{CHECKLIST_ITEMS.length}
                </span>
              )}
              Pre-session checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {CHECKLIST_ITEMS.map((item) => (
              <label
                key={item.key}
                className={cn(
                  "flex items-start gap-2 p-2.5 rounded-md border cursor-pointer transition-colors",
                  state[item.key] ? "border-emerald-500/50 bg-emerald-500/5" : "border-border hover:bg-muted/40"
                )}
              >
                <Checkbox
                  checked={state[item.key] as boolean}
                  onCheckedChange={(c) => update(item.key, c === true)}
                  className="mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground">{item.description}</div>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Quick reference: recent worksheets */}
        {(recentDiaryCards.length > 0 || recentChainAnalyses.length > 0) && (
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Recent worksheets to review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDiaryCards.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Diary Cards</div>
                  <ul className="space-y-0.5">
                    {recentDiaryCards.map((ws) => (
                      <li key={ws.id}>
                        <button
                          onClick={() => onSelectWorksheet?.(ws)}
                          className="w-full text-xs flex items-center justify-between px-2 -mx-2 py-1 rounded hover:bg-muted/50 transition-colors text-left"
                        >
                          <span className="font-medium truncate">{ws.title}</span>
                          <span className="text-muted-foreground shrink-0">{new Date(ws.updatedAt).toLocaleDateString()}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {recentChainAnalyses.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Chain Analyses</div>
                  <ul className="space-y-0.5">
                    {recentChainAnalyses.map((ws) => (
                      <li key={ws.id}>
                        <button
                          onClick={() => onSelectWorksheet?.(ws)}
                          className="w-full text-xs flex items-center justify-between px-2 -mx-2 py-1 rounded hover:bg-muted/50 transition-colors text-left"
                        >
                          <span className="font-medium truncate">{ws.title}</span>
                          <span className="text-muted-foreground shrink-0">{new Date(ws.updatedAt).toLocaleDateString()}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Session summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              label="Week summary"
              value={state.weekSummary}
              onChange={(v) => update("weekSummary", v)}
              placeholder="Brief summary of how this week went overall..."
              hint="What happened this week? Any major events or stressors?"
            />
            <Field
              label="Patterns I noticed"
              value={state.patterns}
              onChange={(v) => update("patterns", v)}
              placeholder="What triggers keep coming up? What patterns do you see in your diary card data?"
            />
            <Field
              label="Skills that worked"
              value={state.skillsWorked}
              onChange={(v) => update("skillsWorked", v)}
              placeholder="Which skills helped this week? When did you use them?"
            />
            <Field
              label="Skills I struggled with"
              value={state.skillsStruggled}
              onChange={(v) => update("skillsStruggled", v)}
              placeholder="Which skills were hard to use? When did you forget or avoid them?"
            />
            <Field
              label="Wins this week"
              value={state.winsThisWeek}
              onChange={(v) => update("winsThisWeek", v)}
              placeholder="What went well? What are you proud of? (Even small things count)"
            />
            <Field
              label="Questions for my therapist"
              value={state.questionsForTherapist}
              onChange={(v) => update("questionsForTherapist", v)}
              placeholder="What do you want to ask or get help with in session?"
            />
            <Field
              label="Topics to discuss"
              value={state.topicsToDiscuss}
              onChange={(v) => update("topicsToDiscuss", v)}
              placeholder="Any specific topics you want to make sure you cover?"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handleClear} className="text-muted-foreground">
            Clear all
          </Button>
          <span className="text-[11px] text-muted-foreground ml-auto">
            Saved automatically to your browser
          </span>
        </div>

        {/* Print-only summary */}
        <div className="hidden print:block space-y-4 mt-6">
          <PrintField label="Week summary" value={state.weekSummary} />
          <PrintField label="Patterns I noticed" value={state.patterns} />
          <PrintField label="Skills that worked" value={state.skillsWorked} />
          <PrintField label="Skills I struggled with" value={state.skillsStruggled} />
          <PrintField label="Wins this week" value={state.winsThisWeek} />
          <PrintField label="Questions for my therapist" value={state.questionsForTherapist} />
          <PrintField label="Topics to discuss" value={state.topicsToDiscuss} />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="resize-y"
      />
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PrintField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">{label}</div>
      <div className="text-sm mt-1 min-h-[1.5rem] whitespace-pre-wrap">{value || <span className="text-gray-400 italic">(blank)</span>}</div>
    </div>
  );
}
