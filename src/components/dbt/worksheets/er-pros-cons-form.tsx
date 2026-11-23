"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateField, ScaleField, TextAreaField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Emotion Regulation Worksheet 1 — pros and cons of changing this emotion
// versus staying in it. Same four-box shape as the distress-tolerance
// pros-and-cons sheet, applied to an emotion instead of an urge.
const QUADRANTS: { key: string; label: string; hint: string }[] = [
  {
    key: "changePros",
    label: "Pros of changing it",
    hint: "What gets better if this emotion comes down or I act differently?",
  },
  {
    key: "changeCons",
    label: "Cons of changing it",
    hint: "What do I lose by regulating this emotion — information, energy, a way of coping?",
  },
  {
    key: "stayPros",
    label: "Pros of staying in it",
    hint: "What does keeping this emotion give me right now?",
  },
  {
    key: "stayCons",
    label: "Cons of staying in it",
    hint: "What does keeping this emotion cost me — relationships, sleep, the next hour?",
  },
];

export function ErProsConsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The emotion"
          subtitle="Name the emotion you're weighing — not 'feelings' in general."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
          <TextField
            label="Emotion"
            value={data.emotion ?? ""}
            onChange={(v) => update("emotion", v)}
            placeholder="e.g. anger, shame, panic"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ScaleField
            label="Intensity before"
            value={data.intensityBefore ?? 0}
            onChange={(v) => update("intensityBefore", v)}
          />
          <ScaleField
            label="Intensity after deciding"
            value={data.intensityAfter ?? 0}
            onChange={(v) => update("intensityAfter", v)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="The balance"
          subtitle="Fill all four boxes honestly. A sheet with empty cons is a sheet written to justify what you already decided."
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
          subtitle="Change it, stay with it, or act on it differently — then check whether Wise Mind agrees."
        />
        <TextAreaField
          label="What I decided to do about this emotion"
          value={data.decision ?? ""}
          onChange={(v) => update("decision", v)}
          placeholder="Name the actual move, not the feeling about the move."
          rows={3}
        />
        <TextAreaField
          label="Is this the best decision in Wise Mind?"
          value={data.wiseMindCheck ?? ""}
          onChange={(v) => update("wiseMindCheck", v)}
          placeholder="If emotion mind and reasonable mind disagree, what does Wise Mind say?"
          rows={3}
        />
        <TextAreaField
          label="Wise things I did this week"
          value={data.wiseThings ?? ""}
          onChange={(v) => update("wiseThings", v)}
          placeholder="Even small ones count — they are evidence the balance can tip the other way."
          rows={3}
        />
      </section>
    </div>
  );
}
