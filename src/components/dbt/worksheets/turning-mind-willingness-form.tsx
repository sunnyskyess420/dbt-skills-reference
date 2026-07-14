"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function TurningMindWillingnessForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="What I'm accepting" subtitle="Name the reality you are committing to accept." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="What I am accepting" value={data.whatIAmAccepting ?? ""} onChange={(v) => update("whatIAmAccepting", v)} placeholder="State the reality you are choosing to accept, exactly as it is." rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Turning the mind" subtitle="Acceptance is a commitment you make over and over. Notice when you slip back." />
        <TextAreaField label="When I slipped back" value={data.whenSlippedBack ?? ""} onChange={(v) => update("whenSlippedBack", v)} placeholder="When did you slip back into non-acceptance? (e.g., 'This shouldn't be', refusing to act)" rows={2} />
        <TextAreaField label="Turning back" value={data.turningBack ?? ""} onChange={(v) => update("turningBack", v)} placeholder="How did you turn the mind back to acceptance? What did you say or do?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Willingness vs willfulness" subtitle="Willingness is doing just what is needed. Willfulness is refusing to act or trying to fix reality." />
        <TextAreaField label="My willfulness" value={data.willfulness ?? ""} onChange={(v) => update("willfulness", v)} placeholder="Where were you willful? (e.g., sitting on hands, refusing, saying 'I won't')" rows={2} />
        <TextAreaField label="My willingness" value={data.willingness ?? ""} onChange={(v) => update("willingness", v)} placeholder="Where were you willing? How did you do just what the situation required?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="What happened" subtitle="What changed when you practiced willingness?" />
        <TextAreaField label="What I did" value={data.whatIDid ?? ""} onChange={(v) => update("whatIDid", v)} placeholder="What effective action did you take from willingness?" rows={3} />
        <TextAreaField label="Notes" value={data.notes ?? ""} onChange={(v) => update("notes", v)} placeholder="Anything else?" rows={2} />
      </section>
    </div>
  );
}
