"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function CopeAheadForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The situation"
          subtitle="Describe a situation that's likely to trigger a problem emotion or behavior. Be specific."
        />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="Describe the situation"
          value={data.situation ?? ""}
          onChange={(v) => update("situation", v)}
          placeholder="e.g., Thanksgiving dinner with my family. My uncle will probably make a comment about my weight, and my mom will defend him."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Expected emotions"
          subtitle="What emotions do you expect to come up? How intense?"
        />
        <TextField
          label="Emotions I expect"
          value={data.expectedEmotions ?? ""}
          onChange={(v) => update("expectedEmotions", v)}
          placeholder="e.g., Anger, shame, embarrassment, urge to leave or drink"
        />
        <ScaleField
          label="Expected intensity (0-5)"
          value={data.intensity ?? 0}
          onChange={(v) => update("intensity", v)}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="The skill I'll use"
          subtitle="Decide ahead of time which DBT skill(s) you'll use in this situation."
        />
        <TextAreaField
          label="Skill(s) I will use"
          value={data.skillToUse ?? ""}
          onChange={(v) => update("skillToUse", v)}
          placeholder="e.g., STOP when he makes the comment, then opposite action (stay engaged, don't withdraw), then DEAR MAN if I want to address it directly"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={4}
          title="Vivid imagination"
          subtitle="Now imagine the situation in full detail. See it, hear it, feel it in your body — including the emotions you expect to feel."
        />
        <TextAreaField
          label="Vivid imagery of the situation"
          value={data.vividImagery ?? ""}
          onChange={(v) => update("vividImagery", v)}
          placeholder="Describe what you see, hear, and feel in your imagination. The more vivid, the better it transfers to the real moment. Where are you? What's on the table? What does his voice sound like? What do you feel in your body?"
          rows={4}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={5}
          title="Rehearse the skill"
          subtitle="In your imagination, see yourself using the skill. Watch yourself doing it — successfully — in the situation."
        />
        <TextAreaField
          label="Rehearsal — me using the skill"
          value={data.rehearsal ?? ""}
          onChange={(v) => update("rehearsal", v)}
          placeholder="See yourself doing the skill in the imagined situation. What do you say? How does your body feel? What happens after you use the skill?"
          rows={4}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={6}
          title="Relax while imagining"
          subtitle="While you're imagining the situation and rehearsing the skill, practice relaxing your body. This pairs relaxation with the difficult situation."
        />
        <TextAreaField
          label="Relaxation plan"
          value={data.relaxationPlan ?? ""}
          onChange={(v) => update("relaxationPlan", v)}
          placeholder="e.g., Breathe slowly (4-7-8), release tension in my jaw and shoulders, half-smile while I imagine the scene"
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={7}
          title="Coping plan"
          subtitle="What's your concrete plan for when the situation actually happens?"
        />
        <TextAreaField
          label="My coping plan"
          value={data.copingPlan ?? ""}
          onChange={(v) => update("copingPlan", v)}
          placeholder="e.g., When my uncle comments on my weight, I will: 1) STOP (pause, breathe), 2) Opposite action (stay at the table, don't withdraw), 3) If needed, excuse myself to the bathroom for 2 minutes of paced breathing"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={8}
          title="Obstacles"
          subtitle="What might get in the way of using your plan?"
        />
        <TextAreaField
          label="Potential obstacles"
          value={data.obstacles ?? ""}
          onChange={(v) => update("obstacles", v)}
          placeholder="e.g., If I've been drinking, I might forget the plan. If my mom joins in, the intensity might be too high for opposite action."
          rows={2}
        />
        <TextAreaField
          label="Notes"
          value={data.notes ?? ""}
          onChange={(v) => update("notes", v)}
          placeholder="Anything else?"
          rows={2}
        />
      </section>
    </div>
  );
}
