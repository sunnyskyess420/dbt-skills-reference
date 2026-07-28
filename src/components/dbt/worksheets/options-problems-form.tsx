"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function OptionsProblemsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Name the problem"
          subtitle="When you feel stuck, clarify which option you're actually choosing."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="What is the problem?"
          value={data.problem ?? ""}
          onChange={(v) => update("problem", v)}
          placeholder="What situation are you facing? Be specific."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="The four options"
          subtitle="DBT skills map onto options 1, 2, and 3. Option 4 is the default if you do nothing different."
        />
        <TextAreaField
          label="Option 1: Solve the problem"
          value={data.optionSolve ?? ""}
          hint="Change the situation or your reaction. Use Problem Solving, behavior change strategies."
          placeholder="How could you change the situation itself?"
          rows={3}
        />
        <TextAreaField
          label="Option 2: Feel better about the problem"
          value={data.optionFeelBetter ?? ""}
          hint="Change how you feel without changing the situation. Use Opposite Action, Check the Facts, Accumulate Positives, Cope Ahead."
          placeholder="How could you change your emotional response?"
          rows={3}
        />
        <TextAreaField
          label="Option 3: Radically accept the problem"
          value={data.optionAccept ?? ""}
          hint="Accept the situation as it is, with no goal of changing it. Use Radical Acceptance, Turning the Mind."
          placeholder="What would full acceptance look like here?"
          rows={3}
        />
        <TextAreaField
          label="Option 4: Stay miserable (do nothing different)"
          value={data.optionStayMiserable ?? ""}
          hint="This is what happens by default. Is that really what you want?"
          placeholder="If you keep doing what you're doing now, what happens?"
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="My choice" />
        <TextAreaField
          label="Which option am I choosing?"
          value={data.myChoice ?? ""}
          placeholder="Which option (or combination) will you commit to? Which skills will you use?"
          rows={3}
        />
      </section>
    </div>
  );
}
