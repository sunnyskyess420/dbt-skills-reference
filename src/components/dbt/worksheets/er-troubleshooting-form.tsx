"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { CheckRow } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Emotion Regulation Worksheet 16 — troubleshooting when the skills aren't
// working. Distinct from troubleshooting-ie: this one is about emotions that
// won't come down, not about a conversation that went wrong.
const SKILLS_TRIED = [
  { key: "checkFacts", label: "Check the facts" },
  { key: "oppositeAction", label: "Opposite action" },
  { key: "problemSolving", label: "Problem solving" },
  { key: "please", label: "PLEASE / body care" },
  { key: "accumulate", label: "Accumulating positives" },
  { key: "mindfulnessEmotions", label: "Mindfulness of current emotions" },
  { key: "distressTolerance", label: "Distress tolerance (TIPP, ACCEPTS, IMPROVE)" },
  { key: "validation", label: "Self-validation" },
];

const REASONS = [
  { key: "tooIntense", label: "The emotion was too intense to think at the time" },
  { key: "wrongSkill", label: "It was the wrong skill for this emotion" },
  { key: "didntFitFacts", label: "The emotion fits the facts — nothing to change, only to accept" },
  { key: "reinforced", label: "Acting on the urge paid off somewhere, so the behaviour keeps getting reinforced" },
  { key: "environment", label: "The environment keeps re-triggering it" },
  { key: "notEnoughPractice", label: "I haven't practised it enough for it to work yet" },
  { key: "body", label: "Body factors (sleep, illness, substances) are working against me" },
];

export function ErTroubleshootingForm({ entry, onChange }: Props) {
  const data = entry.data;
  const tried: Record<string, boolean> = data.tried ?? {};
  const reasons: Record<string, boolean> = data.reasons ?? {};
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The emotion that won't come down"
          subtitle="Name one specific emotion and the situation it keeps showing up in."
        />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="The emotion"
          value={data.emotion ?? ""}
          onChange={(v) => update("emotion", v)}
          placeholder="e.g. Shame, every time I speak in the Monday meeting."
          rows={2}
        />
        <TextAreaField
          label="How it shows up"
          value={data.howItShows ?? ""}
          onChange={(v) => update("howItShows", v)}
          placeholder="Body sensations, urges, what I do next."
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="What I've tried" subtitle="Tick honestly — including the ones you tried once and abandoned." />
        <div className="grid gap-2 sm:grid-cols-2">
          {SKILLS_TRIED.map((s) => (
            <CheckRow
              key={s.key}
              id={`tried-${s.key}`}
              label={s.label}
              checked={!!tried[s.key]}
              onToggle={(v) => update("tried", { ...tried, [s.key]: v })}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Why it might not be working" subtitle="Most of the time it's one of these, not 'I'm bad at this'." />
        <div className="space-y-2">
          {REASONS.map((r) => (
            <CheckRow
              key={r.key}
              id={`reason-${r.key}`}
              label={r.label}
              checked={!!reasons[r.key]}
              onToggle={(v) => update("reasons", { ...reasons, [r.key]: v })}
            />
          ))}
        </div>
        <TextAreaField
          label="What I think is going on"
          value={data.diagnosis ?? ""}
          onChange={(v) => update("diagnosis", v)}
          placeholder="Your best guess, in plain language."
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="The change" subtitle="One adjustment, not five. Pick the one that follows from what you ticked above." />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What I'll do differently
          </Label>
          <Textarea
            value={data.adjustment ?? ""}
            onChange={(e) => update("adjustment", e.target.value)}
            placeholder="e.g. 'Use TIPP first when shame hits 8/10, then check the facts once it's under 6.'"
            rows={3}
            className="resize-y"
          />
        </div>
        <TextAreaField
          label="What I need from my therapist or group"
          value={data.support ?? ""}
          onChange={(v) => update("support", v)}
          placeholder="A rehearsal, a check-in, someone to notice with."
          rows={2}
        />
      </section>
    </div>
  );
}
