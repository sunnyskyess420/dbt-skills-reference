"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function BeingEffectiveForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The situation"
          subtitle="Describe the interpersonal situation where you want to maintain self-respect."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="Describe the situation"
          value={data.situation ?? ""}
          onChange={(v) => update("situation", v)}
          placeholder="Who is involved, what is the context, and what makes this situation challenging for your self-respect?"
          rows={3}
        />
        <TextAreaField
          label="Your objective"
          value={data.objective ?? ""}
          onChange={(v) => update("objective", v)}
          placeholder="What outcome are you seeking? What would 'being effective' look like in this situation?"
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Plan your FAST approach"
          subtitle="For each FAST component, plan how you will apply it to your situation."
        />
        <TextAreaField
          label="F — Be Fair"
          value={data.fair ?? ""}
          onChange={(v) => update("fair", v)}
          hint="Be fair to yourself AND the other person. No attacks, threats, or judging. Use 'I' statements."
          placeholder="e.g., I will describe the situation factually: 'I've been managing three major projects...' instead of 'You're giving me too much work...'"
          rows={3}
        />
        <TextAreaField
          label="A — No Apologies"
          value={data.apologies ?? ""}
          onChange={(v) => update("apologies", v)}
          hint="Don't apologize for having an opinion, making a request, having feelings, or disagreeing."
          placeholder="e.g., Instead of 'I'm sorry to bother you, but...' I will say 'I'd like to discuss my current project load and explore options for support...'"
          rows={3}
        />
        <TextAreaField
          label="S — Stick to Values"
          value={data.values ?? ""}
          onChange={(v) => update("values", v)}
          hint="Don't sell out your values or beliefs to get what you want or to keep the other person liking you."
          placeholder="e.g., I value honesty and self-care. I will be honest about my capacity without overcommitting, even if it means saying no to additional work."
          rows={3}
        />
        <TextAreaField
          label="T — Be Truthful"
          value={data.truthful ?? ""}
          onChange={(v) => update("truthful", v)}
          hint="Don't lie, act helpless when you aren't, or exaggerate. Be honest about your thoughts, feelings, and capabilities."
          placeholder="e.g., I will accurately describe my workload without exaggerating or downplaying. I won't say I 'can't do anything' when I can do some things."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Write your script"
          subtitle="Using your FAST plan, write out what you will actually say."
        />
        <TextAreaField
          label="Your script"
          value={data.script ?? ""}
          onChange={(v) => update("script", v)}
          placeholder="e.g., 'I'd like to talk about my current project load. I'm currently managing three major projects and I've found it difficult to give each one the attention it deserves. I'd like to explore whether it's possible to redistribute one of the tasks...'"
          rows={5}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={4}
          title="Reflect on the outcome"
          subtitle="After the interaction, describe what happened."
        />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="Did you use FAST? Were you effective? What went well? What would you do differently next time? Remember: being effective means you feel good about HOW you handled the interaction, not that you always got what you wanted."
          rows={4}
        />
      </section>
    </div>
  );
}
