"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function DialecticalAbstinenceForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Thesis: Absolute abstinence"
          subtitle="The only safe goal with addiction is no use, full stop."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="What am I abstaining from?"
          value={data.substance ?? ""}
          onChange={(v) => update("substance", v)}
          placeholder="Be specific about what abstinence means for you."
          rows={2}
        />
        <TextAreaField
          label="My abstinence commitment"
          value={data.commitment ?? ""}
          onChange={(v) => update("commitment", v)}
          placeholder="Why am I choosing abstinence? What is at stake?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Antithesis: Harm reduction plan"
          subtitle="If you do slip, do everything possible to prevent a slip from becoming a relapse."
        />
        <TextAreaField
          label="My slip plan"
          value={data.slipPlan ?? ""}
          onChange={(v) => update("slipPlan", v)}
          hint="Have this written BEFORE the slip — during the slip is too late. A slip is not a failure."
          placeholder="If I slip: 1. 2. 3. What will I do immediately to reduce harm and get back on track?"
          rows={4}
        />
        <TextAreaField
          label="My relapse prevention plan"
          value={data.relapsePreventionPlan ?? ""}
          onChange={(v) => update("relapsePreventionPlan", v)}
          placeholder="What are the warning signs of a slide from a slip into a full relapse? What will I do?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Synthesis: Dialectical abstinence"
          subtitle="Aim for absolute abstinence AND have a detailed harm reduction plan. Both are true."
        />
        <TextAreaField
          label="My support system"
          value={data.support ?? ""}
          onChange={(v) => update("support", v)}
          placeholder="People, meetings, therapy, online communities, crisis lines..."
          rows={3}
        />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="Am I holding both? Am I leaning too far toward complacency? Toward shame?"
          rows={3}
        />
      </section>
    </div>
  );
}
