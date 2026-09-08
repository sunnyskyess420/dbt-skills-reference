"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function LovingKindnessForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} subtitle="Find a comfortable, quiet position. The goal is repetition, not feeling a particular way.">
          Setup
        </SectionHeading>
        <DateField label="Date" value={data.entryDate} onChange={(v) => update("entryDate", v)} />
        <TextField
          label="Setting"
          value={data.setting}
          onChange={(v) => update("setting", v)}
          placeholder="e.g., bedroom, quiet corner, park bench"
        />
        <TextField
          label="Duration"
          value={data.duration}
          onChange={(v) => update("duration", v)}
          placeholder="e.g., 10 minutes"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} subtitle="Silently repeat the phrases for each person. When the mind wanders, gently return.">
          The practice
        </SectionHeading>
        <TextAreaField
          label="Yourself"
          value={data.self}
          onChange={(v) => update("self", v)}
          hint="Start with yourself. You don't have to feel love — the practice is the repetition."
          placeholder="'May I be happy. May I be healthy. May I be safe. May I live with ease.'"
          rows={2}
        />
        <TextAreaField
          label="A loved one"
          value={data.lovedOne}
          onChange={(v) => update("lovedOne", v)}
          placeholder="'May you be happy. May you be healthy. May you be safe. May you live with ease.'"
          rows={2}
        />
        <TextAreaField
          label="A neutral person"
          value={data.neutralPerson}
          onChange={(v) => update("neutralPerson", v)}
          hint="Someone you neither like nor dislike — a stranger, a cashier."
          placeholder="'May you be happy...'"
          rows={2}
        />
        <TextAreaField
          label="A difficult person"
          value={data.difficultPerson}
          onChange={(v) => update("difficultPerson", v)}
          hint="Start with a less-charged person if this feels impossible."
          placeholder="'May you be happy...'"
          rows={2}
        />
        <TextAreaField
          label="All beings"
          value={data.allBeings}
          onChange={(v) => update("allBeings", v)}
          placeholder="'May all beings be happy. May all beings be healthy...'"
          rows={2}
        />
        <TextAreaField
          label="When the mind wandered"
          value={data.wandering}
          onChange={(v) => update("wandering", v)}
          placeholder="How many times? What did you notice? How did you come back?"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3}>
          Reflection
        </SectionHeading>
        <TextAreaField
          label="Reflection"
          value={data.reflection}
          onChange={(v) => update("reflection", v)}
          placeholder="What did you notice? Was it harder for certain people? What came up for you?"
        />
      </section>
    </div>
  );
}
