"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

export function SleepHygieneForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Daily sleep log"
          subtitle="Consistency beats duration — same bedtime/wake time matters most. The bed is for sleep only."
        />
        <TextField
          label="Week starting"
          value={data.weekStartDate ?? ""}
          onChange={(v) => update("weekStartDate", v)}
          placeholder="e.g., Jan 6"
        />
        {DAYS.map((day, i) => (
          <TextAreaField
            key={day}
            label={day}
            value={(data[DAY_KEYS[i]] as string) ?? ""}
            onChange={(v) => update(DAY_KEYS[i], v)}
            placeholder="Bedtime:  |  Wake time:  |  Hours:  |  Quality (0-5):  |  Notes:"
            rows={2}
          />
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Sleep hygiene checklist"
          subtitle="Good sleep is foundational to emotion regulation."
        />
        <TextAreaField
          label="Hygiene practices I'm using"
          value={data.hygienePractices ?? ""}
          hint="Consistent schedule, dark/cool room, no screens before bed, no caffeine late, exercise, bed=sleep only."
          placeholder="Which practices am I following? Which am I not?"
          rows={3}
        />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="How is sleep affecting my emotions? What should I adjust?"
          rows={3}
        />
      </section>
    </div>
  );
}
