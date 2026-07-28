"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function WhatSkillsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} subtitle="Choose one What skill to practice: Observe, Describe, or Participate.">
          The experience
        </SectionHeading>
        <DateField label="Date" value={data.entryDate} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="Describe the present-moment experience"
          value={data.situation}
          onChange={(v) => update("situation", v)}
          placeholder="What are you experiencing right now? A sensation, a thought, a feeling, an activity..."
        />
        <TextField
          label="Which skill will you practice?"
          value={data.skill}
          onChange={(v) => update("skill", v)}
          placeholder="Observe / Describe / Participate"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} subtitle="Only do ONE at a time — they cannot be combined.">
          Practice
        </SectionHeading>
        <TextAreaField
          label="Observe"
          value={data.observe}
          onChange={(v) => update("observe", v)}
          hint="Notice without labeling. Just let experience come and go."
          placeholder="What did you notice? Sensations, sounds, thoughts arising and passing..."
        />
        <TextAreaField
          label="Describe"
          value={data.describe}
          onChange={(v) => update("describe", v)}
          hint="Put words on what you observed — factual, nonjudgmental, as a scientist would."
          placeholder="e.g., 'A thought arose that I am worthless' or 'Tightness in chest, shallow breathing'"
        />
        <TextAreaField
          label="Participate"
          value={data.participate}
          onChange={(v) => update("participate", v)}
          hint="Throw yourself fully in — no narration, no watching yourself."
          placeholder="How did you enter the activity fully? What was the experience of being 'in the zone'?"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3}>
          What happened
        </SectionHeading>
        <TextAreaField
          label="What did you notice?"
          value={data.whatHappened}
          onChange={(v) => update("whatHappened", v)}
          placeholder="During and after the practice — what changed?"
        />
        <ScaleField
          label="How present were you?"
          value={data.presence ?? 0}
          onChange={(v) => update("presence", v)}
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
          placeholder="Which skill was hardest? What did you learn? What would you try differently?"
        />
      </section>
    </div>
  );
}
