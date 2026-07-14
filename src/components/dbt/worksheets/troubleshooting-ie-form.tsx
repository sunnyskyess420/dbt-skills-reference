"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function TroubleshootingIeForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="What was the situation where you tried to use interpersonal effectiveness skills?" />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="Situation" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="What happened? Who was involved? What did you want?" rows={3} />
        <TextField label="Skill used" value={data.skillUsed ?? ""} onChange={(v) => update("skillUsed", v)} placeholder="Which skill did you try? (e.g., DEAR MAN, GIVE, FAST)" />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="What happened" subtitle="Describe what actually occurred." />
        <TextAreaField label="What happened" value={data.whatHappened ?? ""} onChange={(v) => update("whatHappened", v)} placeholder="What did you do and say? How did the other person respond?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="What went wrong" subtitle="Be honest — where did it break down?" />
        <TextAreaField label="What went wrong" value={data.whatWentWrong ?? ""} onChange={(v) => update("whatWentWrong", v)} placeholder="What didn't work? Where did you drift from the skill?" rows={3} />
        <TextAreaField label="Factors interfering" value={data.factorsInterfering ?? ""} onChange={(v) => update("factorsInterfering", v)} placeholder="What got in the way? (e.g., emotion mind, worry thoughts, no skill, environment, the other person)" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Next time" subtitle="What will you do differently?" />
        <TextAreaField label="What to do differently" value={data.whatToDoDifferently ?? ""} onChange={(v) => update("whatToDoDifferently", v)} placeholder="What will you try next time? Which skill, which prep, which repair?" rows={3} />
        <TextAreaField label="Notes" value={data.notes ?? ""} onChange={(v) => update("notes", v)} placeholder="Anything else?" rows={2} />
      </section>
    </div>
  );
}
