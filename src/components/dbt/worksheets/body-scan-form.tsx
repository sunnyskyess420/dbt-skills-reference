"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateField, ScaleField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Distress Tolerance Worksheet 6c — body scan meditation, step by step.
export function BodyScanForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Before the scan"
          subtitle="Lie down or sit with your back supported. The aim is to notice sensation, not to change it."
        />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Minutes
          </Label>
          <Input
            type="number"
            min={0}
            max={60}
            value={data.minutes ?? ""}
            onChange={(e) => update("minutes", e.target.value)}
            className="max-w-[120px]"
            placeholder="e.g. 10"
          />
        </div>
        <ScaleField
          label="Distress before"
          value={data.distressBefore ?? 0}
          onChange={(v) => update("distressBefore", v)}
          help="0 = calm, 5 = overwhelmed"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Where the attention went"
          subtitle="A body scan wanders. Note where you noticed something and where you noticed nothing — both are information."
        />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sensations I noticed
          </Label>
          <Textarea
            value={data.sensations ?? ""}
            onChange={(e) => update("sensations", e.target.value)}
            placeholder="Tension, warmth, tingling, numbness, pain, nothing at all — and where."
            rows={3}
            className="resize-y"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Where my mind went
          </Label>
          <Textarea
            value={data.mindWandering ?? ""}
            onChange={(e) => update("mindWandering", e.target.value)}
            placeholder="Planning, replaying, judging. Naming it is the practice."
            rows={2}
            className="resize-y"
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="After the scan" />
        <ScaleField
          label="Distress after"
          value={data.distressAfter ?? 0}
          onChange={(v) => update("distressAfter", v)}
          help="Compare with before — a small shift is a real shift"
        />
        <TextAreaField
          label="What I learned about my body"
          value={data.learned ?? ""}
          onChange={(v) => update("learned", v)}
          placeholder="Where do you carry things you didn't know you were carrying?"
          rows={3}
        />
        <TextAreaField
          label="When I'll do this again"
          value={data.nextTime ?? ""}
          onChange={(v) => update("nextTime", v)}
          placeholder="A time and place, not a resolution."
          rows={2}
        />
      </section>
    </div>
  );
}
