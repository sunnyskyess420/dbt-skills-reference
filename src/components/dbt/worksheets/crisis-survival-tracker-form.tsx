"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, ScaleField, Field } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

const CRISIS_SKILLS = [
  { key: "stop", label: "STOP", desc: "Stop, Take a step back, Observe, Proceed mindfully" },
  { key: "tipp", label: "TIPP", desc: "Temperature, Intense exercise, Paced breathing, Paired muscle relaxation" },
  { key: "prosCons", label: "Pros & Cons", desc: "Weighed acting on vs. resisting the urge" },
  { key: "distract", label: "Distract (ACCEPTS)", desc: "Activities, Contributing, Comparisons, Emotions, Pushing away, Thoughts, Sensations" },
  { key: "selfSoothe", label: "Self-Soothe", desc: "Five senses: Vision, Hearing, Smell, Taste, Touch" },
  { key: "improve", label: "IMPROVE", desc: "Imagery, Meaning, Prayer, Relaxation, One thing, Vacation, Encouragement" },
  { key: "radicalAcceptance", label: "Radical Acceptance", desc: "Accepted reality as it is" },
  { key: "turningMind", label: "Turning the Mind", desc: "Turned back to acceptance when slipping" },
];

export function CrisisSurvivalTrackerForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });
  const toggleSkill = (key: string, checked: boolean) => {
    update("skillsUsed", { ...(data.skillsUsed ?? {}), [key]: checked });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The crisis" subtitle="Describe the crisis you used skills to survive." />
        <DateField label="Date of crisis" value={data.crisisDate ?? ""} onChange={(v) => update("crisisDate", v)} />
        <TextAreaField label="What happened?" value={data.crisisDescription ?? ""} onChange={(v) => update("crisisDescription", v)} placeholder="Briefly describe the crisis situation" rows={3} />
        <ScaleField label="Intensity of the crisis (0-5)" value={data.intensity ?? 0} onChange={(v) => update("intensity", v)} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="Skills I used" subtitle="Check off which crisis survival skills you tried." />
        <Field label="Skills used">
          <div className="space-y-2">
            {CRISIS_SKILLS.map((skill) => {
              const checked = data.skillsUsed?.[skill.key] ?? false;
              return (
                <label key={skill.key} className={cn("flex items-start gap-2 p-2.5 rounded-md border cursor-pointer transition-colors", checked ? "border-sky-500 bg-sky-500/5" : "border-border hover:bg-muted/40")}>
                  <Checkbox checked={checked} onCheckedChange={(c) => toggleSkill(skill.key, c === true)} className="mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{skill.label}</div>
                    <div className="text-[11px] text-muted-foreground">{skill.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </Field>
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="What worked" subtitle="Reflect on what helped and what didn't." />
        <TextAreaField label="What helped?" value={data.whatHelped ?? ""} onChange={(v) => update("whatHelped", v)} placeholder="Which skills actually reduced the intensity? What worked?" rows={3} />
        <TextAreaField label="What didn't help?" value={data.whatDidntHelp ?? ""} onChange={(v) => update("whatDidntHelp", v)} placeholder="Which skills didn't work? Why not?" rows={2} />
        <TextAreaField label="What I did instead" value={data.whatIDidInstead ?? ""} onChange={(v) => update("whatIDidInstead", v)} placeholder="If you acted on the urge, what did you do?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Next time" subtitle="What will you try next time a similar crisis happens?" />
        <TextAreaField label="What to try next time" value={data.whatToTryNextTime ?? ""} onChange={(v) => update("whatToTryNextTime", v)} placeholder="Based on what you learned, what will you try first next time?" rows={2} />
        <TextAreaField label="Skills I wish I'd known" value={data.skillsListMissing ?? ""} onChange={(v) => update("skillsListMissing", v)} placeholder="Did you realize you were missing a skill you don't know yet?" rows={2} />
      </section>
    </div>
  );
}
