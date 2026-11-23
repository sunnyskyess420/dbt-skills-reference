"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { CheckRow, WeekTabs } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Mindfulness Worksheets 2, 2a, 2b, 2c — core skills practice and calendar.
const WHAT_SKILLS: { key: string; label: string }[] = [
  { key: "observe", label: "Observe — noticed without words" },
  { key: "describe", label: "Describe — put words on what I noticed" },
  { key: "participate", label: "Participate — threw myself in fully" },
];

const HOW_SKILLS: { key: string; label: string }[] = [
  { key: "nonjudgmental", label: "Nonjudgmentally — described, didn't rate" },
  { key: "oneMindful", label: "One-mindfully — one thing at a time" },
  { key: "effective", label: "Effectively — did what worked" },
];

export function MindfulnessCoreForm({ entry, onChange }: Props) {
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
          subtitle="Pick one ordinary activity each day and do it mindfully. Note which of the six skills you actually used."
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
        <SectionHeading number={2} title="Daily practice" />
        <WeekTabs entries={entries} onUpdate={updateEntry}>
          {(day, update, label) => (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What I did mindfully
                </Label>
                <Textarea
                  value={day.activity ?? ""}
                  onChange={(e) => update("activity", e.target.value)}
                  placeholder="Washing up, walking to the bus, one cup of tea…"
                  rows={2}
                  className="resize-y"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What skills</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {WHAT_SKILLS.map((s) => (
                    <CheckRow
                      key={s.key}
                      id={`${label}-${s.key}`}
                      label={s.label}
                      checked={!!day[s.key]}
                      onToggle={(v) => update(s.key, v)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How skills</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {HOW_SKILLS.map((s) => (
                    <CheckRow
                      key={s.key}
                      id={`${label}-${s.key}`}
                      label={s.label}
                      checked={!!day[s.key]}
                      onToggle={(v) => update(s.key, v)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What I noticed
                </Label>
                <Textarea
                  value={day.noticed ?? ""}
                  onChange={(e) => update("noticed", e.target.value)}
                  placeholder="Where did my mind go? What pulled me out?"
                  rows={2}
                  className="resize-y"
                />
              </div>
            </div>
          )}
        </WeekTabs>
      </section>

      <section className="space-y-4 border-t pt-6">
        <SectionHeading number={3} title="End of week" />
        <TextAreaField
          label="Which skill is getting easier"
          value={data.easiestSkill ?? ""}
          onChange={(v) => updateMeta("easiestSkill", v)}
          placeholder="And what made it easier?"
          rows={2}
        />
        <TextAreaField
          label="Which skill still feels out of reach"
          value={data.hardestSkill ?? ""}
          onChange={(v) => updateMeta("hardestSkill", v)}
          placeholder="Bring this to your skills group."
          rows={2}
        />
      </section>
    </div>
  );
}
