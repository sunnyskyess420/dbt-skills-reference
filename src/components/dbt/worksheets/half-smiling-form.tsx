"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function HalfSmilingForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="Half-Smiling and Willing Hands are body-based cues that support radical acceptance." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="What are you accepting?" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="What reality are you resisting that you want to accept?" rows={2} />
        <TextField label="What are you doing alongside this?" value={data.practicingWith ?? ""} onChange={(v) => update("practicingWith", v)} placeholder="e.g., Radical Acceptance, Turning the Mind" />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Body practice" subtitle="The body posture reinforces the mental state. You don't have to feel accepting to do it." />
        <TextAreaField label="Half-Smiling" value={data.halfSmile ?? ""} onChange={(v) => update("halfSmile", v)} hint="Relax face from forehead to jaw. Allow a slight upturn at the corners of the mouth — not a grin. Half-smile with the eyes too." placeholder="Describe your half-smile practice... What do you notice in your face?" rows={3} />
        <TextAreaField label="Willing Hands" value={data.willingHands ?? ""} onChange={(v) => update("willingHands", v)} hint="Open hands, palms up or relaxed on your lap. The opposite of clenched fists." placeholder="Describe your willing hands... What do you notice in your hands and arms?" rows={3} />
        <TextField label="How long did you hold the posture?" value={data.duration ?? ""} onChange={(v) => update("duration", v)} placeholder="e.g., 2 minutes" />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Reflection" />
        <TextAreaField label="What shifted?" value={data.whatShifted ?? ""} onChange={(v) => update("whatShifted", v)} placeholder="Did your internal state change? What did you notice in your body, your thoughts, your tension level?" rows={3} />
        <TextAreaField label="Reflection" value={data.reflection ?? ""} onChange={(v) => update("reflection", v)} placeholder="Will you use this again? In what situations would it be most helpful?" rows={3} />
      </section>
    </div>
  );
}
