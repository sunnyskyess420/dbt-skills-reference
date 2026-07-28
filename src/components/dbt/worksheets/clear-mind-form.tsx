"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function ClearMindForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string | number) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Check in with your state"
          subtitle="Addict Mind = active addiction. Clean Mind = abstinent but complacent. Clear Mind = abstinent AND aware, prepared, engaged."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextField
          label="Which state are you in right now?"
          value={data.currentstate ?? ""}
          onChange={(v) => update("currentstate", v)}
          placeholder="Addict Mind / Clean Mind / Clear Mind"
        />
        <ScaleField
          label="Recovery confidence (0-5)"
          value={data.confidence ?? 0}
          onChange={(v) => update("confidence", v)}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Danger signs for Clean Mind complacency"
          subtitle="Clean Mind can become complacent — forgetting how easily addiction returns."
        />
        <TextAreaField
          label="What might trigger a return to Addict Mind?"
          value={data.triggers ?? ""}
          onChange={(v) => update("triggers", v)}
          placeholder="Stress, social situations, specific emotions, places, people..."
          rows={3}
        />
        <TextAreaField
          label="Signs I'm slipping toward complacency"
          value={data.complacencySigns ?? ""}
          onChange={(v) => update("complacencySigns", v)}
          placeholder="e.g., 'I've been fine for months, I can handle one drink' or stopping meetings..."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="My Clear Mind plan"
          subtitle="Abstinent AND aware, prepared, and engaged in ongoing recovery."
        />
        <TextAreaField
          label="My recovery practices"
          value={data.recoveryPractices ?? ""}
          onChange={(v) => update("recoveryPractices", v)}
          placeholder="Meetings, therapy, exercise, journaling, support calls, medication..."
          rows={3}
        />
        <TextAreaField
          label="My slip plan (harm reduction if I slip)"
          value={data.slipPlan ?? ""}
          hint="Have this written BEFORE a slip — during the slip is too late. A slip is not failure — apply harm reduction immediately."
          placeholder="If I slip: 1. 2. 3."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Reflection" />
        <TextAreaField
          label="Reflection"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          placeholder="Am I in Clear Mind? What keeps me there? What needs to change?"
          rows={3}
        />
      </section>
    </div>
  );
}
