"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function ImproveForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="IMPROVE reshapes how you relate to a difficult moment you can't leave or change." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="What's happening?" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="What moment are you trying to improve?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Plan your IMPROVE strategies" subtitle="Pick one or more. These work when distraction and self-soothing aren't enough." />
        <TextAreaField label="I — Imagery" value={data.imagery ?? ""} onChange={(v) => update("imagery", v)} hint="Imagine a safe place, a successful outcome, or a comforting scene." placeholder="What scene will you imagine?" rows={2} />
        <TextAreaField label="M — Meaning" value={data.meaning ?? ""} onChange={(v) => update("meaning", v)} hint="Find or create meaning. What does this teach? How does it connect to your values?" placeholder="What meaning can you find in this?" rows={2} />
        <TextAreaField label="P — Prayer" value={data.prayer ?? ""} onChange={(v) => update("prayer", v)} hint="Open to something greater — not necessarily religious." placeholder="What will you connect to? A higher power, nature, humanity, your values..." rows={2} />
        <TextAreaField label="R — Relaxation" value={data.relaxation ?? ""} onChange={(v) => update("relaxation", v)} hint="Stretch, breathe, yawn, smile — release physical tension." placeholder="How will you relax your body?" rows={2} />
        <TextAreaField label="O — One thing at a time" value={data.oneThing ?? ""} onChange={(v) => update("oneThing", v)} hint="Don't project the whole future. Just this one moment." placeholder="What is the one thing in front of you right now?" rows={2} />
        <TextAreaField label="V — Vacation" value={data.vacation ?? ""} onChange={(v) => update("vacation", v)} hint="A brief 'vacation' from responsibility — a few minutes off. Not avoidance — time-limited." placeholder="How will you take a brief break? Set a time limit." rows={2} />
        <TextAreaField label="E — Encouragement" value={data.encouragement ?? ""} onChange={(v) => update("encouragement", v)} hint="Talk to yourself the way you'd talk to a friend." placeholder="What would you say to a friend in this situation? Say that to yourself." rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Reflection" />
        <TextAreaField label="Reflection" value={data.reflection ?? ""} onChange={(v) => update("reflection", v)} placeholder="Which strategies helped? What worked that surprised you?" rows={3} />
      </section>
    </div>
  );
}
