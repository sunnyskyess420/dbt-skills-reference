"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function MindfulnessOthersForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Before the interaction"
          subtitle="Notice before you ask: is the other person in a state where they can hear me?"
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="Who will you be mindful of?"
          value={data.person ?? ""}
          onChange={(v) => update("person", v)}
          placeholder="Who is the other person? What is your relationship?"
          rows={2}
        />
        <TextAreaField
          label="What do you notice about them right now?"
          value={data.observations ?? ""}
          onChange={(v) => update("observations", v)}
          hint="Mood, body language, energy level, facial expression, tone. Attunement is not agreement — you can notice without agreeing."
          placeholder="What do you see and hear? What might they be feeling or needing?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="During the interaction"
          subtitle="Stay present with them. Notice your own reactions too — this is not self-abandonment."
        />
        <TextAreaField
          label="What happened in the interaction?"
          value={data.whatHappened ?? ""}
          onChange={(v) => update("whatHappened", v)}
          placeholder="What did they say? What did you notice shift in them? What shifted in you?"
          rows={3}
        />
        <TextAreaField
          label="What were they communicating beyond their words?"
          value={data.beyondWords ?? ""}
          onChange={(v) => update("beyondWords", v)}
          placeholder="Body language, tone, what they didn't say, what they kept returning to..."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Reflection" />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="Were you attuned? What did you miss? How would being more mindful of them change the interaction?"
          rows={3}
        />
      </section>
    </div>
  );
}
