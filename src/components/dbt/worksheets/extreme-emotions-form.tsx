"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function ExtremeEmotionsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="My extreme emotion plan"
          subtitle="Have this plan BEFORE extreme emotions hit. At 8/10+, you won't be reasoning out which skill to use."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextField
          label="My most common extreme emotions"
          value={data.commonEmotions ?? ""}
          onChange={(v) => update("commonEmotions", v)}
          placeholder="e.g., rage, panic, shame spirals"
        />
        <TextAreaField
          label="My early warning signs"
          value={data.warningSigns ?? ""}
          onChange={(v) => update("warningSigns", v)}
          hint="What happens FIRST? Body cues, thoughts, behaviors that signal escalation."
          placeholder="e.g., jaw clenches, thoughts speed up, start raising voice, chest tightens..."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="My crisis plan"
          subtitle="When intensity hits 8/10, switch to distress tolerance FIRST, then return to ER skills when it drops."
        />
        <TextAreaField
          label="First: Distress Tolerance skills to use"
          value={data.dtSkills ?? ""}
          onChange={(v) => update("dtSkills", v)}
          hint="STOP, TIPP, ACCEPTS, Self-Soothe, IMPROVE, Radical Acceptance. Which work best for YOU?"
          placeholder="e.g., 1. Cold water on face (TIPP) 2. 50 jumping jacks 3. Paced breathing..."
          rows={3}
        />
        <TextAreaField
          label="Then: Emotion Regulation skills to use after intensity drops"
          value={data.erSkills ?? ""}
          onChange={(v) => update("erSkills", v)}
          hint="Check the Facts, Opposite Action, Problem Solving. What will you do when you can think again?"
          placeholder="e.g., 1. Check the Facts on what triggered me 2. Opposite Action for the emotion..."
          rows={3}
        />
        <TextAreaField
          label="People I can contact"
          value={data.contacts ?? ""}
          onChange={(v) => update("contacts", v)}
          placeholder="Name / Number / When to call\nName / Number / When to call"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Aftercare"
          subtitle="After an extreme emotion episode, working the PLEASE basics is critical to prevent recurrence."
        />
        <TextAreaField
          label="What happened?"
          value={data.whatHappened ?? ""}
          onChange={(v) => update("whatHappened", v)}
          placeholder="Describe the episode. What triggered it, what skills did you use, how long did it last?"
          rows={4}
        />
        <TextAreaField
          label="Aftercare plan"
          value={data.aftercare ?? ""}
          hint="Physical illness treated? Eating? Mood-altering substances avoided? Sleep? Exercise? (PLEASE)"
          placeholder="What self-care do I need right now? Rest, food, a walk, a shower..."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Reflection" />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="Did the plan work? What should I change for next time?"
          rows={3}
        />
      </section>
    </div>
  );
}
