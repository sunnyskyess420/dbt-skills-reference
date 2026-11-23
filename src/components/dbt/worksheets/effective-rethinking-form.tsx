"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DateField, ScaleField, TextAreaField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Distress Tolerance Worksheet 4b — catch the stress-producing thought, replace
// it with an effective one, and pair the rethinking with relaxation.
export function EffectiveRethinkingForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The event"
          subtitle="One typical prompting event. What led up to it, and what about it is the problem? Describe, don't interpret."
        />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="Prompting event"
          value={data.promptingEvent ?? ""}
          onChange={(v) => update("promptingEvent", v)}
          placeholder="What happened? What led up to it? What specifically is the problem for you?"
          rows={4}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="The stress-producing thoughts"
          subtitle="What are you telling yourself about this event that feeds the stress?"
        />
        <TextAreaField
          label="My interpretations and thoughts"
          value={data.stressThoughts ?? ""}
          onChange={(v) => update("stressThoughts", v)}
          placeholder="The exact sentences running in your head — 'This means…', 'They always…', 'I can't…'"
          rows={4}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Effective rethinking"
          subtitle="Rethink, don't argue. Generate effective thoughts that counteract the stressful ones."
        />
        <TextAreaField
          label="Effective thoughts to replace them"
          value={data.effectiveThoughts ?? ""}
          onChange={(v) => update("effectiveThoughts", v)}
          placeholder="As many as you can — facts, other perspectives, what you can actually control."
          rows={5}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={4}
          title="Did it work?"
          subtitle="Imagined practice counts. Rate honestly."
        />
        <div className="flex items-start gap-2">
          <Checkbox
            id="rethinking-practiced"
            checked={!!data.rethinkingPracticed}
            onCheckedChange={(c) => update("rethinkingPracticed", c === true)}
            className="mt-0.5"
          />
          <Label htmlFor="rethinking-practiced" className="cursor-pointer text-sm font-normal leading-snug">
            I practiced effective rethinking of a stressful situation this week (in imagination or real life)
          </Label>
        </div>
        <ScaleField
          label="Did rethinking reduce fear of it happening again?"
          value={data.fearReduction ?? 0}
          onChange={(v) => update("fearReduction", v)}
          help="0 = not at all, 5 = very much"
        />
        <TextAreaField
          label="Effective thoughts I actually used"
          value={data.thoughtsUsed ?? ""}
          onChange={(v) => update("thoughtsUsed", v)}
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={5}
          title="Paired with relaxation"
          subtitle="Rethinking lands better paired with paired muscle relaxation. Track tension before and after."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ScaleField
            label="Relaxation before"
            value={data.relaxationBefore ?? 0}
            onChange={(v) => update("relaxationBefore", v)}
          />
          <ScaleField
            label="Relaxation after"
            value={data.relaxationAfter ?? 0}
            onChange={(v) => update("relaxationAfter", v)}
          />
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="rethinking-relaxation"
            checked={!!data.rethinkingPlusRelaxation}
            onCheckedChange={(c) => update("rethinkingPlusRelaxation", c === true)}
            className="mt-0.5"
          />
          <Label htmlFor="rethinking-relaxation" className="cursor-pointer text-sm font-normal leading-snug">
            I practiced rethinking plus paired relaxation this week
          </Label>
        </div>
        <ScaleField
          label="Did the combination reduce my stress?"
          value={data.stressReduction ?? 0}
          onChange={(v) => update("stressReduction", v)}
          help="0 = not at all, 5 = very much"
        />
        <TextField
          label="Comments"
          value={data.comments ?? ""}
          onChange={(v) => update("comments", v)}
          placeholder="What got in the way, or what helped most?"
        />
      </section>
    </div>
  );
}
