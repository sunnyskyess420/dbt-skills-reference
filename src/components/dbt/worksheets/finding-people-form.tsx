"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function FindingPeopleForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Where to look"
          subtitle="Go where your interests are, not just where there are people. Frequency of contact matters more than intensity."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="My interests and passions"
          value={data.interests ?? ""}
          onChange={(v) => update("interests", v)}
          placeholder="What do you enjoy? What matters to you? These are clues to where your people are."
          rows={3}
        />
        <TextAreaField
          label="Where can I find people who share these interests?"
          value={data.whereToLook ?? ""}
          onChange={(v) => update("whereToLook", v)}
          placeholder="Classes, groups, volunteering, online communities, events, clubs..."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="How to connect"
          subtitle="Show genuine interest in others. People like people who are curious about them."
        />
        <TextAreaField
          label="Conversation starters I can use"
          value={data.conversationStarters ?? ""}
          onChange={(v) => update("conversationStarters", v)}
          placeholder="Ask about them: 'What brings you here?' 'How did you get into this?' 'What do you enjoy about it?'"
          rows={3}
        />
        <TextAreaField
          label="What kind of person do I want to be around others?"
          value={data.howToBe ?? ""}
          onChange={(v) => update("howToBe", v)}
          hint="Warm, curious, reliable, genuine. What traits do you value in a friend? Be that person."
          placeholder="e.g., I want to be warm, ask good questions, follow up..."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Action plan" />
        <TextField
          label="One specific step I will take this week"
          value={data.thisWeekStep ?? ""}
          onChange={(v) => update("thisWeekStep", v)}
          placeholder="e.g., Attend the Wednesday evening book club at the library"
        />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="What happened? What did I learn about connecting?"
          rows={3}
        />
      </section>
    </div>
  );
}
