"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateField, ScaleField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { CheckRow } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Distress Tolerance Worksheet 4a — paired muscle relaxation, step by step.
const GROUPS = [
  "Hands and forearms",
  "Upper arms and shoulders",
  "Forehead and scalp",
  "Eyes and nose",
  "Mouth and jaw",
  "Neck",
  "Chest and upper back",
  "Stomach",
  "Hips and lower back",
  "Thighs",
  "Calves and shins",
  "Feet and toes",
];

export function PairedMuscleForm({ entry, onChange }: Props) {
  const data = entry.data;
  const done: Record<string, boolean> = data.done ?? {};
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Before you start"
          subtitle="Tense one group for about five seconds while breathing in, then let go and breathe out. Release is the part that does the work."
        />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <ScaleField
          label="Tension before"
          value={data.tensionBefore ?? 0}
          onChange={(v) => update("tensionBefore", v)}
          help="0 = loose, 5 = braced everywhere"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Muscle groups" subtitle="Tick each group as you finish it. Stop and rest if anything hurts — this is not a workout." />
        <div className="grid gap-2 sm:grid-cols-2">
          {GROUPS.map((g, i) => (
            <CheckRow
              key={g}
              id={`group-${i}`}
              label={g}
              checked={!!done[g]}
              onToggle={(v) => update("done", { ...done, [g]: v })}
            />
          ))}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rounds completed
          </Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={data.rounds ?? ""}
            onChange={(e) => update("rounds", e.target.value)}
            className="max-w-[120px]"
            placeholder="e.g. 2"
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="After" />
        <ScaleField
          label="Tension after"
          value={data.tensionAfter ?? 0}
          onChange={(v) => update("tensionAfter", v)}
          help="Compare with where you started"
        />
        <TextAreaField
          label="What I noticed"
          value={data.noticed ?? ""}
          onChange={(v) => update("noticed", v)}
          placeholder="Where was I holding tension I hadn't noticed? Which group was hardest to release?"
          rows={3}
        />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Where I'd use this next time
          </Label>
          <Textarea
            value={data.nextUse ?? ""}
            onChange={(e) => update("nextUse", e.target.value)}
            placeholder="A specific situation, not 'when stressed'."
            rows={2}
            className="resize-y"
          />
        </div>
      </section>
    </div>
  );
}
