"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateField, ScaleField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Mindfulness Worksheet 1 — pros and cons of practicing mindfulness versus
// staying mindless. Same four-box shape as the emotion-regulation version;
// the willingness rating replaces the emotion intensity.
const QUADRANTS: { key: string; label: string; hint: string }[] = [
  {
    key: "practicePros",
    label: "Pros of practicing",
    hint: "What does being mindful actually buy me — in this hour, this week?",
  },
  {
    key: "practiceCons",
    label: "Cons of practicing",
    hint: "What does mindfulness cost me — time, comfort, the escape I get from emotion mind?",
  },
  {
    key: "mindlessPros",
    label: "Pros of staying mindless",
    hint: "What do I get from not practicing — numbing, winning the argument, avoiding the moment?",
  },
  {
    key: "mindlessCons",
    label: "Cons of staying mindless",
    hint: "What does mindlessness cost me — missed moments, acted-out urges, the same problems on repeat?",
  },
];

export function MindfulnessProsConsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The decision"
          subtitle="Fill this when you're deciding whether to work on being more mindful — or when willfulness is talking you out of it."
        />
        <DateField label="Week starting" value={data.weekStartDate ?? ""} onChange={(v) => update("weekStartDate", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <ScaleField
            label="Willingness to practice — before"
            value={data.willingnessBefore ?? 0}
            onChange={(v) => update("willingnessBefore", v)}
          />
          <ScaleField
            label="Willingness to practice — after"
            value={data.willingnessAfter ?? 0}
            onChange={(v) => update("willingnessAfter", v)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="The balance"
          subtitle="Is a mindless life effective or not? Fill all four boxes — an empty con box is a decision already made."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {QUADRANTS.map((q) => (
            <div key={q.key} className="space-y-1.5 rounded-md border p-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {q.label}
              </Label>
              <Textarea
                value={data[q.key] ?? ""}
                onChange={(e) => update(q.key, e.target.value)}
                placeholder={q.hint}
                rows={5}
                className="resize-y"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="What you decided"
          subtitle="Observing without reacting increases freedom; staying attached to judgments decreases it. Which is it for you?"
        />
        <TextAreaField
          label="What I decided to do"
          value={data.decision ?? ""}
          onChange={(v) => update("decision", v)}
          placeholder="e.g. 'Practice one mindful minute at breakfast, even when I don't feel like it.'"
          rows={3}
        />
        <TextAreaField
          label="Is this the best decision in Wise Mind?"
          value={data.wiseMindCheck ?? ""}
          onChange={(v) => update("wiseMindCheck", v)}
          placeholder="Emotion mind wants out; reasonable mind wants results. What does Wise Mind say?"
          rows={3}
        />
        <TextAreaField
          label="Wise things I did this week"
          value={data.wiseThings ?? ""}
          onChange={(v) => update("wiseThings", v)}
          placeholder="Moments you stayed in the moment instead of reacting — even tiny ones."
          rows={3}
        />
      </section>
    </div>
  );
}
