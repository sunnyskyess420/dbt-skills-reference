"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function TippForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="Use TIPP when emotional intensity is extreme (8/10 or higher) and you can't think clearly." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="What was happening?" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="Describe the situation..." rows={2} />
        <ScaleField label="Intensity before TIPP (0-10)" value={data.intensityBefore ?? 0} onChange={(v) => update("intensityBefore", v)} help="0 = calm, 10 = extreme" />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Which TIPP skills did you use?" subtitle="You don't have to do all four — pick what fits the situation." />
        <TextAreaField label="T — Temperature" value={data.temperature ?? ""} onChange={(v) => update("temperature", v)} hint="Cold water on face/eyes/cheeks. Triggers dive reflex, lowers heart rate. Caution with cardiac conditions." placeholder="e.g., Splashed cold water on face for 30 seconds..." rows={2} />
        <TextAreaField label="I — Intense exercise" value={data.intenseExercise ?? ""} onChange={(v) => update("intenseExercise", v)} hint="Brief burst — sprinting, jumping jacks, stairs. Burns off stress hormones." placeholder="e.g., 50 jumping jacks..." rows={2} />
        <TextAreaField label="P — Paced breathing" value={data.pacedBreathing ?? ""} onChange={(v) => update("pacedBreathing", v)} hint="Slow breath to 5-6 per minute. Longer exhale than inhale. Most portable option." placeholder="e.g., 4-7-8 breathing for 2 minutes..." rows={2} />
        <TextAreaField label="P — Paired muscle relaxation" value={data.pairedRelaxation ?? ""} onChange={(v) => update("pairedRelaxation", v)} hint="Tense and release each muscle group. Pair release with exhale." placeholder="e.g., Tensed hands, held 5 seconds, released on exhale..." rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Results" />
        <ScaleField label="Intensity after TIPP (0-10)" value={data.intensityAfter ?? 0} onChange={(v) => update("intensityAfter", v)} />
        <TextAreaField label="What happened?" value={data.whatHappened ?? ""} onChange={(v) => update("whatHappened", v)} placeholder="How did your body and mind change?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Reflection" />
        <TextAreaField label="Reflection" value={data.reflection ?? ""} onChange={(v) => update("reflection", v)} placeholder="Which TIPP skill worked best? Would you try a different one next time?" rows={3} />
      </section>
    </div>
  );
}
