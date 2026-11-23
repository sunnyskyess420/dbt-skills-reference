"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DateField, TextAreaField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Emotion Regulation Handout 18 groups values into life areas. The wording here
// is a short working paraphrase so each option fits on one phone line; the
// structure (tick what you value, then rank the handful that matter most now)
// is what matters for the exercise.
const CATEGORIES: { id: string; label: string; values: string[] }[] = [
  {
    id: "relationships",
    label: "Attend to relationships",
    values: [
      "Repair relationships that broke down",
      "Reach out and build new relationships",
      "Work on the relationships I have",
      "End relationships that are destructive",
    ],
  },
  {
    id: "belonging",
    label: "Be part of a group",
    values: [
      "Have close, satisfying relationships",
      "Feel a sense of belonging",
      "Give and receive affection and love",
      "Have and keep close friends",
      "Have people to do things with",
    ],
  },
  {
    id: "power",
    label: "Be powerful and able to influence others",
    values: [
      "Have authority over decisions or resources",
      "Be a leader",
      "Earn a great deal of money",
      "Be respected by others",
      "Be seen as successful or well known",
      "Compete successfully with others",
    ],
  },
  {
    id: "achieve",
    label: "Achieve things in life",
    values: [
      "Achieve goals I believe are significant",
      "Be productive",
      "Work hard toward my goals",
      "Be ambitious",
    ],
  },
  {
    id: "pleasure",
    label: "Live a life of pleasure and satisfaction",
    values: [
      "Have a good time",
      "Seek out fun and pleasure",
      "Have free time",
      "Enjoy the work I do",
    ],
  },
  {
    id: "excitement",
    label: "Keep life full of exciting things",
    values: [
      "Try new and different things",
      "Be daring and seek adventure",
      "Have an exciting life",
    ],
  },
  {
    id: "respect",
    label: "Behave respectfully",
    values: [
      "Be humble and modest",
      "Follow traditions and customs",
      "Follow the rules and do what I'm told",
      "Treat others well",
    ],
  },
  {
    id: "self-directed",
    label: "Be self-directed",
    values: [
      "Follow my own path in life",
      "Be creative and think of new ideas",
      "Make my own decisions and be free",
      "Be independent and take care of myself",
      "Act on my own priorities",
    ],
  },
  {
    id: "spiritual",
    label: "Be a spiritual person",
    values: [
      "Make room in my life for spirituality",
      "Practice a religion or faith",
      "Grow in understanding of myself and my purpose",
      "Find lasting meaning in life",
    ],
  },
  {
    id: "secure",
    label: "Be secure",
    values: [
      "Live in safe surroundings",
      "Be physically healthy and fit",
      "Have a steady income that covers basic needs",
    ],
  },
  {
    id: "fairness",
    label: "Recognise the good of all things",
    values: [
      "Be fair and treat people equally",
      "Understand different people and be open-minded",
      "Care for nature and the environment",
    ],
  },
  {
    id: "community",
    label: "Contribute to the larger community",
    values: [
      "Help people in need and improve society",
      "Be loyal to friends and devoted to close people",
      "Commit to a cause bigger than myself",
      "Make sacrifices for others",
    ],
  },
  {
    id: "growth",
    label: "Work at self-development",
    values: [
      "Develop a personal philosophy of life",
      "Learn and do challenging things that help me grow",
    ],
  },
  {
    id: "integrity",
    label: "Have integrity",
    values: [
      "Be honest and stand up for what I believe",
      "Be responsible and keep my word",
      "Be courageous in facing life",
      "Repair damage I have caused",
      "Accept myself, others, and life as it is",
    ],
  },
];

const PRIORITY_SLOTS = [1, 2, 3, 4, 5];

export function ValuesPrioritiesForm({ entry, onChange }: Props) {
  const data = entry.data;
  const checked: Record<string, boolean> = data.checked ?? {};
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });
  const toggle = (key: string, on: boolean) => update("checked", { ...checked, [key]: on });

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <SectionHeading
          number={1}
          title="In my own Wise Mind, it is important to me to…"
          subtitle="Tick everything you hold as a value. There are no wrong answers — ticking something is not a promise to do it."
        />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />

        {CATEGORIES.map((cat, idx) => (
          <div key={cat.id} className="space-y-2">
            <h3 className="text-sm font-semibold leading-snug">
              <span className="mr-1.5 text-muted-foreground">{String.fromCharCode(97 + idx)}.</span>
              {cat.label}
            </h3>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {cat.values.map((label, j) => {
                const key = `${cat.id}-${j}`;
                return (
                  <div key={key} className="flex items-start gap-2">
                    <Checkbox
                      id={key}
                      checked={!!checked[key]}
                      onCheckedChange={(c) => toggle(key, c === true)}
                      className="mt-0.5"
                    />
                    <Label htmlFor={key} className="cursor-pointer text-sm font-normal leading-snug">
                      {label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <TextAreaField
          label="Other values (not on this list)"
          value={data.otherValues ?? ""}
          onChange={(v) => update("otherValues", v)}
          placeholder="Anything you value that isn't above — in your own words."
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="My top priorities right now"
          subtitle="From everything you ticked, pick the few that matter most this season. These become the focus of Accumulating Positive Emotions: Long Term."
        />
        {PRIORITY_SLOTS.map((n) => (
          <TextField
            key={n}
            label={`Priority ${n}`}
            value={data[`priority${n}`] ?? ""}
            onChange={(v) => update(`priority${n}`, v)}
            placeholder={
              n === 1
                ? "The one to work on first"
                : n === 5
                  ? "Optional"
                  : ""
            }
          />
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Notes"
          subtitle="Next step: turn one priority into concrete action steps with the Values to Action Steps worksheet (Emotion Regulation Worksheet 11)."
        />
        <TextAreaField
          label="Notes"
          value={data.notes ?? ""}
          onChange={(v) => update("notes", v)}
          placeholder="What did this list show you? Anything you want to talk through in session?"
          rows={3}
        />
      </section>
    </div>
  );
}
