"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { generateDiarySuggestions } from "@/lib/diary-suggestions";
import { cn } from "@/lib/utils";

interface Props {
  entry: WorksheetEntry;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// All tracked metrics, grouped by category
const METRIC_GROUPS: {
  title: string;
  key: "urge" | "act" | "emo";
  metrics: { key: string; label: string; color: string }[];
}[] = [
  {
    title: "Urges (0–5)",
    key: "urge",
    metrics: [
      { key: "urgeSelfHarm", label: "Self-harm urge", color: "bg-rose-500" },
      { key: "urgeSuicide", label: "Suicide urge", color: "bg-red-700" },
      { key: "urgeSubstances", label: "Substance urge", color: "bg-amber-500" },
      { key: "urgeQuitTherapy", label: "Quit therapy urge", color: "bg-orange-500" },
    ],
  },
  {
    title: "Actions (0–5)",
    key: "act",
    metrics: [
      { key: "actSelfHarm", label: "Self-harm", color: "bg-rose-600" },
      { key: "actSubstances", label: "Substance use", color: "bg-amber-600" },
      { key: "actOther", label: "Other target", color: "bg-slate-500" },
    ],
  },
  {
    title: "Emotions (0–5)",
    key: "emo",
    metrics: [
      { key: "emoAnger", label: "Anger", color: "bg-red-500" },
      { key: "emoSadness", label: "Sadness", color: "bg-blue-500" },
      { key: "emoFear", label: "Fear", color: "bg-purple-500" },
      { key: "emoShame", label: "Shame", color: "bg-orange-700" },
      { key: "emoJoy", label: "Joy", color: "bg-emerald-500" },
    ],
  },
];

const SKILL_KEYS = [
  { key: "skillMindfulness", label: "Mindfulness" },
  { key: "skillDistressTolerance", label: "Distress Tolerance" },
  { key: "skillEmotionRegulation", label: "Emotion Regulation" },
  { key: "skillInterpersonal", label: "Interpersonal" },
];

export function DiaryCardSummary({ entry }: Props) {
  const data = entry.data;
  const days: any[] = data.days ?? [];

  // Generate skill suggestions based on this week's data
  const suggestions = React.useMemo(
    () => generateDiarySuggestions(entry),
    [entry]
  );

  // Calculate averages and totals
  const stats = React.useMemo(() => {
    const allMetrics = METRIC_GROUPS.flatMap((g) => g.metrics.map((m) => m.key));
    const averages: Record<string, number> = {};
    const maxes: Record<string, number> = {};

    for (const key of allMetrics) {
      const values = days.map((d) => Number(d?.[key] ?? 0));
      const sum = values.reduce((a, b) => a + b, 0);
      averages[key] = sum / (values.length || 1);
      maxes[key] = Math.max(...values, 0);
    }

    // Skills totals
    const skillCounts: Record<string, number> = {};
    for (const sk of SKILL_KEYS) {
      skillCounts[sk.key] = days.filter((d) => d?.[sk.key]).length;
    }

    // Days with any action > 0
    const crisisActionDays = days.filter(
      (d) => (d?.actSelfHarm ?? 0) > 0 || (d?.actSubstances ?? 0) > 0
    ).length;

    // Days with notes
    const daysWithNotes = days.filter((d) => (d?.notes ?? "").trim().length > 0).length;

    return {
      averages,
      maxes,
      skillCounts,
      crisisActionDays,
      daysWithNotes,
    };
  }, [days]);

  return (
    <div className="space-y-8">
      {/* Print-only header */}
      <div className="hidden print:block mb-6 pb-3 border-b">
        <h1 className="text-xl font-bold">{entry.title} — Weekly Summary</h1>
        <p className="text-sm text-muted-foreground">DBT Diary Card (7-day summary)</p>
        {data.weekStartDate && (
          <p className="text-xs mt-1">Week of {new Date(data.weekStartDate + "T00:00:00").toLocaleDateString()}</p>
        )}
      </div>

      {/* High-level cards */}
      <section>
        <h2 className="text-base font-semibold mb-3">Week at a glance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Days tracked"
            value={days.filter((d) => d?.date).length.toString()}
            sublabel={`of 7`}
          />
          <StatCard
            label="Skills-practice days"
            value={days.filter((d) =>
              SKILL_KEYS.some((sk) => d?.[sk.key])
            ).length.toString()}
            sublabel="at least one skill used"
          />
          <StatCard
            label="Action days"
            value={stats.crisisActionDays.toString()}
            sublabel="self-harm or substance use"
            tone={stats.crisisActionDays > 0 ? "warning" : "good"}
          />
          <StatCard
            label="Notes entered"
            value={stats.daysWithNotes.toString()}
            sublabel="days with notes"
          />
        </div>
      </section>

      {/* 7-day grid heatmap */}
      <section>
        <h2 className="text-base font-semibold mb-1">7-day heatmap</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Each cell shows the 0–5 rating for that day. Darker = higher intensity.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 sticky left-0 bg-background">Metric</th>
                {days.map((d, idx) => (
                  <th key={idx} className="p-2 text-center min-w-[60px]">
                    <div className="font-semibold">{DAY_LABELS[idx]}</div>
                    {d?.date && (
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}
                      </div>
                    )}
                  </th>
                ))}
                <th className="p-2 text-center bg-muted/30">Avg</th>
                <th className="p-2 text-center bg-muted/30">Max</th>
              </tr>
            </thead>
            <tbody>
              {METRIC_GROUPS.map((group) => (
                <React.Fragment key={group.key}>
                  <tr>
                    <td
                      colSpan={days.length + 3}
                      className="p-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/20"
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.metrics.map((metric) => (
                    <tr key={metric.key} className="border-t">
                      <td className="p-2 sticky left-0 bg-background">
                        <div className="flex items-center gap-1.5">
                          <span className={cn("inline-block h-2 w-2 rounded-full", metric.color)} />
                          {metric.label}
                        </div>
                      </td>
                      {days.map((d, idx) => {
                        const value = Number(d?.[metric.key] ?? 0);
                        return (
                          <td key={idx} className="p-1 text-center">
                            <HeatCell value={value} colorClass={metric.color} />
                          </td>
                        );
                      })}
                      <td className="p-2 text-center bg-muted/30 font-mono tabular-nums">
                        {stats.averages[metric.key].toFixed(1)}
                      </td>
                      <td className="p-2 text-center bg-muted/30 font-mono tabular-nums">
                        {stats.maxes[metric.key]}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Skills usage */}
      <section>
        <h2 className="text-base font-semibold mb-1">Skills used this week</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Number of days each skill module was used.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {SKILL_KEYS.map((sk) => {
            const count = stats.skillCounts[sk.key];
            const pct = (count / 7) * 100;
            return (
              <div key={sk.key} className="rounded-md border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{sk.label}</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {count}/7 days
                  </span>
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
      </section>

      {/* Daily notes */}
      <section>
        <h2 className="text-base font-semibold mb-1">Daily notes</h2>
        <p className="text-xs text-muted-foreground mb-3">
          All notes from the week, in order. Useful for therapy sessions.
        </p>
        {stats.daysWithNotes === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            No notes entered for any day yet.
          </div>
        ) : (
          <div className="space-y-2">
            {days.map((d, idx) => {
              const notes = (d?.notes ?? "").trim();
              if (!notes) return null;
              return (
                <div
                  key={idx}
                  className="rounded-md border p-3 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {DAY_LABELS[idx]}
                    </span>
                    {d?.date && (
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{notes}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Skill suggestions based on this week's data */}
      {suggestions.length > 0 && (
        <section>
          <h2 className="text-base font-semibold mb-1">Suggested skills for next week</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Based on which emotions, urges, and actions spiked this week.
            These are suggestions, not prescriptions — your therapist knows best.
          </p>
          <div className="space-y-2">
            {suggestions.map((sug) => {
              const priorityClass = {
                high: "border-l-rose-500 bg-rose-500/5",
                medium: "border-l-amber-500 bg-amber-500/5",
                low: "border-l-slate-400 bg-slate-400/5",
              }[sug.priority];
              const priorityLabel = {
                high: "High priority",
                medium: "Medium priority",
                low: "Worth considering",
              }[sug.priority];
              const moduleColor = {
                general: "text-slate-600 dark:text-slate-300",
                mindfulness: "text-emerald-600 dark:text-emerald-400",
                interpersonal: "text-amber-600 dark:text-amber-400",
                "emotion-regulation": "text-rose-600 dark:text-rose-400",
                "distress-tolerance": "text-sky-600 dark:text-sky-400",
              }[sug.module];
              return (
                <div
                  key={sug.skillId}
                  className={cn(
                    "rounded-md border border-l-4 p-3 space-y-1",
                    priorityClass
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-semibold">{sug.skillName}</span>
                      <span className={cn("text-[10px] uppercase tracking-wider font-medium", moduleColor)}>
                        {sug.module.replace("-", " ")}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {priorityLabel}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {sug.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state when no data entered */}
      {stats.daysWithNotes === 0 &&
        days.every((d) => !d?.date) &&
        Object.values(stats.averages).every((v) => v === 0) && (
          <section className="rounded-md border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No data entered yet for this week. Switch back to the Form view
              using the toggle at the top, then return here to see your weekly summary.
            </p>
          </section>
        )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "neutral" | "warning" | "good";
}) {
  const toneClass = {
    neutral: "border-border",
    warning: "border-amber-500/50 bg-amber-500/5",
    good: "border-emerald-500/50 bg-emerald-500/5",
  }[tone];

  return (
    <div className={cn("rounded-md border p-3", toneClass)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-0.5">{value}</div>
      {sublabel && <div className="text-[10px] text-muted-foreground mt-0.5">{sublabel}</div>}
    </div>
  );
}

function HeatCell({ value, colorClass }: { value: number; colorClass: string }) {
  // Render an empty cell when 0; otherwise a colored square with the value
  if (value === 0) {
    return (
      <div className="h-7 w-7 mx-auto rounded-sm bg-muted/30 text-muted-foreground/50 flex items-center justify-center text-[10px]">
        –
      </div>
    );
  }
  // Opacity scales with value (1-5 → 0.2 to 1.0)
  const opacity = Math.min(value / 5, 1);
  return (
    <div
      className={cn(
        "h-7 w-7 mx-auto rounded-sm flex items-center justify-center text-[10px] font-mono font-semibold text-white",
        colorClass
      )}
      style={{ opacity }}
    >
      {value}
    </div>
  );
}
