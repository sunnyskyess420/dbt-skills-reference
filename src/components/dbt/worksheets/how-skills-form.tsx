"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function HowSkillsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} subtitle="Apply the How skills to any What skill (Observe, Describe, or Participate).">
          The situation
        </SectionHeading>
        <DateField label="Date" value={data.entryDate} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="What are you being mindful of?"
          value={data.situation}
          onChange={(v) => update("situation", v)}
          placeholder="Describe the experience or activity..."
        />
        <TextField
          label="Which What skill were you using?"
          value={data.whatSkill}
          onChange={(v) => update("whatSkill", v)}
          placeholder="Observe / Describe / Participate"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} subtitle="Nonjudgmentalness, One-Mindfulness, Effectiveness — the quality you bring.">
          Practice the How skills
        </SectionHeading>
        <TextAreaField
          label="Nonjudgmentalness — state the facts"
          value={data.nonjudgmental}
          onChange={(v) => update("nonjudgmental", v)}
          hint="Replace 'I'm stupid' with 'I made a mistake.' No good/bad labels."
          placeholder="What are the plain facts, without evaluation?"
        />
        <TextAreaField
          label="One-Mindfulness — do one thing at a time"
          value={data.oneMindful}
          onChange={(v) => update("oneMindful", v)}
          hint="When eating, eat. When listening, listen. When you notice you drifted, come back."
          placeholder="Describe doing one thing with full attention..."
        />
        <TextAreaField
          label="Effectiveness — what will actually work?"
          value={data.effective}
          onChange={(v) => update("effective", v)}
          hint="Let go of needing to be right. Keep your eye on the goal."
          placeholder="What's the most effective response in this situation?"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3}>
          What happened
        </SectionHeading>
        <TextAreaField
          label="What happened?"
          value={data.whatHappened}
          onChange={(v) => update("whatHappened", v)}
          placeholder="How did it go? What did you notice?"
        />
        <ScaleField
          label="How effectively did you practice?"
          value={data.effectiveness ?? 0}
          onChange={(v) => update("effectiveness", v)}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4}>
          Reflection
        </SectionHeading>
        <TextAreaField
          label="Reflection"
          value={data.reflection}
          onChange={(v) => update("reflection", v)}
          placeholder="Which How skill was hardest? What would you do differently?"
        />
      </section>
    </div>
  );
}
