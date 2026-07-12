"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function ValuesToActionsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="List your values" subtitle="What matters most to you? Brainstorm freely." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="My values" value={data.valuesList ?? ""} onChange={(v) => update("valuesList", v)} placeholder="e.g., family, honesty, creativity, helping others, independence, health, learning..." rows={4} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Pick one value" subtitle="Choose one value to focus on for this worksheet." />
        <TextField label="Chosen value" value={data.chosenValue ?? ""} onChange={(v) => update("chosenValue", v)} placeholder="e.g., Creativity" />
        <TextAreaField label="Why is this important to me?" value={data.whyImportant ?? ""} onChange={(v) => update("whyImportant", v)} placeholder="What does this value mean to you? Why does it matter?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Set a goal" subtitle="Turn the value into a specific, concrete goal." />
        <TextAreaField label="My goal" value={data.goal ?? ""} onChange={(v) => update("goal", v)} placeholder="e.g., Spend 2 hours each week on a creative project" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Action steps" subtitle="Break the goal into small, concrete actions." />
        <TextAreaField label="Action step 1" value={data.actionStep1 ?? ""} onChange={(v) => update("actionStep1", v)} placeholder="Small, specific, doable" rows={2} />
        <TextAreaField label="Action step 2" value={data.actionStep2 ?? ""} onChange={(v) => update("actionStep2", v)} placeholder="Small, specific, doable" rows={2} />
        <TextAreaField label="Action step 3" value={data.actionStep3 ?? ""} onChange={(v) => update("actionStep3", v)} placeholder="Small, specific, doable" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={5} title="When" subtitle="Commit to when you'll take the first action." />
        <TextAreaField label="When will I start?" value={data.when ?? ""} onChange={(v) => update("when", v)} placeholder="Specific day and time" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={6} title="Track progress" subtitle="Use this space to track how it goes." />
        <TextAreaField label="Progress notes" value={data.progressNotes ?? ""} onChange={(v) => update("progressNotes", v)} placeholder="Come back and update this as you take action. What worked? What got in the way?" rows={4} />
      </section>
    </div>
  );
}
