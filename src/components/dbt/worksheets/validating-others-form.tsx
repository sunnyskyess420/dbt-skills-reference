"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

const LEVELS = [
  { num: 1, title: "Stay awake", key: "level1", desc: "Be present and attentive to the other person. Actually listen." },
  { num: 2, title: "Accurate reflection", key: "level2", desc: "Reflect back what they're saying to show you heard them." },
  { num: 3, title: "Mind-reading", key: "level3", desc: "Guess what they might be feeling but not saying. 'You seem to be feeling X because...'" },
  { num: 4, title: "Understand based on history", key: "level4", desc: "Validate based on what you know about their past and context." },
  { num: 5, title: "Normalize in context", key: "level5", desc: "Anyone in this situation would feel this way because..." },
  { num: 6, title: "Radical genuineness", key: "level6", desc: "Treat them as an equal, a real person — not a patient, child, or problem." },
];

export function ValidatingOthersForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The person and situation" subtitle="Who are you validating, and what's the situation?" />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextField label="Person" value={data.person ?? ""} onChange={(v) => update("person", v)} placeholder="Who are you validating?" />
        <TextAreaField label="Situation" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="What happened? What are they feeling or going through?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="The 6 levels of validation" subtitle="Work through each level. You don't have to do all 6 — even one helps." />
        {LEVELS.map((level) => (
          <div key={level.num} className="rounded-md border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{level.num}</span>
              <h3 className="text-sm font-semibold">{level.title}</h3>
            </div>
            <p className="text-[11px] text-muted-foreground ml-8">{level.desc}</p>
            <div className="ml-8">
              <TextAreaField label="" value={data[level.key] ?? ""} onChange={(v) => update(level.key, v)} placeholder="Your validation at this level..." rows={2} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="What happened" subtitle="How did the other person respond?" />
        <TextAreaField label="What happened" value={data.whatHappened ?? ""} onChange={(v) => update("whatHappened", v)} placeholder="How did they respond to being validated? Did the conversation shift?" rows={3} />
        <TextAreaField label="Notes" value={data.notes ?? ""} onChange={(v) => update("notes", v)} placeholder="Anything else?" rows={2} />
      </section>
    </div>
  );
}
