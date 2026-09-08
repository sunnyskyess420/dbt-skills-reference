"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function EndingRelationshipsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The decision"
          subtitle="Be clear about why this relationship needs to end. If safety is at risk, skip skillful communication and get support."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="Describe the relationship"
          value={data.relationship ?? ""}
          onChange={(v) => update("relationship", v)}
          placeholder="Who is this person? How long have you known them? What was it like?"
          rows={3}
        />
        <TextAreaField
          label="Why does it need to end?"
          value={data.whyEnd ?? ""}
          onChange={(v) => update("whyEnd", v)}
          placeholder="Be honest. Destructive patterns, abuse, incompatibility, one-sided effort..."
          rows={3}
        />
        <TextAreaField
          label="What have I learned from this relationship?"
          value={data.learned ?? ""}
          onChange={(v) => update("learned", v)}
          placeholder="What will I take with me? What do I understand now that I didn't before?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="The plan"
          subtitle="Aim for clarity without cruelty. Sometimes the skill is to let it fade rather than have a dramatic ending."
        />
        <TextAreaField
          label="How will I communicate the ending?"
          value={data.howToEnd ?? ""}
          onChange={(v) => update("howToEnd", v)}
          hint="In person? In writing? Not at all (if unsafe)? What will you say?"
          placeholder="e.g., 'I need to be honest with you about where I stand...'"
          rows={3}
        />
        <TextAreaField
          label="How will I maintain my self-respect?"
          value={data.selfRespect ?? ""}
          onChange={(v) => update("selfRespect", v)}
          placeholder="What FAST skills will you use? How will you handle their reaction?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Afterward" />
        <TextAreaField
          label="What happened?"
          value={data.whatHappened ?? ""}
          onChange={(v) => update("whatHappened", v)}
          placeholder="How did it go? What was their response? How do you feel now?"
          rows={3}
        />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="Did you maintain self-respect? What would you do differently?"
          rows={3}
        />
      </section>
    </div>
  );
}
