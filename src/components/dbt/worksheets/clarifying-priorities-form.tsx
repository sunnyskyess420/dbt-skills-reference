"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function ClarifyingPrioritiesForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="Describe the situation where you need to act." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="Situation" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="What is the situation? Who is involved? What do you need to decide or do?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Three priorities" subtitle="In any situation there are three priorities: Objective (get what you want), Relationship (keep/improve the relationship), Self-respect (respect yourself)." />
        <TextAreaField label="Objective" value={data.objective ?? ""} onChange={(v) => update("objective", v)} placeholder="What do you want to get or change in this situation?" rows={2} />
        <TextAreaField label="Relationship" value={data.relationship ?? ""} onChange={(v) => update("relationship", v)} placeholder="How do you want the other person to feel about you after this?" rows={2} />
        <TextAreaField label="Self-respect" value={data.selfRespect ?? ""} onChange={(v) => update("selfRespect", v)} placeholder="How do you want to feel about yourself? What are your values here?" rows={2} />
        <TextField label="Priority" value={data.priority ?? ""} onChange={(v) => update("priority", v)} placeholder="Which is most important right now? (Objective / Relationship / Self-respect)" />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="My choice" subtitle="How does this priority shape your plan?" />
        <TextAreaField label="How priority affects plan" value={data.howPriorityAffectsPlan ?? ""} onChange={(v) => update("howPriorityAffectsPlan", v)} placeholder="Given your top priority, what will you do or say? What will you let go of?" rows={3} />
        <TextAreaField label="Notes" value={data.notes ?? ""} onChange={(v) => update("notes", v)} placeholder="Anything else?" rows={2} />
      </section>
    </div>
  );
}
