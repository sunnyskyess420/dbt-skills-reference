"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScaleField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { WeekTabs } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Emotion Regulation Worksheet 11b — diary of daily actions on values.
// The advanced companion to Values to Action Steps: one action a day, tied back
// to a named value, so the link shows up in the data instead of in a vow.
export function ValuesDiaryForm({ entry, onChange }: Props) {
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
          subtitle="This sheet assumes you already have a shortlist of values. If you don't, fill in Values and Priorities first."
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
        <SectionHeading number={2} title="Daily actions" subtitle="One action a day is enough. Small and specific beats big and vague." />
        <WeekTabs entries={entries} onUpdate={updateEntry}>
          {(day, update) => (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Value or priority
                </Label>
                <Input
                  value={day.value ?? ""}
                  onChange={(e) => update("value", e.target.value)}
                  placeholder="e.g. Being a reliable friend"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What I actually did
                </Label>
                <Textarea
                  value={day.action ?? ""}
                  onChange={(e) => update("action", e.target.value)}
                  placeholder="The action, not the intention."
                  rows={2}
                  className="resize-y"
                />
              </div>

              <ScaleField
                label="How much did that move me toward the life I want?"
                value={day.alignment ?? 0}
                onChange={(v) => update("alignment", v)}
                help="0 = not at all, 5 = straight at it"
              />

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What got in the way
                </Label>
                <Textarea
                  value={day.obstacle ?? ""}
                  onChange={(e) => update("obstacle", e.target.value)}
                  placeholder="Emotion, avoidance, another person, no time…"
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
          label="Which value got the most action"
          value={data.mostAction ?? ""}
          onChange={(v) => updateMeta("mostAction", v)}
          placeholder="And does that surprise you?"
          rows={2}
        />
        <TextAreaField
          label="Which value got none"
          value={data.noAction ?? ""}
          onChange={(v) => updateMeta("noAction", v)}
          placeholder="What would one small action there look like next week?"
          rows={2}
        />
      </section>
    </div>
  );
}
