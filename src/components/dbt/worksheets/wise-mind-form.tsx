"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function WiseMindForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} subtitle="Describe a decision or conflict where you need to access Wise Mind.">
          The situation
        </SectionHeading>
        <DateField label="Date" value={data.entryDate} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="Describe the situation"
          value={data.situation}
          onChange={(v) => update("situation", v)}
          placeholder="What decision or conflict are you facing? What makes it hard?"
        />
        <TextAreaField
          label="What emotion mind says"
          value={data.emotionMind}
          onChange={(v) => update("emotionMind", v)}
          hint="The loud voice — the urge, the reaction, the feeling."
          placeholder="e.g., 'I should just quit right now' or 'I need to send this angry text'"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} subtitle="Wise Mind integrates reason and emotion. It's the quiet voice, not the first loud thought.">
          Finding Wise Mind
        </SectionHeading>
        <TextAreaField
          label="What reasonable mind says"
          value={data.reasonableMind}
          onChange={(v) => update("reasonableMind", v)}
          placeholder="The logical analysis — facts, consequences, pros and cons."
        />
        <TextAreaField
          label="What does your Wise Mind say?"
          value={data.wiseMindAnswer}
          onChange={(v) => update("wiseMindAnswer", v)}
          hint="The synthesis — not a compromise, but an integration of both feeling and reason."
        />
        <ScaleField
          label="Confidence this is Wise Mind"
          value={data.confidence ?? 0}
          onChange={(v) => update("confidence", v)}
          help="0 = not sure at all, 5 = clearly Wise Mind"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3}>
          Accessing Wise Mind
        </SectionHeading>
        <TextAreaField
          label="Body cue"
          value={data.bodyCue}
          onChange={(v) => update("bodyCue", v)}
          placeholder="Where in your body do you feel Wise Mind? A sense of settling? A deep breath?"
        />
        <TextAreaField
          label="How did you access it?"
          value={data.practice}
          onChange={(v) => update("practice", v)}
          hint="Breathing, dropping attention to center, waiting for the quiet voice..."
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
          placeholder="Did you act from Wise Mind? What happened? What would help you access it faster next time?"
        />
      </section>
    </div>
  );
}
