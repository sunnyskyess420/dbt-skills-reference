"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Calendar, Activity, Target, Award, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  entries: WorksheetEntry[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Emotion/urge metrics to track
const URGE_METRICS = [
  { key: "urgeSelfHarm", label: "Self-harm urge", color: "bg-rose-500" },
  { key: "urgeSuicide", label: "Suicide urge", color: "bg-red-700" },
  { key: "urgeSubstances", label: "Substance urge", color: "bg-amber-500" },
];
const EMOTION_METRICS = [
  { key: "emoAnger", label: "Anger", color: "bg-red-500" },
  { key: "emoSadness", label: "Sadness", color: "bg-blue-500" },
  { key: "emoShame", label: "Shame", color: "bg-orange-700" },
  { key: "emoJoy", label: "Joy", color: "bg-emerald-500" },
];
const SKILL_KEYS = [
  { key: "skillMindfulness", label: "Mindfulness" },
  { key: "skillDistressTolerance", label: "Distress Tolerance" },
  { key: "skillEmotionRegulation", label: "Emotion Regulation" },
  { key: "skillInterpersonal", label: "Interpersonal" },
];

export function ProgressDashboard({ entries }: Props) {
  // Get all diary cards, sorted by date
  const diaryCards = React.useMemo(() => {
    return entries
      .filter((e) => e.type === "diary-card")
      .sort((a, b) => {
        const aDate = a.data.weekStartDate || a.createdAt;
        const bDate = b.data.weekStartDate || b.createdAt;
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      });
  }, [entries]);

  // Calculate aggregate stats
  const stats = React.useMemo(() => {
    const totalWorksheets = entries.length;
    const totalDiaryCards = diaryCards.length;
    const totalChainAnalyses = entries.filter((e) => e.type === "chain-analysis").length;

    // Skills practiced across all diary cards
    let skillCounts: Record<string, number> = {};
    for (const sk of SKILL_KEYS) skillCounts[sk.key] = 0;
    let totalSkillDays = 0;
    let totalActionDays = 0;
    let totalDaysTracked = 0;

    for (const card of diaryCards) {
      const days = card.data.days ?? [];
      for (const day of days) {
        if (day?.date) totalDaysTracked++;
        for (const sk of SKILL_KEYS) {
          if (day?.[sk.key]) {
            skillCounts[sk.key]++;
            totalSkillDays++;
          }
        }
        if ((day?.actSelfHarm ?? 0) > 0 || (day?.actSubstances ?? 0) > 0) {
          totalActionDays++;
        }
      }
    }

    // Worksheet type breakdown
    const typeCounts: Record<string, number> = {};
    for (const e of entries) {
      typeCounts[e.type] = (typeCounts[e.type] ?? 0) + 1;
    }

    return {
      totalWorksheets,
      totalDiaryCards,
      totalChainAnalyses,
      skillCounts,
      totalSkillDays,
      totalActionDays,
      totalDaysTracked,
      typeCounts,
    };
  }, [entries, diaryCards]);

  // Build trend data (max 8 most recent weeks)
  const trendData = React.useMemo(() => {
    const recent = diaryCards.slice(-8);
    return recent.map((card) => {
      const days = card.data.days ?? [];
      const label = card.data.weekStartDate
        ? new Date(card.data.weekStartDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : card.title.slice(0, 12);

      const avg = (key: string) => {
        const values = days.map((d) => Number(d?.[key] ?? 0));
        return values.reduce((a, b) => a + b, 0) / (values.length || 1);
      };

      return {
        label,
        urgeSelfHarm: avg("urgeSelfHarm"),
        urgeSuicide: avg("urgeSuicide"),
        urgeSubstances: avg("urgeSubstances"),
        emoAnger: avg("emoAnger"),
        emoSadness: avg("emoSadness"),
        emoShame: avg("emoShame"),
        emoJoy: avg("emoJoy"),
      };
    });
  }, [diaryCards]);

  // Recent worksheets (last 5)
  const recentWorksheets = React.useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [entries]);

  // If no data, show empty state
  if (entries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Activity className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Progress Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your progress dashboard will come alive once you start creating worksheets.
            Create a Diary Card or any other worksheet, then come back here to see
            trends in your urges, emotions, and skills practiced over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Progress Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Trends across {stats.totalWorksheets} worksheet{stats.totalWorksheets === 1 ? "" : "s"} and {stats.totalDiaryCards} diary card{stats.totalDiaryCards === 1 ? "" : "s"}.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<BookOpen className="h-4 w-4" />}
            label="Total worksheets"
            value={stats.totalWorksheets}
            sublabel="all types"
          />
          <StatCard
            icon={<Calendar className="h-4 w-4" />}
            label="Diary cards"
            value={stats.totalDiaryCards}
            sublabel="weeks tracked"
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            label="Skills-practice days"
            value={stats.totalSkillDays}
            sublabel={`${stats.totalDaysTracked} days tracked`}
            tone={stats.totalSkillDays > 0 ? "good" : "neutral"}
          />
          <StatCard
            icon={<Award className="h-4 w-4" />}
            label="Action days"
            value={stats.totalActionDays}
            sublabel="self-harm or substance use"
            tone={stats.totalActionDays === 0 ? "good" : "warning"}
          />
        </div>

        {/* Urge trends chart */}
        {trendData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Urge trends (weekly average)</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={trendData} metrics={URGE_METRICS} />
            </CardContent>
          </Card>
        )}

        {/* Emotion trends chart */}
        {trendData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Emotion trends (weekly average)</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={trendData} metrics={EMOTION_METRICS} />
            </CardContent>
          </Card>
        )}

        {/* Skills practiced breakdown */}
        {stats.totalSkillDays > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Skills practiced (total days across all weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SKILL_KEYS.map((sk) => {
                  const count = stats.skillCounts[sk.key] ?? 0;
                  const pct = stats.totalDaysTracked > 0 ? (count / stats.totalDaysTracked) * 100 : 0;
                  return (
                    <div key={sk.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{sk.label}</span>
                        <span className="text-muted-foreground">{count} day{count === 1 ? "" : "s"}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Worksheet type breakdown */}
        {stats.totalWorksheets > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Worksheet breakdown by type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(stats.typeCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between rounded-md border p-2">
                      <span className="text-xs font-medium capitalize">{type.replace(/-/g, " ")}</span>
                      <span className="text-xs font-mono font-semibold tabular-nums">{count}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent worksheets */}
        {recentWorksheets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Recent worksheets</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {recentWorksheets.map((ws) => (
                  <li key={ws.id} className="flex items-center justify-between gap-2 text-xs py-1 border-b last:border-0">
                    <span className="font-medium truncate">{ws.title}</span>
                    <span className="text-muted-foreground shrink-0">
                      {new Date(ws.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sublabel?: string;
  tone?: "neutral" | "good" | "warning";
}) {
  const toneClass = {
    neutral: "border-border",
    good: "border-emerald-500/50 bg-emerald-500/5",
    warning: "border-amber-500/50 bg-amber-500/5",
  }[tone];

  return (
    <div className={cn("rounded-md border p-3", toneClass)}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px]">{label}</span>
      </div>
      <div className="text-2xl font-bold tabular-nums mt-1">{value}</div>
      {sublabel && <div className="text-[10px] text-muted-foreground mt-0.5">{sublabel}</div>}
    </div>
  );
}

function TrendChart({
  data,
  metrics,
}: {
  data: { label: string; [key: string]: number | string }[];
  metrics: { key: string; label: string; color: string }[];
}) {
  if (data.length === 0) return null;

  const maxVal = 5; // All metrics are 0-5 scale

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-3">
        {metrics.map((m) => (
          <div key={m.key} className="flex items-center gap-1.5">
            <div className={cn("h-2.5 w-2.5 rounded-full", m.color)} />
            <span className="text-[11px] text-muted-foreground">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex items-end gap-1 sm:gap-2 h-40 border-b border-l pb-1 pl-1 relative">
        {/* Y-axis labels */}
        <div className="absolute -left-7 top-0 bottom-4 flex flex-col justify-between text-[9px] text-muted-foreground">
          <span>5</span>
          <span>3</span>
          <span>1</span>
          <span>0</span>
        </div>

        {/* Bars */}
        {data.map((d, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
            <div className="flex items-end gap-0.5 h-full w-full justify-center">
              {metrics.map((m) => {
                const val = Number(d[m.key] ?? 0);
                const height = (val / maxVal) * 100;
                return (
                  <div
                    key={m.key}
                    className={cn("w-2 sm:w-3 rounded-t-sm transition-all", m.color)}
                    style={{ height: `${Math.max(height, 1)}%`, minHeight: val > 0 ? "2px" : "0" }}
                    title={`${m.label}: ${val.toFixed(1)}`}
                  />
                );
              })}
            </div>
            <span className="text-[9px] text-muted-foreground truncate w-full text-center">
              {d.label}
            </span>
          </div>
        ))}
      </div>

      {data.length === 1 && (
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          Create more diary cards to see trends across multiple weeks.
        </p>
      )}
    </div>
  );
}
