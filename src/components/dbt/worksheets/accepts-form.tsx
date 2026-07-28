"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function AcceptsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="ACCEPTS is a menu of distraction strategies for crisis situations. Have your list ready before a crisis." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="What urge are you distracting from?" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="What do you want to do that you shouldn't?" rows={2} />
        <ScaleField label="Urgency (0-10)" value={data.urgency ?? 0} onChange={(v) => update("urgency", v)} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Plan your ACCEPTS strategies" subtitle="Pick one or more. The point is to bridge the gap between the urge and when skills can work." />
        <TextAreaField label="A — Activities" value={data.activities ?? ""} onChange={(v) => update("activities", v)} hint="Do something engaging — work, hobby, exercise, game, errand." placeholder="What activity will you do?" rows={2} />
        <TextAreaField label="C — Contributing" value={data.contributing ?? ""} onChange={(v) => update("contributing", v)} hint="Do something for someone else — volunteer, help a friend, send a kind message." placeholder="How will you contribute to someone else?" rows={2} />
        <TextAreaField label="C — Comparisons" value={data.comparisons ?? ""} onChange={(v) => update("comparisons", v)} hint="Compare to a worse time you survived. Use with care." placeholder="e.g., 'I survived worse in 2022...'" rows={2} />
        <TextAreaField label="E — Emotions (create a different one)" value={data.emotions ?? ""} onChange={(v) => update("emotions", v)} hint="Funny video, sad movie, uplifting music — create a competing emotion." placeholder="What will generate a different emotion?" rows={2} />
        <TextAreaField label="P — Pushing away" value={data.pushingAway ?? ""} onChange={(v) => update("pushingAway", v)} hint="Mentally put the situation in a box. Not denial — temporary." placeholder="How will you set this aside for now?" rows={2} />
        <TextAreaField label="T — Thoughts" value={data.thoughts ?? ""} onChange={(v) => update("thoughts", v)} hint="Count, recite, do puzzles, repeat a meaningful phrase." placeholder="What thought-filling activity will you do?" rows={2} />
        <TextAreaField label="S — Sensations" value={data.sensations ?? ""} onChange={(v) => update("sensations", v)} hint="Intense sensations — sour candy, hot shower, loud music, ice." placeholder="What sensation will redirect your attention?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Reflection" />
        <TextAreaField label="What happened?" value={data.whatHappened ?? ""} onChange={(v) => update("whatHappened", v)} placeholder="Which strategies did you use? Did the urge pass?" rows={3} />
      </section>
    </div>
  );
}
