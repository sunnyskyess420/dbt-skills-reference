"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function MindfulnessEmotionsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The emotion" subtitle="Name the emotion and where it lives in your body." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextField label="Emotion" value={data.emotion ?? ""} onChange={(v) => update("emotion", v)} placeholder="What emotion are you observing? (e.g., sadness, anger, fear)" />
        <TextAreaField label="Where in your body" value={data.whereInBody ?? ""} onChange={(v) => update("whereInBody", v)} placeholder="Where do you feel this emotion physically? (e.g., tightness in chest, lump in throat)" rows={2} />
        <ScaleField label="Intensity (0-5)" value={data.intensity ?? 0} onChange={(v) => update("intensity", v)} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="The wave" subtitle="Emotions come in waves — they rise, peak, and fall." />
        <TextAreaField label="Wave description" value={data.waveDescription ?? ""} onChange={(v) => update("waveDescription", v)} placeholder="Describe the wave. How did the emotion rise, peak, and fall? How long did it last?" rows={3} />
        <TextAreaField label="What I did" value={data.whatIDid ?? ""} onChange={(v) => update("whatIDid", v)} placeholder="What did you do while the wave was happening? Did you ride it, fight it, distract?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Reflection" subtitle="What changed after observing the wave?" />
        <TextAreaField label="What changed" value={data.whatChanged ?? ""} onChange={(v) => update("whatChanged", v)} placeholder="Did the emotion shift after observing it? What did you notice?" rows={3} />
        <TextAreaField label="Notes" value={data.notes ?? ""} onChange={(v) => update("notes", v)} placeholder="Anything else?" rows={2} />
      </section>
    </div>
  );
}
