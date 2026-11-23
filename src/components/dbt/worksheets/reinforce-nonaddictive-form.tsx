"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextAreaField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { CheckRow } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Distress Tolerance Worksheet 16 — replace addiction reinforcers with
// abstinence reinforcers, and track the positive events that show up when
// you're not using.
const EFFORTS: { key: string; title: string; hint: string }[] = [
  {
    key: "findPeople",
    title: "Found people to spend time with who aren't addicted",
    hint: "Who did you find? What did you do?",
  },
  {
    key: "enjoyableActivities",
    title: "Increased enjoyable, nonaddictive activities",
    hint: "Which activities, and how often?",
  },
  {
    key: "sampledGroups",
    title: "Sampled different groups and activities",
    hint: "What did you try, and what did you find?",
  },
  {
    key: "positiveEvents",
    title: "Took steps to build positive events that replace the addiction",
    hint: "What action steps?",
  },
];

export function ReinforceNonaddictiveForm({ entry, onChange }: Props) {
  const data = entry.data;
  const efforts: Record<string, boolean> = data.efforts ?? {};
  const positiveRows: { activity: string; events: string }[] = data.positiveEvents ?? [];

  const update = (key: string, value: any) => onChange({ ...data, [key]: value });
  const setEffort = (key: string, v: boolean) => update("efforts", { ...efforts, [key]: v });
  const setPositiveRow = (idx: number, field: string, value: string) => {
    const next = [...positiveRows];
    next[idx] = { ...next[idx], [field]: value };
    update("positiveEvents", next);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Replacing reinforcers"
          subtitle="Every effort to swap addiction reinforcers for abstinence reinforcers — tick what you did and describe it."
        />
        <TextField
          label="Week starting"
          value={data.weekStartDate ?? ""}
          onChange={(v) => update("weekStartDate", v)}
          placeholder="YYYY-MM-DD"
        />
        {EFFORTS.map((e) => (
          <div key={e.key} className="space-y-2 rounded-md border p-3">
            <CheckRow
              id={`effort-${e.key}`}
              label={e.title}
              checked={!!efforts[e.key]}
              onToggle={(v) => setEffort(e.key, v)}
            />
            <Textarea
              value={data[`${e.key}Notes`] ?? ""}
              onChange={(ev) => update(`${e.key}Notes`, ev.target.value)}
              placeholder={e.hint}
              rows={2}
              className="resize-y"
            />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Abstinence sampling"
          subtitle="A committed stretch of days off, and what you noticed while you were off."
        />
        <TextField
          label="Days abstinent committed to / stayed abstinent"
          value={data.daysAbstinent ?? ""}
          onChange={(v) => update("daysAbstinent", v)}
          placeholder="e.g. 'committed to 7, stayed 5'"
        />
        <TextAreaField
          label="Abstinence plan and how I implemented it"
          value={data.abstinencePlan ?? ""}
          onChange={(v) => update("abstinencePlan", v)}
          placeholder="The plan from your dialectical-abstinence worksheet — what you actually did."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Positive events while abstinent"
          subtitle="What actually happened on the other side of not using — name the activity and what it produced."
        />
        {positiveRows.map((row, idx) => (
          <div key={idx} className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
            <Input
              value={row.activity}
              onChange={(e) => setPositiveRow(idx, "activity", e.target.value)}
              placeholder="Nonaddictive activity"
            />
            <Input
              value={row.events}
              onChange={(e) => setPositiveRow(idx, "events", e.target.value)}
              placeholder="Positive events and consequences"
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-primary underline-offset-4 hover:underline"
          onClick={() => update("positiveEvents", [...positiveRows, { activity: "", events: "" }])}
        >
          Add a row
        </button>
        <TextAreaField
          label="What I noticed overall"
          value={data.reflection ?? ""}
          onChange={(v) => update("reflection", v)}
          rows={2}
        />
      </section>
    </div>
  );
}
