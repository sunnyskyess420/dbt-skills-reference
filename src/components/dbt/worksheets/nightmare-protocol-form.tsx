"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function NightmareProtocolForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The nightmare" subtitle="Write down the nightmare in detail while it's fresh." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="Nightmare description" value={data.nightmareDescription ?? ""} onChange={(v) => update("nightmareDescription", v)} placeholder="Describe the nightmare in as much detail as you can remember." rows={4} />
        <TextAreaField label="Original ending" value={data.originalEnding ?? ""} onChange={(v) => update("originalEnding", v)} placeholder="How did the nightmare end?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="The new ending" subtitle="Rewrite the ending to be safe, empowering, or resolved." />
        <TextAreaField label="New ending" value={data.newEnding ?? ""} onChange={(v) => update("newEnding", v)} placeholder="Write a new ending where you are safe, in control, or the threat is neutralized. Make it vivid." rows={4} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Rehearsal plan" subtitle="Rehearse the new ending during the day so your mind learns it." />
        <TextAreaField label="Rehearsal plan" value={data.rehearsalPlan ?? ""} onChange={(v) => update("rehearsalPlan", v)} placeholder="When and how will you rehearse the new ending? (e.g., visualize for 10 min each morning, write it out 3 times)" rows={3} />
        <TextAreaField label="Sleep hygiene plan" value={data.sleepHygienePlan ?? ""} onChange={(v) => update("sleepHygienePlan", v)} placeholder="What will you do before bed to calm your nervous system? (e.g., no screens, relaxation breathing, soothing imagery)" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Progress" subtitle="Track how the nightmare and sleep change over time." />
        <TextAreaField label="Progress" value={data.progress ?? ""} onChange={(v) => update("progress", v)} placeholder="Did the nightmare return? Did the ending shift? How is your sleep?" rows={3} />
      </section>
    </div>
  );
}
