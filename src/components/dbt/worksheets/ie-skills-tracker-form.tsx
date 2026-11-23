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

// Interpersonal Effectiveness Worksheet 5 — tracking skills use.
const PRIORITIES = [
  { key: "objective", label: "Objective — got what I asked for" },
  { key: "relationship", label: "Relationship — kept the relationship" },
  { key: "selfRespect", label: "Self-respect — kept respect for myself" },
];

const TOOLS = [
  { key: "dearMan", label: "DEAR MAN" },
  { key: "give", label: "GIVE" },
  { key: "fast", label: "FAST" },
  { key: "validation", label: "Validation" },
  { key: "mindfulnessOfOthers", label: "Mindfulness of others" },
];

export function IeSkillsTrackerForm({ entry, onChange }: Props) {
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
          subtitle="One entry per interaction you deliberately used skills in — not every conversation, just the ones that mattered."
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
        <SectionHeading number={2} title="Daily entries" />
        <WeekTabs entries={entries} onUpdate={updateEntry}>
          {(day, update, label) => (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Situation
                </Label>
                <Textarea
                  value={day.situation ?? ""}
                  onChange={(e) => update("situation", e.target.value)}
                  placeholder="Who, about what, and what you wanted to happen."
                  rows={2}
                  className="resize-y"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What I prioritised
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {PRIORITIES.map((p) => (
                    <CheckRow
                      key={p.key}
                      id={`${label}-${p.key}`}
                      label={p.label}
                      checked={!!day[p.key]}
                      onToggle={(v) => update(p.key, v)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What I used
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {TOOLS.map((t) => (
                    <CheckRow
                      key={t.key}
                      id={`${label}-${t.key}`}
                      label={t.label}
                      checked={!!day[t.key]}
                      onToggle={(v) => update(t.key, v)}
                    />
                  ))}
                </div>
              </div>

              <ScaleField
                label="How effective was I?"
                value={day.effectiveness ?? 0}
                onChange={(v) => update("effectiveness", v)}
                help="0 = made it worse, 5 = got the outcome and kept the relationship"
              />

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What I would do differently
                </Label>
                <Textarea
                  value={day.nextTime ?? ""}
                  onChange={(e) => update("nextTime", e.target.value)}
                  placeholder="One concrete change for next time."
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
          label="Which priority do I drop under pressure?"
          value={data.droppedPriority ?? ""}
          onChange={(v) => updateMeta("droppedPriority", v)}
          placeholder="Most people sacrifice one predictably — which is yours?"
          rows={2}
        />
        <TextAreaField
          label="Where I need to rehearse"
          value={data.needsRehearsal ?? ""}
          onChange={(v) => updateMeta("needsRehearsal", v)}
          placeholder="A line to practise before the next hard conversation."
          rows={2}
        />
      </section>
    </div>
  );
}
