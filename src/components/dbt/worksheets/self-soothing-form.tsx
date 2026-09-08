"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function SelfSoothingForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="Self-Soothing comforts you through the five senses. Build a kit so it's ready in crisis." />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField label="What's happening?" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="What's distressing you right now?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Soothe through each sense" subtitle="Pick one or more senses. Savor — don't rush. Be present with the sensation." />
        <TextAreaField label="Vision — look at something beautiful" value={data.vision ?? ""} onChange={(v) => update("vision", v)} hint="Art, nature, photos of loved ones, a candle." placeholder="What will you look at?" rows={2} />
        <TextAreaField label="Hearing — listen to something calming" value={data.hearing ?? ""} onChange={(v) => update("hearing", v)} hint="Music, nature sounds, a loved one's voice." placeholder="What will you listen to?" rows={2} />
        <TextAreaField label="Smell — a favorite scent" value={data.smell ?? ""} onChange={(v) => update("smell", v)} hint="Flowers, coffee, essential oils, baking." placeholder="What will you smell?" rows={2} />
        <TextAreaField label="Taste — savor something slowly" value={data.taste ?? ""} onChange={(v) => update("taste", v)} hint="Tea, chocolate, a favorite meal. Mindful eating." placeholder="What will you taste? Savor it slowly." rows={2} />
        <TextAreaField label="Touch — something comforting" value={data.touch ?? ""} onChange={(v) => update("touch", v)} hint="Soft fabric, warm bath, pet an animal, weighted blanket, a hug." placeholder="What will you touch?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Reflection" />
        <TextAreaField label="What happened?" value={data.whatHappened ?? ""} onChange={(v) => update("whatHappened", v)} placeholder="Which senses did you use? How did your body and mind respond?" rows={3} />
        <TextAreaField label="Self-soothing kit plan" value={data.kitPlan ?? ""} onChange={(v) => update("kitPlan", v)} placeholder="What items can you gather now to have ready for next time? Build a kit for each sense." rows={3} />
      </section>
    </div>
  );
}
