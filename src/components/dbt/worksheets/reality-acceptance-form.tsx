"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScaleField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { CheckRow, WeekTabs } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Distress Tolerance Worksheet 8 — weekly reality acceptance log.
const CHECKS: { key: string; label: string }[] = [
  { key: "radicalAcceptance", label: "Practised radical acceptance (accepted with my body, not just my words)" },
  { key: "turningMind", label: "Turned the mind back when it wandered into 'this shouldn't be happening'" },
  { key: "willingness", label: "Chose willingness over willfulness" },
  { key: "halfSmiling", label: "Used half-smiling and willing hands" },
  { key: "mindfulnessThoughts", label: "Watched thoughts come and go instead of arguing with them" },
];

export function RealityAcceptanceForm({ entry, onChange }: Props) {
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
          subtitle="Reality acceptance is a practice you repeat, not a decision you make once."
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
        <SectionHeading number={2} title="Daily log" subtitle="What was the reality you had to accept today — and what did you actually do?" />
        <WeekTabs entries={entries} onUpdate={updateEntry}>
          {(day, update, label) => (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  The reality I had to accept
                </Label>
                <Textarea
                  value={day.reality ?? ""}
                  onChange={(e) => update("reality", e.target.value)}
                  placeholder="Plain facts only — no story, no blame."
                  rows={2}
                  className="resize-y"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {CHECKS.map((c) => (
                  <CheckRow
                    key={c.key}
                    id={`${label}-${c.key}`}
                    label={c.label}
                    checked={!!day[c.key]}
                    onToggle={(v) => update(c.key, v)}
                  />
                ))}
              </div>

              <ScaleField
                label="How much did I fight reality today?"
                value={day.fighting ?? 0}
                onChange={(v) => update("fighting", v)}
                help="0 = none, 5 = constant 'it shouldn't be like this'"
              />

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Notes
                </Label>
                <Textarea
                  value={day.notes ?? ""}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="What helped? What pulled you back into willfulness?"
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
          label="Where acceptance is getting easier"
          value={data.easier ?? ""}
          onChange={(v) => updateMeta("easier", v)}
          placeholder="Even slightly easier counts."
          rows={2}
        />
        <TextAreaField
          label="Where I am still saying 'no' to reality"
          value={data.stillFighting ?? ""}
          onChange={(v) => updateMeta("stillFighting", v)}
          placeholder="Name the situation to bring to session."
          rows={2}
        />
      </section>
    </div>
  );
}
