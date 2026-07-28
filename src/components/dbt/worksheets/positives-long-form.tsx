"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function PositivesLongForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Identify your values"
          subtitle="Long-term positive emotion comes from living according to your values."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="List your core values"
          value={data.valuesList ?? ""}
          onChange={(v) => update("valuesList", v)}
          hint="What matters most? Relationships, creativity, health, justice, growth, spirituality, community..."
          placeholder={"1.\n2.\n3.\n4.\n5."}
          rows={5}
        />
        <TextField
          label="Which value will you focus on?"
          value={data.chosenValue ?? ""}
          onChange={(v) => update("chosenValue", v)}
          placeholder="Pick one to work toward"
        />
        <TextAreaField
          label="Why is this value important to you?"
          value={data.whyImportant ?? ""}
          onChange={(v) => update("whyImportant", v)}
          placeholder="What does this value add to your life?"
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Set a goal"
          subtitle="Values are directions, not destinations — you can always keep moving toward them."
        />
        <TextAreaField
          label="Your specific, concrete goal"
          value={data.goal ?? ""}
          onChange={(v) => update("goal", v)}
          placeholder="What outcome are you working toward? Make it specific."
          rows={3}
        />
        <TextAreaField
          label="Small action steps"
          value={data.actionSteps ?? ""}
          hint="Small actions consistently beat large actions occasionally."
          placeholder={"Step 1: \nStep 2: \nStep 3: \nStep 4:"}
          rows={4}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Weekly tracking"
          subtitle="Take one small action step daily or weekly."
        />
        <TextField
          label="This week's action"
          value={data.thisWeekAction ?? ""}
          onChange={(v) => update("thisWeekAction", v)}
          placeholder="What specific action will you take this week?"
        />
        <TextAreaField
          label="Progress notes"
          value={data.progressNotes ?? ""}
          onChange={(v) => update("progressNotes", v)}
          placeholder="What did you do? What happened? How did it feel?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Reflection" />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="Is your life moving toward this value? What's getting in the way?"
          rows={3}
        />
      </section>
    </div>
  );
}
