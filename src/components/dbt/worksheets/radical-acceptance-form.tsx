"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function RadicalAcceptanceForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="What I am accepting" subtitle="Name the reality you cannot change that you need to accept." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="What I am accepting" value={data.whatIAmAccepting ?? ""} onChange={(v) => update("whatIAmAccepting", v)} placeholder="State the reality exactly as it is. Be specific." rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="What makes it hard" subtitle="Notice the willfulness and resistance." />
        <TextAreaField label="Why is this hard to accept?" value={data.whyHard ?? ""} onChange={(v) => update("whyHard", v)} placeholder="What about this feels unfair, wrong, or impossible to accept?" rows={3} />
        <TextAreaField label="My willfulness" value={data.willfulness ?? ""} onChange={(v) => update("willfulness", v)} placeholder="How am I being willful? (e.g., 'This shouldn't be', 'It's not fair', refusing to act)" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Practice" subtitle="Radical acceptance is a practice, not a one-time decision. Use these body-based practices." />
        <TextAreaField label="Half-smile practice" value={data.halfSmile ?? ""} onChange={(v) => update("halfSmile", v)} placeholder="How did you practice half-smile? When?" rows={2} />
        <TextAreaField label="Willing hands" value={data.willingHands ?? ""} onChange={(v) => update("willingHands", v)} placeholder="How did you practice willing hands (open palms)?" rows={2} />
        <TextAreaField label="Turning the mind" value={data.turningMind ?? ""} onChange={(v) => update("turningMind", v)} placeholder="When did you slip back into non-acceptance and turn the mind back to acceptance?" rows={2} />
        <TextAreaField label="Body practice" value={data.bodyPractice ?? ""} onChange={(v) => update("bodyPractice", v)} placeholder="Any other body-based practice (breathing, posture) that helped?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Reflection" subtitle="What changed after practicing acceptance?" />
        <TextAreaField label="What changed?" value={data.whatChanged ?? ""} onChange={(v) => update("whatChanged", v)} placeholder="Did the suffering decrease? Did you feel more able to act effectively?" rows={3} />
        <TextAreaField label="Notes" value={data.notes ?? ""} onChange={(v) => update("notes", v)} placeholder="Anything else?" rows={2} />
      </section>
    </div>
  );
}
