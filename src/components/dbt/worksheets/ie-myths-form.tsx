"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Textarea } from "@/components/ui/textarea";
import { DateField, TextAreaField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Interpersonal Effectiveness Worksheet 2 — the book lists 24 effectiveness
// myths. Paraphrased here (the book's wording is copyrighted); each gets a
// challenge line, plus three slots for myths of your own.
const MYTHS: string[] = [
  "I don't deserve to get what I want or need.",
  "If I make a request, it shows I'm a weak person.",
  "I have to know they'll say yes before I ask.",
  "If I ask for something or say no, I can't stand it if they get upset.",
  "If they say no, it will kill me.",
  "Making requests is a pushy, selfish thing to do.",
  "Saying no to a request is always selfish.",
  "I should be willing to sacrifice my own needs for others.",
  "I must be really inadequate if I can't fix this myself.",
  "The problem is just in my head — if I thought differently I wouldn't bother anyone.",
  "If I don't have what I want, it doesn't matter; I don't really care.",
  "Skillfulness is a sign of weakness.",
  "They should know what I want without my asking — and just do it.",
  "They should have known their behavior would hurt me; I shouldn't have to say it.",
  "I shouldn't have to negotiate or work at getting what I want.",
  "Other people should be more willing to meet my needs.",
  "Other people should like, approve of, and support me.",
  "They don't deserve my being skillful or treating them well.",
  "Getting what I want when I want it matters most.",
  "I shouldn't have to be fair or respectful if others aren't toward me.",
  "Revenge will feel so good it'll be worth the consequences.",
  "Only wimps have values.",
  "Everybody lies.",
  "Getting what I want matters more than how I get it — the ends justify the means.",
];

const CUSTOM_SLOTS = 3;

export function IeMythsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const challenges: Record<string, string> = data.challenges ?? {};
  const custom: { myth: string; challenge: string }[] = data.customMyths ?? [];

  const update = (key: string, value: any) => onChange({ ...data, [key]: value });
  const setChallenge = (key: string, value: string) =>
    update("challenges", { ...challenges, [key]: value });
  const setCustom = (idx: number, field: string, value: string) => {
    const next = Array.from({ length: CUSTOM_SLOTS }, (_, i) => custom[i] ?? { myth: "", challenge: "" });
    next[idx] = { ...next[idx], [field]: value };
    update("customMyths", next);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The myths"
          subtitle="Each of these is a belief that gets in the way of getting your objectives. For every one that rings true, write the challenge that makes sense to you — not the 'right' answer."
        />
        <DateField label="Week starting" value={data.weekStartDate ?? ""} onChange={(v) => update("weekStartDate", v)} />
      </section>

      <section className="space-y-3">
        <SectionHeading number={2} title="Challenge each myth" />
        {MYTHS.map((myth, idx) => {
          const key = `m${idx + 1}`;
          return (
            <div key={key} className="space-y-1.5 rounded-md border p-3">
              <p className="text-sm">
                <span className="mr-2 font-mono text-xs text-muted-foreground">{idx + 1}.</span>
                {myth}
              </p>
              <Textarea
                value={challenges[key] ?? ""}
                onChange={(e) => setChallenge(key, e.target.value)}
                placeholder="My challenge to this myth…"
                rows={2}
                className="resize-y"
              />
            </div>
          );
        })}
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="My own myths"
          subtitle="Beliefs about asking, saying no, or being treated fairly that aren't on the list."
        />
        {Array.from({ length: CUSTOM_SLOTS }, (_, idx) => (
          <div key={idx} className="space-y-2 rounded-md border p-3">
            <TextField
              label={`Myth ${idx + 1}`}
              value={custom[idx]?.myth ?? ""}
              onChange={(v) => setCustom(idx, "myth", v)}
              placeholder="The belief, in your words"
            />
            <TextAreaField
              label="Challenge"
              value={custom[idx]?.challenge ?? ""}
              onChange={(v) => setCustom(idx, "challenge", v)}
              placeholder="Why it isn't the whole story — and what to tell yourself instead"
              rows={2}
            />
          </div>
        ))}
        <TextAreaField
          label="Notes"
          value={data.notes ?? ""}
          onChange={(v) => update("notes", v)}
          placeholder="Which myth showed up most this week?"
          rows={2}
        />
      </section>
    </div>
  );
}
