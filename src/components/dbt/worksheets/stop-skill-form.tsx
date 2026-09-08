"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function StopSkillForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="Use STOP the instant you notice you're about to do something you'll regret." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="What was happening?" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="What triggered the urge? What were you about to do?" rows={3} />
        <TextField label="What were you about to do?" value={data.aboutToDo ?? ""} onChange={(v) => update("aboutToDo", v)} placeholder="The action you were about to take..." />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Walk through STOP" subtitle="S — Stop. T — Take a step back. O — Observe. P — Proceed mindfully." />
        <TextAreaField label="S — Stop (freeze)" value={data.stop ?? ""} onChange={(v) => update("stop", v)} hint="Literally freeze. Don't move, don't act, don't speak." placeholder="What happened when you stopped?" rows={2} />
        <TextAreaField label="T — Take a step back" value={data.takeStepBack ?? ""} onChange={(v) => update("takeStepBack", v)} hint="Physically if possible. Take a breath. Let go of the immediate situation." placeholder="Describe stepping back and taking a breath..." rows={2} />
        <TextAreaField label="O — Observe" value={data.observe ?? ""} onChange={(v) => update("observe", v)} hint="What am I feeling? What is the situation? What do I actually want here?" placeholder="What did you notice — internally and externally?" rows={3} />
        <TextAreaField label="P — Proceed mindfully" value={data.proceed ?? ""} onChange={(v) => update("proceed", v)} hint="Choose an action that serves your goal, not your impulse." placeholder="What skillful action did you choose instead?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Reflection" />
        <TextAreaField label="Reflection" value={data.reflection ?? ""} onChange={(v) => update("reflection", v)} placeholder="Did STOP prevent the behavior? What worked? What would you do differently?" rows={3} />
      </section>
    </div>
  );
}
