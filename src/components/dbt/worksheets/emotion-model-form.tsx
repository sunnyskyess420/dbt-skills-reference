"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function EmotionModelForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The emotion"
          subtitle="Break down an emotion using the DBT model to find where you can intervene."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextField
          label="What emotion?"
          value={data.emotion ?? ""}
          onChange={(v) => update("emotion", v)}
          placeholder="e.g., anger, shame, fear, sadness"
        />
        <ScaleField
          label="Intensity (0-10)"
          value={data.intensity ?? 0}
          onChange={(v) => update("intensity", v)}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="The components"
          subtitle="Naming each component helps you locate where to intervene."
        />
        <TextAreaField
          label="1. Prompting event"
          value={data.promptingEvent ?? ""}
          onChange={(v) => update("promptingEvent", v)}
          hint="What triggered this? Could be internal (a thought, memory) or external."
          placeholder="What happened just before the emotion arose?"
          rows={2}
        />
        <TextAreaField
          label="2. Interpretation"
          value={data.interpretation ?? ""}
          onChange={(v) => update("interpretation", v)}
          hint="How are you interpreting the event? This is where many interventions happen."
          placeholder="What meaning are you making of what happened?"
          rows={2}
        />
        <TextAreaField
          label="3. Biological changes"
          value={data.biologicalChanges ?? ""}
          onChange={(v) => update("biologicalChanges", v)}
          hint="Heart rate, posture, facial expression, muscle tension, temperature."
          placeholder="e.g., heart racing, jaw clenched, stomach tight, hot face..."
          rows={2}
        />
        <TextAreaField
          label="4. Expressions and action urges"
          value={data.expressions ?? ""}
          onChange={(v) => update("expressions", v)}
          hint="What do you want to do? What is your face/body doing?"
          placeholder="e.g., want to yell, fists clenched, crying, urge to run..."
          rows={2}
        />
        <TextAreaField
          label="5. Aftereffects"
          value={data.aftereffects ?? ""}
          onChange={(v) => update("aftereffects", v)}
          hint="Longer-lasting changes — mood, sensitivity, thoughts that linger."
          placeholder="What's still with you? How long might this last?"
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Finding leverage"
          subtitle="Which component can you change?"
        />
        <TextAreaField
          label="Where can you intervene?"
          value={data.leverage ?? ""}
          onChange={(v) => update("leverage", v)}
          hint="Change the interpretation (Check the Facts)? Change the body (TIPP)? Change the action (Opposite Action)?"
          placeholder="Which component seems most changeable? What skill would help?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Reflection" />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="Did breaking it down help? What did you notice?"
          rows={3}
        />
      </section>
    </div>
  );
}
