"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScaleField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { CheckRow } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Distress Tolerance Worksheet 17 — burn the bridges back to the addiction and
// build new ones. Three lists: what made it possible, what you removed; what
// tempted you, what you cut off; what makes it impossible, what you built.
interface BridgeRow {
  item: string;
  done: boolean;
}

const BRIDGE_LISTS: { key: string; title: string; hint: string }[] = [
  {
    key: "enablers",
    title: "Things that made addiction possible — and that I got rid of",
    hint: "Money, access, routines, the place you kept things…",
  },
  {
    key: "tempting",
    title: "Tempting people and contact info — and what I cut off",
    hint: "Names, numbers, websites, dealers, the group chat…",
  },
  {
    key: "barriers",
    title: "Things that would make addiction impossible — and that I did",
    hint: "New routines, people who'd notice, consequences that now exist…",
  },
];

const URGE_STRATEGIES: { key: string; label: string }[] = [
  { key: "keptImagery", label: "Kept new imagery in mind when urges hit" },
  { key: "movingImages", label: "Looked at moving images" },
  { key: "smells", label: "Surrounded myself with new smells" },
  { key: "urgeSurfed", label: "Urge-surfed through it" },
];

function blankRows(): BridgeRow[] {
  return [{ item: "", done: false }];
}

export function BurningBridgesForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  const getRows = (key: string): BridgeRow[] => data[key] ?? blankRows();
  const setRows = (key: string, rows: BridgeRow[]) => update(key, rows);
  const setRow = (key: string, idx: number, field: keyof BridgeRow, value: any) => {
    const next = [...getRows(key)];
    next[idx] = { ...next[idx], [field]: value };
    setRows(key, next);
  };

  const strategies: Record<string, boolean> = data.urgeStrategies ?? {};
  const setStrategy = (key: string, v: boolean) => update("urgeStrategies", { ...strategies, [key]: v });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="How slammed is the door?"
          subtitle="Rate the commitment, then go into Wise Mind and rate it again."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ScaleField
            label="Commitment to quitting (0 = none, 5 = absolute)"
            value={data.commitment ?? 0}
            onChange={(v) => update("commitment", v)}
          />
          <ScaleField
            label="Wise Mind re-check"
            value={data.wiseCommitment ?? 0}
            onChange={(v) => update("wiseCommitment", v)}
          />
        </div>
      </section>

      {BRIDGE_LISTS.map((list, li) => (
        <section key={list.key} className="space-y-3">
          <SectionHeading number={li + 2} title={list.title} subtitle={list.hint} />
          {getRows(list.key).map((row, idx) => (
            <div key={idx} className="space-y-1.5 rounded-md border p-3">
              <Input
                value={row.item}
                onChange={(e) => setRow(list.key, idx, "item", e.target.value)}
                placeholder="The thing…"
              />
              <CheckRow
                id={`${list.key}-${idx}`}
                label="Got rid of it / did it"
                checked={!!row.done}
                onToggle={(v) => setRow(list.key, idx, "done", v)}
              />
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-primary underline-offset-4 hover:underline"
            onClick={() => setRows(list.key, [...getRows(list.key), { item: "", done: false }])}
          >
            Add a row
          </button>
        </section>
      ))}

      <section className="space-y-4">
        <SectionHeading
          number={5}
          title="Craving imagery"
          subtitle="A vivid image of your new life to call up when a craving hits."
        />
        <TextAreaField
          label="My new-life image"
          value={data.cravingImagery ?? ""}
          onChange={(v) => update("cravingImagery", v)}
          placeholder="What does the abstinent life look and feel like? Make it sensory."
          rows={4}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={6}
          title="Urge strategies used"
          subtitle="Tick what you actually did when urges hit this week."
        />
        {URGE_STRATEGIES.map((s) => (
          <CheckRow
            key={s.key}
            id={`urge-${s.key}`}
            label={s.label}
            checked={!!strategies[s.key]}
            onToggle={(v) => setStrategy(s.key, v)}
          />
        ))}
      </section>
    </div>
  );
}
