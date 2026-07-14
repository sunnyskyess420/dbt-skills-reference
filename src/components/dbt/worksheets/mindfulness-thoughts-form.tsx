"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function MindfulnessThoughtsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The thought" subtitle="Name the recurring thought without judging it." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextField label="Recurring thought" value={data.recurringThought ?? ""} onChange={(v) => update("recurringThought", v)} placeholder="What thought keeps coming back?" />
        <TextAreaField label="How it feels" value={data.howItFeels ?? ""} onChange={(v) => update("howItFeels", v)} placeholder="How does having this thought feel in your body and mind?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Observing it" subtitle="Step back and watch the thought, rather than becoming it." />
        <TextAreaField label="Observation" value={data.observation ?? ""} onChange={(v) => update("observation", v)} placeholder="Observe the thought as a mental event. 'I notice I'm having the thought that...'" rows={3} />
        <TextAreaField label="Metaphor" value={data.metaphor ?? ""} onChange={(v) => update("metaphor", v)} placeholder="Use a metaphor to distance from it: thoughts as clouds passing, leaves on a stream, passengers on a bus..." rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="What happened" subtitle="What changed when you observed rather than fused with the thought?" />
        <TextAreaField label="What happened" value={data.whatHappened ?? ""} onChange={(v) => update("whatHappened", v)} placeholder="Did the thought lose its grip? Did you feel more space around it?" rows={3} />
        <TextAreaField label="Notes" value={data.notes ?? ""} onChange={(v) => update("notes", v)} placeholder="Anything else?" rows={2} />
      </section>
    </div>
  );
}
