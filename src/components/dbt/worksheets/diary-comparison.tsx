"use client";

import * as React from "react";
import {
  type WorksheetEntry,
  getWorksheetTypeMeta,
} from "@/lib/worksheet-storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, TrendingUp, TrendingDown, Minus, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { exportComparisonToPdf } from "@/lib/worksheet-pdf";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diaryCards: WorksheetEntry[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Metrics to compare side-by-side
const METRIC_GROUPS: {
  title: string;
  metrics: { key: string; label: string }[];
}[] = [
  {
    title: "Urges",
    metrics: [
      { key: "urgeSelfHarm", label: "Self-harm urge" },
      { key: "urgeSuicide", label: "Suicide urge" },
      { key: "urgeSubstances", label: "Substance urge" },
      { key: "urgeQuitTherapy", label: "Quit therapy urge" },
    ],
  },
  {
    title: "Actions",
    metrics: [
      { key: "actSelfHarm", label: "Self-harm" },
      { key: "actSubstances", label: "Substance use" },
      { key: "actOther", label: "Other target" },
    ],
  },
  {
    title: "Emotions",
    metrics: [
      { key: "emoAnger", label: "Anger" },
      { key: "emoSadness", label: "Sadness" },
      { key: "emoFear", label: "Fear" },
      { key: "emoShame", label: "Shame" },
      { key: "emoJoy", label: "Joy" },
    ],
  },
];

// Type for weekly stats returned by computeStats
interface WeekStats {
  sum: (key: string) => number;
  avg: (key: string) => number;
  max: (key: string) => number;
  skillsDays: number;
  actionDays: number;
  days: any[];
}

// Compute weekly stats for a single diary card
function computeStats(entry: WorksheetEntry | undefined): WeekStats | null {
  if (!entry) return null;
  const days: any[] = entry.data.days ?? [];
  const sum = (key: string) =>
    days.reduce((acc, d) => acc + (Number(d?.[key] ?? 0) || 0), 0);
  const avg = (key: string) => sum(key) / (days.length || 1);
  const max = (key: string) =>
    days.reduce((m, d) => Math.max(m, Number(d?.[key] ?? 0) || 0), 0);
  const skillsDays = days.filter(
    (d) =>
      d?.skillMindfulness ||
      d?.skillDistressTolerance ||
      d?.skillEmotionRegulation ||
      d?.skillInterpersonal
  ).length;
  const actionDays = days.filter(
    (d) => (d?.actSelfHarm ?? 0) > 0 || (d?.actSubstances ?? 0) > 0
  ).length;
  return { sum, avg, max, skillsDays, actionDays, days };
}

export function DiaryComparison({ open, onOpenChange, diaryCards }: Props) {
  const [leftId, setLeftId] = React.useState<string>("");
  const [rightId, setRightId] = React.useState<string>("");

  // Set default selections when modal opens
  React.useEffect(() => {
    if (open && diaryCards.length >= 2) {
      // Sort by createdAt ascending — left = older, right = newer
      const sorted = [...diaryCards].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      if (!leftId) setLeftId(sorted[0].id);
      if (!rightId) setRightId(sorted[sorted.length - 1].id);
    }
  }, [open, diaryCards, leftId, rightId]);

  const left = diaryCards.find((d) => d.id === leftId);
  const right = diaryCards.find((d) => d.id === rightId);

  const leftStats = computeStats(left);
  const rightStats = computeStats(right);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <DialogTitle>Compare two diary cards</DialogTitle>
              <DialogDescription>
                See two weeks side-by-side to spot trends. The right column is
                typically the more recent week.
              </DialogDescription>
            </div>
            {left && right && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportComparisonToPdf(left, right)}
                className="shrink-0"
              >
                <FileDown className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        {diaryCards.length < 2 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            You need at least 2 saved diary cards to compare. Create another
            one to enable this feature.
          </div>
        ) : (
          <>
            {/* Pickers */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Left week (older)
                </Label>
                <Select value={leftId} onValueChange={setLeftId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a diary card" />
                  </SelectTrigger>
                  <SelectContent>
                    {diaryCards.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.title}
                        {d.data.weekStartDate ? ` (week of ${d.data.weekStartDate})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Right week (newer)
                </Label>
                <Select value={rightId} onValueChange={setRightId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a diary card" />
                  </SelectTrigger>
                  <SelectContent>
                    {diaryCards.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.title}
                        {d.data.weekStartDate ? ` (week of ${d.data.weekStartDate})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {left && right && leftStats && rightStats ? (
              <ComparisonTable
                left={left}
                right={right}
                leftStats={leftStats}
                rightStats={rightStats}
              />
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Pick two diary cards above to see the comparison.
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ComparisonTable({
  left,
  right,
  leftStats,
  rightStats,
}: {
  left: WorksheetEntry;
  right: WorksheetEntry;
  leftStats: WeekStats;
  rightStats: WeekStats;
}) {
  return (
    <div className="space-y-6">
      {/* Week labels */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center pb-2 border-b">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Week 1</div>
          <div className="text-sm font-semibold">
            {left.data.weekStartDate
              ? new Date(left.data.weekStartDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
              : left.title}
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Week 2</div>
          <div className="text-sm font-semibold">
            {right.data.weekStartDate
              ? new Date(right.data.weekStartDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
              : right.title}
          </div>
        </div>
      </div>

      {/* High-level stats */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
        <StatCompare
          label="Skills-practice days"
          leftValue={leftStats.skillsDays}
          rightValue={rightStats.skillsDays}
          higherIsBetter
        />
        <div />
        <StatCompare
          label="Action days"
          leftValue={leftStats.actionDays}
          rightValue={rightStats.actionDays}
          higherIsBetter={false}
        />
      </div>

      {/* Metric-by-metric comparison */}
      {METRIC_GROUPS.map((group) => (
        <div key={group.title} className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {group.title}
          </h3>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-2 text-xs font-semibold">Metric</th>
                  <th className="p-2 text-xs font-semibold text-center">Week 1 (max / avg)</th>
                  <th className="p-2 text-xs font-semibold text-center">Trend</th>
                  <th className="p-2 text-xs font-semibold text-center">Week 2 (max / avg)</th>
                </tr>
              </thead>
              <tbody>
                {group.metrics.map((metric) => {
                  const leftAvg = leftStats.avg(metric.key);
                  const rightAvg = rightStats.avg(metric.key);
                  const leftMax = leftStats.max(metric.key);
                  const rightMax = rightStats.max(metric.key);
                  return (
                    <tr key={metric.key} className="border-t">
                      <td className="p-2">{metric.label}</td>
                      <td className="p-2 text-center font-mono tabular-nums">
                        <span className="font-semibold">{leftMax}</span>
                        <span className="text-muted-foreground text-xs"> / {leftAvg.toFixed(1)}</span>
                      </td>
                      <td className="p-2 text-center">
                        <TrendIcon
                          left={leftAvg}
                          right={rightAvg}
                          // For most metrics, decrease is good. For joy, increase is good.
                          higherIsBetter={metric.key === "emoJoy"}
                        />
                      </td>
                      <td className="p-2 text-center font-mono tabular-nums">
                        <span className="font-semibold">{rightMax}</span>
                        <span className="text-muted-foreground text-xs"> / {rightAvg.toFixed(1)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Skills usage comparison */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Skills used (days/week)
        </h3>
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-2 text-xs font-semibold">Skill module</th>
                <th className="p-2 text-xs font-semibold text-center">Week 1</th>
                <th className="p-2 text-xs font-semibold text-center">Trend</th>
                <th className="p-2 text-xs font-semibold text-center">Week 2</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: "skillMindfulness", label: "Mindfulness" },
                { key: "skillDistressTolerance", label: "Distress Tolerance" },
                { key: "skillEmotionRegulation", label: "Emotion Regulation" },
                { key: "skillInterpersonal", label: "Interpersonal" },
              ].map((sk) => {
                const leftCount = leftStats.days.filter((d) => d?.[sk.key]).length;
                const rightCount = rightStats.days.filter((d) => d?.[sk.key]).length;
                return (
                  <tr key={sk.key} className="border-t">
                    <td className="p-2">{sk.label}</td>
                    <td className="p-2 text-center font-mono">{leftCount}/7</td>
                    <td className="p-2 text-center">
                      <TrendIcon left={leftCount} right={rightCount} higherIsBetter />
                    </td>
                    <td className="p-2 text-center font-mono">{rightCount}/7</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCompare({
  label,
  leftValue,
  rightValue,
  higherIsBetter,
}: {
  label: string;
  leftValue: number;
  rightValue: number;
  higherIsBetter: boolean;
}) {
  return (
    <div className="rounded-md border p-3 space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold tabular-nums">{leftValue}</span>
        <span className="text-muted-foreground">→</span>
        <span className="text-xl font-bold tabular-nums">{rightValue}</span>
        <TrendIcon left={leftValue} right={rightValue} higherIsBetter={higherIsBetter} showLabel />
      </div>
    </div>
  );
}

function TrendIcon({
  left,
  right,
  higherIsBetter,
  showLabel = false,
}: {
  left: number;
  right: number;
  higherIsBetter: boolean;
  showLabel?: boolean;
}) {
  const delta = right - left;
  if (Math.abs(delta) < 0.01) {
    return (
      <span className="inline-flex items-center text-muted-foreground text-xs">
        <Minus className="h-3 w-3" />
        {showLabel && <span className="ml-1">no change</span>}
      </span>
    );
  }
  const isUp = delta > 0;
  const isGood = higherIsBetter ? isUp : !isUp;
  const Icon = isUp ? TrendingUp : TrendingDown;
  const colorClass = isGood
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

  return (
    <span className={cn("inline-flex items-center text-xs font-medium", colorClass)}>
      <Icon className="h-3 w-3" />
      {showLabel && (
        <span className="ml-1">
          {isUp ? "+" : ""}{delta.toFixed(delta % 1 === 0 ? 0 : 1)}
        </span>
      )}
    </span>
  );
}
