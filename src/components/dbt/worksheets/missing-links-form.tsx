"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

const MISSING_LINK_TYPES = [
  {
    key: "forgetting",
    label: "Forgetting",
    description: "I knew the skill existed but didn't remember it in the moment.",
  },
  {
    key: "not-noticing",
    label: "Not noticing the cue",
    description: "I didn't recognize the situation as one where the skill was needed.",
  },
  {
    key: "not-believing",
    label: "Not believing it would work",
    description: "I doubted the skill would help, so I didn't try.",
  },
  {
    key: "fear-skill-works",
    label: "Fear it would work",
    description: "Some part of me didn't want the skill to work (e.g., wanted to act on the urge).",
  },
  {
    key: "not-knowing-how",
    label: "Not knowing how to start",
    description: "I knew the skill but not the first step to take in the moment.",
  },
  {
    key: "overwhelm",
    label: "Too overwhelmed",
    description: "Emotion was so high I couldn't access the skill in memory.",
  },
  {
    key: "no-time",
    label: "Felt I didn't have time",
    description: "I felt I needed to react instantly and couldn't pause to use a skill.",
  },
  {
    key: "didnt-want",
    label: "Didn't want to use it",
    description: "I wanted to act on the urge more than I wanted to use the skill.",
  },
  {
    key: "shame",
    label: "Shame about needing the skill",
    description: "Using a skill felt like an admission of weakness.",
  },
  {
    key: "other",
    label: "Other",
    description: "Something else got in the way (describe in notes).",
  },
];

export function MissingLinksForm({ entry, onChange }: Props) {
  const data = entry.data;

  const update = (key: string, value: any) => {
    onChange({ ...data, [key]: value });
  };

  const toggleMissingLinkType = (key: string, checked: boolean) => {
    const current: string[] = Array.isArray(data.missingLinkType) ? data.missingLinkType : [];
    const next = checked ? [...current, key] : current.filter((k) => k !== key);
    update("missingLinkType", next);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The skill and the situation"
          subtitle="What skill did you intend to use, and in what situation should you have used it?"
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="The skill I intended to use"
          value={data.skillIntended ?? ""}
          onChange={(v) => update("skillIntended", v)}
          placeholder="e.g., STOP skill, opposite action for shame, radical acceptance..."
          rows={2}
        />
        <TextAreaField
          label="The situation where I should have used it"
          value={data.situation ?? ""}
          onChange={(v) => update("situation", v)}
          placeholder="Describe the situation factually. When and where did it happen? Who was involved?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="What actually happened"
          subtitle="Walk through what you actually did (or didn't do). Find the precise point where the skill dropped out."
        />
        <TextAreaField
          label="What I actually did instead"
          value={data.whatHappened ?? ""}
          onChange={(v) => update("whatHappened", v)}
          placeholder="Walk through the sequence. What happened instead of using the skill? When, exactly, did the skill drop out?"
          rows={4}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="The missing link"
          subtitle="What got in the way between knowing the skill and using it? Check all that apply — but try to identify the PRIMARY missing link."
        />
        <Field label="Missing link type(s)">
          <div className="grid sm:grid-cols-2 gap-2">
            {MISSING_LINK_TYPES.map((opt) => {
              const checked = Array.isArray(data.missingLinkType) && data.missingLinkType.includes(opt.key);
              return (
                <label
                  key={opt.key}
                  className={cn(
                    "flex items-start gap-2 p-2.5 rounded-md border cursor-pointer transition-colors",
                    checked
                      ? "border-orange-500 bg-orange-500/5"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(c) => toggleMissingLinkType(opt.key, c === true)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-[11px] text-muted-foreground">{opt.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </Field>
        <TextAreaField
          label="Notes on the missing link"
          value={data.missingLinkNotes ?? ""}
          onChange={(v) => update("missingLinkNotes", v)}
          placeholder="Describe the missing link in your own words. What specifically got in the way? Which one feels primary?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={4}
          title="Barriers and context"
          subtitle="What else was going on that contributed? Vulnerabilities, environment, history?"
        />
        <TextAreaField
          label="What else got in the way?"
          value={data.barriers ?? ""}
          onChange={(v) => update("barriers", v)}
          placeholder="Vulnerabilities (tired, hungry, sick), environmental factors, history with this kind of situation, secondary gains from not using the skill..."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={5}
          title="Plan to close the gap"
          subtitle="The missing link is specific. The strategy to close it should be specific too."
        />
        <TextAreaField
          label="Strategy to close this specific gap"
          value={data.planStrategy ?? ""}
          onChange={(v) => update("planStrategy", v)}
          placeholder={
            "If forgetting: keep a skill card on my phone lock screen.\n" +
            "If not-noticing: write a list of triggers for this skill on the bathroom mirror.\n" +
            "If not-believing: list 3 times this skill has worked in the past, review when in doubt.\n" +
            "If fear: practice opposite action to the fear — try the skill anyway."
          }
          rows={4}
        />
        <TextAreaField
          label="What I'll do next time"
          value={data.nextTimePlan ?? ""}
          onChange={(v) => update("nextTimePlan", v)}
          placeholder="Be concrete: 'Next time [situation X happens], I will [skill Y] at the moment when [specific cue].'"
          rows={3}
        />
        <TextAreaField
          label="Cue / reminder I'll use"
          value={data.cueReminder ?? ""}
          onChange={(v) => update("cueReminder", v)}
          placeholder="What will trigger me to remember the skill in the moment? A phone reminder? A sticky note? A specific physical cue (e.g., a bracelet)?"
          rows={2}
        />
      </section>

      <section className="rounded-md border bg-muted/30 p-4 space-y-2">
        <h2 className="text-sm font-semibold">Reminder</h2>
        <p className="text-xs text-muted-foreground">
          The point of missing-links analysis is NOT to judge yourself for not using the skill.
          It's to find the specific gap between knowing and doing — because that gap is where
          you can intervene next time. "I should have tried harder" is not a missing link;
          "I forgot the skill existed" is.
        </p>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
