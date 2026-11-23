"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScaleField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { CheckRow, WeekTabs } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Emotion Regulation Worksheet 13 — the day-by-day companion to the weekly
// vulnerability review. Each day plans and then reports on the three ABC
// tasks: accumulate a positive, build mastery, cope ahead.
const ABC_SKILLS: { planKey: string; didKey: string; label: string }[] = [
  { planKey: "accPosPlan", didKey: "accPosDid", label: "Accumulate a positive emotion" },
  { planKey: "masteryPlan", didKey: "masteryDid", label: "Build mastery" },
  { planKey: "copePlan", didKey: "copeDid", label: "Cope ahead" },
];

export function AbcDiaryForm({ entry, onChange }: Props) {
  const data = entry.data;
  const entries: any[] = data.entries ?? [];
  const updateMeta = (key: string, value: string) => onChange({ ...data, [key]: value });
  const updateEntry = (idx: number, field: string, value: any) => {
    const next = [...entries];
    next[idx] = { ...next[idx], [field]: value };
    onChange({ ...data, entries: next });
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Week"
          subtitle="Plan the day in the morning, check what actually happened at night. Over weeks the gap between plan and done shrinks."
        />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Week starting
          </Label>
          <Input
            type="date"
            value={data.weekStartDate ?? ""}
            onChange={(e) => updateMeta("weekStartDate", e.target.value)}
            className="max-w-[200px]"
          />
        </div>
      </section>

      <section>
        <SectionHeading
          number={2}
          title="Daily ABC"
          subtitle="For each skill: what I planned, then whether I actually did it."
        />
        <WeekTabs entries={entries} onUpdate={updateEntry}>
          {(day, update, label) => (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <ScaleField
                  label="Negative mood — start of day"
                  value={day.moodStart ?? 0}
                  onChange={(v) => update("moodStart", v)}
                />
                <ScaleField
                  label="Negative mood — end of day"
                  value={day.moodEnd ?? 0}
                  onChange={(v) => update("moodEnd", v)}
                />
              </div>

              {ABC_SKILLS.map((skill) => (
                <div key={skill.planKey} className="space-y-2 rounded-md border p-3">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {skill.label}
                  </Label>
                  <Input
                    value={day[skill.planKey] ?? ""}
                    onChange={(e) => update(skill.planKey, e.target.value)}
                    placeholder="What I planned to do"
                  />
                  <CheckRow
                    id={`${label}-${skill.didKey}`}
                    label="I actually did it"
                    checked={!!day[skill.didKey]}
                    onToggle={(v) => update(skill.didKey, v)}
                  />
                </div>
              ))}
            </div>
          )}
        </WeekTabs>
      </section>

      <section className="space-y-4 border-t pt-6">
        <SectionHeading
          number={3}
          title="End of week"
          subtitle="Look across the seven days before planning the next one."
        />
        <TextAreaField
          label="What I notice"
          value={data.reflection ?? ""}
          onChange={(v) => updateMeta("reflection", v)}
          placeholder="Which of the three tasks happened most? Where did the plan keep losing to the day?"
          rows={2}
        />
      </section>
    </div>
  );
}
