"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DateField, ScaleField, TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { CheckRow } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Distress Tolerance Worksheet 13 — skills when the crisis is addiction.
const SKILLS = [
  { key: "dialecticalAbstinence", label: "Dialectical abstinence — total stop plus a harm-reduction plan for slips" },
  { key: "clearMind", label: "Clear mind — noticed addict mind and stepped back to clear mind" },
  { key: "communityReinforcement", label: "Community reinforcement — spent time where not using gets rewarded" },
  { key: "burningBridges", label: "Burning bridges — removed a route back to the old behaviour" },
  { key: "alternateRebellion", label: "Alternate rebellion — broke a rule without breaking myself" },
  { key: "adaptiveDenial", label: "Adaptive denial — refused to rehearse the urge" },
  { key: "tipp", label: "TIPP — changed body chemistry fast" },
  { key: "improve", label: "IMPROVE the moment" },
  { key: "prosCons", label: "Pros and cons of acting on the urge" },
  { key: "reachOut", label: "Reached out to someone before acting" },
];

export function AddictionCrisisForm({ entry, onChange }: Props) {
  const data = entry.data;
  const used: Record<string, boolean> = data.used ?? {};
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The urge"
          subtitle="Describe the urge before you decide anything about it."
        />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="What the urge was"
          value={data.urge ?? ""}
          onChange={(v) => update("urge", v)}
          placeholder="Substance or behaviour, and the situation that set it off."
          rows={2}
        />
        <ScaleField
          label="How strong was it at its worst?"
          value={data.intensity ?? 0}
          onChange={(v) => update("intensity", v)}
          help="0 = barely there, 5 = I could not think about anything else"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="What I used" subtitle="Tick everything you actually did — including the things that only half worked." />
        <div className="grid gap-2 sm:grid-cols-2">
          {SKILLS.map((s) => (
            <CheckRow
              key={s.key}
              id={`add-${s.key}`}
              label={s.label}
              checked={!!used[s.key]}
              onToggle={(v) => update("used", { ...used, [s.key]: v })}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="What happened" />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What I did in the end
          </Label>
          <Textarea
            value={data.outcome ?? ""}
            onChange={(e) => update("outcome", e.target.value)}
            placeholder="No scoring yourself here — just the facts."
            rows={2}
            className="resize-y"
          />
        </div>
        <TextAreaField
          label="What made the difference"
          value={data.whatWorked ?? ""}
          onChange={(v) => update("whatWorked", v)}
          placeholder="The one thing that actually moved the urge."
          rows={2}
        />
        <TextAreaField
          label="The bridge I need to burn before next time"
          value={data.nextBridge ?? ""}
          onChange={(v) => update("nextBridge", v)}
          placeholder="Something concrete: delete the number, change the route, tell someone."
          rows={2}
        />
        <TextAreaField
          label="Who I told"
          value={data.whoTold ?? ""}
          onChange={(v) => update("whoTold", v)}
          placeholder="Secrecy is the fuel. Who knows about this one?"
          rows={2}
        />
      </section>
    </div>
  );
}
