"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function BehaviorChangeForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The target behavior"
          subtitle="What behavior do you want to increase or decrease? Be specific."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="What behavior do I want to change?"
          value={data.targetBehavior ?? ""}
          onChange={(v) => update("targetBehavior", v)}
          placeholder="Be specific: 'I want to increase...' or 'I want to decrease...'"
          rows={2}
        />
        <TextAreaField
          label="Who is the target? (self, or another person)"
          value={data.target ?? ""}
          onChange={(v) => update("target", v)}
          placeholder="Am I changing my own behavior, or influencing someone else's?"
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="To increase a behavior: Reinforce it"
          subtitle="Positive reinforcement (adding something pleasant) is more powerful and less damaging than punishment. Reinforcement must be immediate."
        />
        <TextAreaField
          label="What reinforcement will I use?"
          value={data.reinforcement ?? ""}
          onChange={(v) => update("reinforcement", v)}
          hint="What desirable consequence will follow the behavior? It must be immediate to work."
          placeholder="e.g., After I take a walk, I'll make my favorite tea. After I speak up, I'll acknowledge myself."
          rows={3}
        />
        <TextAreaField
          label="Am I accidentally rewarding the behavior I want to decrease?"
          value={data.accidentalReward ?? ""}
          onChange={(v) => update("accidentalReward", v)}
          hint="Attention (even angry attention) reinforces behavior. What am I doing that maintains the problem behavior?"
          placeholder="e.g., When they yell, I give them attention. When I skip exercise, I scroll my phone..."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="To decrease a behavior: Extinction"
          subtitle="Stop reinforcing the behavior. Easier said than done — especially if the behavior is intense."
        />
        <TextAreaField
          label="What reinforcement am I currently providing that I need to stop?"
          value={data.extinctionPlan ?? ""}
          onChange={(v) => update("extinctionPlan", v)}
          placeholder="What am I doing that keeps this behavior going? What will I do instead when it happens?"
          rows={3}
        />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="What patterns do I notice? Am I being consistent? What needs to change?"
          rows={3}
        />
      </section>
    </div>
  );
}
