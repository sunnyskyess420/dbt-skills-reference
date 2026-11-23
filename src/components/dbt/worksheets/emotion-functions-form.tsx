"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { CheckRow } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Emotion Regulation Worksheet 2 — figuring out what my emotions are doing
// for me. Based on the idea that every emotion is doing a job, even when the
// job is expensive.
const FUNCTIONS = [
  { key: "communicates", label: "Communicates something to other people" },
  { key: "motivates", label: "Motivates me to act (or to avoid)" },
  { key: "organises", label: "Organises what I remember and notice" },
  { key: "signals", label: "Signals that something needs to change" },
  { key: "protects", label: "Protects me from something worse" },
  { key: "connects", label: "Brings other people closer" },
  { key: "punishes", label: "Punishes me or someone else" },
  { key: "confirms", label: "Confirms something I already believe about myself" },
];

export function EmotionFunctionsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const functions: Record<string, boolean> = data.functions ?? {};
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The emotion"
          subtitle="One emotion you keep having. Describe it before you explain it."
        />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="Emotion and situation"
          value={data.emotion ?? ""}
          onChange={(v) => update("emotion", v)}
          placeholder="e.g. Anger, when I'm asked to redo work I already finished."
          rows={2}
        />
        <TextAreaField
          label="What I do when it shows up"
          value={data.actionUrge ?? ""}
          onChange={(v) => update("actionUrge", v)}
          placeholder="The urge, and what I actually do."
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="What it's doing for me" subtitle="Tick every job this emotion does. Several can be true at once." />
        <div className="grid gap-2 sm:grid-cols-2">
          {FUNCTIONS.map((f) => (
            <CheckRow
              key={f.key}
              id={`fn-${f.key}`}
              label={f.label}
              checked={!!functions[f.key]}
              onToggle={(v) => update("functions", { ...functions, [f.key]: v })}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Is the job worth the cost?" subtitle="This is the honest part. An emotion can be doing something useful and still be ruining your week." />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What it gets me
          </Label>
          <Textarea
            value={data.benefit ?? ""}
            onChange={(e) => update("benefit", e.target.value)}
            placeholder="Short-term payoff, protection, information."
            rows={2}
            className="resize-y"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What it costs me
          </Label>
          <Textarea
            value={data.cost ?? ""}
            onChange={(e) => update("cost", e.target.value)}
            placeholder="Relationships, energy, the things I don't do because of it."
            rows={2}
            className="resize-y"
          />
        </div>
        <TextAreaField
          label="What I'd rather have it do"
          value={data.preferredFunction ?? ""}
          onChange={(v) => update("preferredFunction", v)}
          placeholder="If the emotion could keep its message but drop the wreckage, what would that look like?"
          rows={3}
        />
      </section>
    </div>
  );
}
