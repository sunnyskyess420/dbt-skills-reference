"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function MythsEmotionsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The myth" subtitle="Identify the belief you hold about emotions that may not be true." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="The myth" value={data.myth ?? ""} onChange={(v) => update("myth", v)} placeholder="What's the belief? (e.g., 'Negative emotions are bad and should be avoided', 'If I feel it, I must act on it', 'Emotions just happen for no reason')" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Why it's a myth" subtitle="Examine the belief critically." />
        <TextAreaField label="Why it's a myth" value={data.whyItsAMyth ?? ""} onChange={(v) => update("whyItsAMyth", v)} placeholder="Why is this belief not entirely true? What's the evidence against it?" rows={3} />
        <TextAreaField label="Challenge" value={data.challenge ?? ""} onChange={(v) => update("challenge", v)} placeholder="What's a counterexample? When has this belief been wrong for you or others?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="My replacement belief" subtitle="What's a more accurate, workable belief?" />
        <TextAreaField label="Replacement belief" value={data.replacementBelief ?? ""} onChange={(v) => update("replacementBelief", v)} placeholder="Write a new, more accurate belief. (e.g., 'All emotions pass and have something to tell me', 'Feeling an emotion doesn't mean I have to act on it')" rows={3} />
        <TextAreaField label="Notes" value={data.notes ?? ""} onChange={(v) => update("notes", v)} placeholder="Anything else?" rows={2} />
      </section>
    </div>
  );
}
