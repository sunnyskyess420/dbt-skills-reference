"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function CheckTheFactsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The emotion" subtitle="Name the emotion and rate its intensity." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextField label="Emotion" value={data.emotion ?? ""} onChange={(v) => update("emotion", v)} placeholder="e.g., Anger, fear, shame, sadness" />
        <ScaleField label="Intensity (0-5)" value={data.intensity ?? 0} onChange={(v) => update("intensity", v)} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="What happened" subtitle="State the prompting event factually — just the facts." />
        <TextAreaField label="Prompting event" value={data.promptingEvent ?? ""} onChange={(v) => update("promptingEvent", v)} placeholder="What actually happened? Stick to observable facts." rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Your interpretation" subtitle="What do you believe the event means?" />
        <TextAreaField label="My interpretation" value={data.interpretation ?? ""} onChange={(v) => update("interpretation", v)} placeholder="What does this event mean to you? What are you telling yourself about it?" rows={3} />
        <TextAreaField label="Alternative interpretations" value={data.alternativeInterpretations ?? ""} onChange={(v) => update("alternativeInterpretations", v)} placeholder="What are other plausible ways to interpret this event?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Threat assessment" subtitle="Are you assuming a threat? Is it real?" />
        <TextAreaField label="Threat I'm assuming" value={data.threatAssumed ?? ""} onChange={(v) => update("threatAssumed", v)} placeholder="What bad outcome are you afraid of?" rows={2} />
        <TextAreaField label="Is the threat real?" value={data.threatReal ?? ""} onChange={(v) => update("threatReal", v)} placeholder="Is the threat actually real? What's the evidence?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={5} title="Does the emotion fit?" subtitle="Based on the facts, does the emotion fit? Does the intensity fit?" />
        <TextAreaField label="Does the emotion fit the facts?" value={data.intensityFits ?? ""} onChange={(v) => update("intensityFits", v)} placeholder="Given the actual facts, does this emotion make sense? Does the intensity match the situation?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={6} title="What to do" subtitle="If the emotion doesn't fit, use opposite action or check the facts. If it does fit, use problem solving." />
        <TextAreaField label="If it doesn't fit — skill to use" value={data.skillToUse ?? ""} onChange={(v) => update("skillToUse", v)} placeholder="e.g., Opposite action, reinterpreting the event" rows={2} />
        <TextAreaField label="If it does fit — problem solving" value={data.problemSolving ?? ""} onChange={(v) => update("problemSolving", v)} placeholder="What can you do to change the situation?" rows={2} />
        <TextAreaField label="Notes" value={data.notes ?? ""} onChange={(v) => update("notes", v)} placeholder="Anything else?" rows={2} />
      </section>
    </div>
  );
}
