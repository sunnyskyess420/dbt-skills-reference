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

export function PositivesShortForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Plan your week"
          subtitle="Intentionally do pleasant activities — even small ones. Don't wait until you 'feel like it'. Motivation follows action."
        />
        <TextField
          label="Week starting"
          value={data.weekStartDate ?? ""}
          onChange={(v) => update("weekStartDate", v)}
          placeholder="e.g., Jan 6"
        />
        <TextAreaField
          label="Build your pleasant activities list"
          value={data.activitiesList ?? ""}
          onChange={(v) => update("activitiesList", v)}
          hint="Small is fine: a cup of tea, a walk, a song. Avoid numbing activities (scrolling, drinking)."
          placeholder={"1.\n2.\n3.\n4.\n5."}
          rows={5}
        />
        {DAYS.map((day, i) => (
          <TextAreaField
            key={day}
            label={day}
            value={(data[DAY_KEYS[i]] as string) ?? ""}
            onChange={(v) => update(DAY_KEYS[i], v)}
            placeholder="Activity:  |  Emotion before (0-5):  |  Emotion after (0-5):"
            rows={2}
          />
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Reflection" />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="Did accumulating small positive moments change your mood over the week? What worked?"
          rows={3}
        />
      </section>
    </div>
  );
}
