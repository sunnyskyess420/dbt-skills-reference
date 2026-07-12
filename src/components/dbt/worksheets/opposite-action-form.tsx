"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function OppositeActionForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The emotion and its urge" subtitle="Identify the emotion, its intensity, and what it's urging you to do." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextField label="Emotion" value={data.emotion ?? ""} onChange={(v) => update("emotion", v)} placeholder="e.g., Fear, anger, shame, sadness" />
        <ScaleField label="Intensity (0-5)" value={data.intensity ?? 0} onChange={(v) => update("intensity", v)} />
        <TextAreaField label="Action urge" value={data.actionUrge ?? ""} onChange={(v) => update("actionUrge", v)} placeholder="What does the emotion urge you to do? (e.g., fear: run away; anger: attack; shame: hide)" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Does it fit the facts?" subtitle="Use Check the Facts. Does the emotion fit? Is the intensity appropriate?" />
        <TextAreaField label="Does the emotion fit the facts?" value={data.fitsFacts ?? ""} onChange={(v) => update("fitsFacts", v)} placeholder="Based on checking the facts, does this emotion fit the situation?" rows={2} />
        <TextAreaField label="Is the intensity appropriate?" value={data.intensityAppropriate ?? ""} onChange={(v) => update("intensityAppropriate", v)} placeholder="Even if it fits, is the intensity too high for the situation?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="The opposite action" subtitle="If the emotion doesn't fit (or the intensity is too high), do the opposite of the urge." />
        <TextAreaField label="What is the opposite action?" value={data.oppositeAction ?? ""} onChange={(v) => update("oppositeAction", v)} placeholder="e.g., fear: approach; anger: gentle de-escalation; shame: tell someone; sadness: be active" rows={2} />
        <TextAreaField label="All the way — body language" value={data.bodyLanguage ?? ""} onChange={(v) => update("bodyLanguage", v)} placeholder="Posture, facial expression, tone — all aligned with the opposite action" rows={2} />
        <TextAreaField label="How will you do it all the way?" value={data.allTheWay ?? ""} onChange={(v) => update("allTheWay", v)} placeholder="Opposite action must be all-the-way, not halfway. What does that look like for you?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Plan to repeat" subtitle="Opposite action usually needs to be repeated. Plan for it." />
        <TextAreaField label="How many times / how often?" value={data.timesToRepeat ?? ""} onChange={(v) => update("timesToRepeat", v)} placeholder="Once may not be enough. When and how will you repeat?" rows={2} />
        <TextAreaField label="Obstacles" value={data.obstacles ?? ""} onChange={(v) => update("obstacles", v)} placeholder="What might get in the way of doing the opposite action?" rows={2} />
        <TextAreaField label="My plan" value={data.plan ?? ""} onChange={(v) => update("plan", v)} placeholder="Concrete plan for when and how you'll do the opposite action" rows={2} />
      </section>
    </div>
  );
}
