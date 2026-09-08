"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function BalancingDoingBeingForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} subtitle="Which mode are you in right now? Doing Mind (goal-focused) or Being Mind (present-moment)?">
          Check in
        </SectionHeading>
        <DateField label="Date" value={data.entryDate} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="Current mode"
          value={data.currentMode}
          onChange={(v) => update("currentMode", v)}
          placeholder="Are you in doing mind or being mind? What tells you?"
        />
        <ScaleField
          label="Balance (0 = fully doing mind, 5 = fully being mind)"
          value={data.balance ?? 0}
          onChange={(v) => update("balance", v)}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} subtitle="Goal-focused, striving, outcome-oriented. Necessary but can become a treadmill.">
          Doing Mind
        </SectionHeading>
        <TextAreaField
          label="What goal-driven activities are you engaged in?"
          value={data.doingDescription}
          onChange={(v) => update("doingDescription", v)}
          placeholder="Work, tasks, to-do lists, planning..."
        />
        <TextAreaField
          label="What is the cost of being stuck in doing mind?"
          value={data.doingCost}
          onChange={(v) => update("doingCost", v)}
          hint="Exhaustion, dissatisfaction, inability to rest, feeling like nothing is ever enough."
          placeholder="e.g., 'I haven't sat down without guilt in weeks..."
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} subtitle="Resting in the present moment without needing to change anything. Not laziness — a different relationship to the present.">
          Being Mind
        </SectionHeading>
        <TextAreaField
          label="How can you rest in the present moment?"
          value={data.beingDescription}
          onChange={(v) => update("beingDescription", v)}
          placeholder="A walk without headphones, sitting on the porch, watching the sky..."
        />
        <TextAreaField
          label="What would you gain from more being mind?"
          value={data.beingBenefit}
          onChange={(v) => update("beingBenefit", v)}
          placeholder="Presence, peace, reduced reactivity, connection..."
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} subtitle="Not a complete reversal — just a small nudge toward balance.">
          Plan your shift
        </SectionHeading>
        <TextAreaField
          label="What small shift can you make right now?"
          value={data.shift}
          onChange={(v) => update("shift", v)}
          placeholder="e.g., 'Put the phone down for 10 minutes and just sit' or 'Do one task with full attention instead of rushing through three'"
        />
        <TextAreaField
          label="Reflection"
          value={data.reflection}
          onChange={(v) => update("reflection", v)}
          placeholder="What did you notice after making the shift?"
        />
      </section>
    </div>
  );
}
