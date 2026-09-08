"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function ProblemSolvingForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Define the problem"
          subtitle="Use this after Check the Facts shows the emotion fits — there really is a problem to solve."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="Define the problem precisely and factually"
          value={data.problem ?? ""}
          onChange={(v) => update("problem", v)}
          placeholder="What exactly is the problem? Be specific and factual."
          rows={3}
        />
        <TextAreaField
          label="What emotion is this causing?"
          value={data.emotion ?? ""}
          onChange={(v) => update("emotion", v)}
          placeholder="e.g., I feel anxious because..."
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Solve it"
          subtitle="Don't skip brainstorming — most people jump to the first solution."
        />
        <TextAreaField
          label="Brainstorm ALL possible solutions"
          value={data.brainstorm ?? ""}
          onChange={(v) => update("brainstorm", v)}
          hint="Quantity over quality. List everything, even bad ideas. Don't evaluate yet."
          placeholder="1. \n2. \n3. \n4. \n5."
          rows={5}
        />
        <TextAreaField
          label="Evaluate pros and cons of your top options"
          value={data.evaluate ?? ""}
          onChange={(v) => update("evaluate", v)}
          placeholder="For each option: what's good about it? What could go wrong?"
          rows={4}
        />
        <TextAreaField
          label="Which solution will you try?"
          value={data.chosen ?? ""}
          onChange={(v) => update("chosen", v)}
          placeholder="Pick one and commit to it."
        />
        <TextAreaField
          label="Plan the steps"
          value={data.steps ?? ""}
          onChange={(v) => update("steps", v)}
          placeholder="What exactly will you do? When? What do you need?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Afterward" />
        <TextAreaField
          label="What happened?"
          value={data.whatHappened ?? ""}
          onChange={(v) => update("whatHappened", v)}
          placeholder="Did you follow through? What was the result?"
          rows={3}
        />
        <TextAreaField
          label="Evaluate"
          value={data.evaluateResult ?? ""}
          onChange={(v) => update("evaluateResult", v)}
          placeholder="Did it work? What would you do differently? If you can't solve the problem, radical acceptance may be the next skill."
          rows={3}
        />
      </section>
    </div>
  );
}
