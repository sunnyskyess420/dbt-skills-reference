"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function DialecticsPracticeForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The relationship" subtitle="Which relationship conflict are you working with?" />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextField label="Relationship" value={data.relationship ?? ""} onChange={(v) => update("relationship", v)} placeholder="e.g., With my parent about visiting" />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Two opposing positions" subtitle="Name each side clearly. Don't soften." />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-md border border-l-4 border-l-violet-500 bg-violet-500/5 p-4 space-y-3">
            <div>
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">Position A</Label>
              <Textarea value={data.positionA ?? ""} onChange={(e) => update("positionA", e.target.value)} placeholder="One side of the conflict..." rows={3} className="resize-y mt-1 bg-background" />
            </div>
            <div>
              <Label className="text-[11px] font-medium text-muted-foreground">What's true about Position A?</Label>
              <Textarea value={data.trueInA ?? ""} onChange={(e) => update("trueInA", e.target.value)} placeholder="What's valid in it?" rows={3} className="resize-y mt-1 bg-background" />
            </div>
          </div>
          <div className="rounded-md border border-l-4 border-l-amber-500 bg-amber-500/5 p-4 space-y-3">
            <div>
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">Position B</Label>
              <Textarea value={data.positionB ?? ""} onChange={(e) => update("positionB", e.target.value)} placeholder="The opposite side..." rows={3} className="resize-y mt-1 bg-background" />
            </div>
            <div>
              <Label className="text-[11px] font-medium text-muted-foreground">What's true about Position B?</Label>
              <Textarea value={data.trueInB ?? ""} onChange={(e) => update("trueInB", e.target.value)} placeholder="What's valid in it?" rows={3} className="resize-y mt-1 bg-background" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="The synthesis" subtitle="What's true when you hold BOTH positions at once? Use 'and' instead of 'but'." />
        <div className="rounded-md border border-l-4 border-l-emerald-500 bg-emerald-500/5 p-4">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Synthesis statement</Label>
          <Textarea value={data.synthesis ?? ""} onChange={(e) => update("synthesis", e.target.value)} placeholder="Both positions are true AND..." rows={4} className="resize-y mt-1 bg-background" />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="How I'll act on it" subtitle="What concrete action follows from the synthesis?" />
        <TextAreaField label="Concrete actions" value={data.howIWillAct ?? ""} onChange={(v) => update("howIWillAct", v)} placeholder="What will you DO differently?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={5} title="Practice" subtitle="Notice when you collapse back into one side." />
        <TextAreaField label="When did I slip back?" value={data.whenSlippedBack ?? ""} onChange={(v) => update("whenSlippedBack", v)} placeholder="When did you notice yourself going back to one-sided thinking? How did you turn back?" rows={3} />
      </section>
    </div>
  );
}
