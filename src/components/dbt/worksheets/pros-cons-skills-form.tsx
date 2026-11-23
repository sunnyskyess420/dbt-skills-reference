"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// General Worksheet 1 — pros and cons of using skills at all. The same sheet is
// handed out at the start of each module, so the module is a field rather than
// three near-identical worksheet types.
const MODULES = [
  { value: "general", label: "General / starting skills training" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "interpersonal", label: "Interpersonal Effectiveness" },
  { value: "emotion-regulation", label: "Emotion Regulation" },
  { value: "distress-tolerance", label: "Distress Tolerance" },
];

const QUADRANTS: { key: string; label: string; hint: string }[] = [
  {
    key: "prosShort",
    label: "Pros — short term",
    hint: "What gets better today or this week if I use the skills?",
  },
  {
    key: "consShort",
    label: "Cons — short term",
    hint: "What does using skills cost me right now? Time, energy, looking weak, being seen?",
  },
  {
    key: "prosLong",
    label: "Pros — long term",
    hint: "What gets better over months if I keep going?",
  },
  {
    key: "consLong",
    label: "Cons — long term",
    hint: "What do I lose long term by using skills — or by not using them?",
  },
];

export function ProsConsSkillsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Module"
          subtitle="Which part of skills training is this about? Do the sheet again at the start of each module — the answers change."
        />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Module</Label>
          <Select value={data.module ?? "general"} onValueChange={(v) => update("module", v)}>
            <SelectTrigger className="max-w-[320px]">
              <SelectValue placeholder="Pick a module" />
            </SelectTrigger>
            <SelectContent>
              {MODULES.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="What using skills costs and buys"
          subtitle="Be honest about the cons. A sheet with nothing in the con boxes is a sheet you filled in to look good."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {QUADRANTS.map((q) => (
            <div key={q.key} className="space-y-1.5 rounded-md border p-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {q.label}
              </Label>
              <Textarea
                value={data[q.key] ?? ""}
                onChange={(e) => update(q.key, e.target.value)}
                placeholder={q.hint}
                rows={5}
                className="resize-y"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Conclusion" subtitle="What does the balance actually say — and what will you do about it?" />
        <TextAreaField
          label="What this balance says"
          value={data.conclusion ?? ""}
          onChange={(v) => update("conclusion", v)}
          placeholder="e.g. 'The short-term cons are real, but the long-term cons of not doing this are bigger.'"
          rows={3}
        />
        <TextAreaField
          label="The one skill I'll start with anyway"
          value={data.commitment ?? ""}
          onChange={(v) => update("commitment", v)}
          placeholder="Name it specifically enough that you'll know whether you did it."
          rows={2}
        />
      </section>
    </div>
  );
}
