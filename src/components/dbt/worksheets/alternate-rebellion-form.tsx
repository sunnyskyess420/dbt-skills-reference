"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScaleField, TextAreaField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Distress Tolerance Worksheet 18 — when the urge hits, rebel against it
// adaptively: do something else instead, and use adaptive denial to shrink
// what the urge demands of you.
const PLAN_SLOTS = 3;

function DenialBlock({
  title,
  used,
  onUsed,
  children,
}: {
  title: string;
  used: boolean;
  onUsed: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex items-start gap-2">
        <Checkbox
          id={`denial-${title}`}
          checked={used}
          onCheckedChange={(c) => onUsed(c === true)}
          className="mt-0.5"
        />
        <Label htmlFor={`denial-${title}`} className="cursor-pointer text-sm font-normal leading-snug">
          {title}
        </Label>
      </div>
      {children}
    </div>
  );
}

export function AlternateRebellionForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: any) => onChange({ ...data, [key]: value });

  const plans: string[] = data.rebellionPlans ?? [];
  const actual: string[] = data.actualDid ?? [];
  const setPlan = (idx: number, v: string) => {
    const next = Array.from({ length: PLAN_SLOTS }, (_, i) => plans[i] ?? "");
    next[idx] = v;
    update("rebellionPlans", next);
  };
  const setActual = (idx: number, v: string) => {
    const next = Array.from({ length: PLAN_SLOTS }, (_, i) => actual[i] ?? "");
    next[idx] = v;
    update("actualDid", next);
  };

  const denial: Record<string, any> = data.adaptiveDenial ?? {};
  const setDenial = (key: string, patch: Record<string, any>) =>
    update("adaptiveDenial", { ...denial, [key]: { ...(denial[key] ?? {}), ...patch } });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Alternate rebellion"
          subtitle="Plan it, then do it — rebellion means doing something else entirely when the urge hits."
        />
        <TextField
          label="Week starting"
          value={data.weekStartDate ?? ""}
          onChange={(v) => update("weekStartDate", v)}
          placeholder="YYYY-MM-DD"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Planned alternatives
            </Label>
            {Array.from({ length: PLAN_SLOTS }, (_, i) => (
              <Input
                key={i}
                value={plans[i] ?? ""}
                onChange={(e) => setPlan(i, e.target.value)}
                placeholder={`Plan ${i + 1} — what I'll do instead`}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What I actually did
            </Label>
            {Array.from({ length: PLAN_SLOTS }, (_, i) => (
              <Input
                key={i}
                value={actual[i] ?? ""}
                onChange={(e) => setActual(i, e.target.value)}
                placeholder={`Actual ${i + 1} — what happened instead`}
              />
            ))}
          </div>
        </div>
        <ScaleField
          label="How effective was alternate rebellion at surviving the urge?"
          value={data.rebellionEffectiveness ?? 0}
          onChange={(v) => update("rebellionEffectiveness", v)}
          help="0 = not effective, 5 = very effective"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="Adaptive denial"
          subtitle="Shrink what the urge demands: you don't have to refuse forever, just for this hour."
        />

        <DenialBlock
          title="Reframed the urge as an urge for something else"
          used={!!denial.reframing?.used}
          onUsed={(v) => setDenial("reframing", { used: v })}
        >
          <TextAreaField
            label="What I reframed it as"
            value={denial.reframing?.description ?? ""}
            onChange={(v) => setDenial("reframing", { description: v })}
            rows={2}
          />
          <ScaleField
            label="Effectiveness"
            value={denial.reframing?.effectiveness ?? 0}
            onChange={(v) => setDenial("reframing", { effectiveness: v })}
          />
        </DenialBlock>

        <DenialBlock
          title="Put off the addictive behavior"
          used={!!denial.puttingOff?.used}
          onUsed={(v) => setDenial("puttingOff", { used: v })}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <TextField
              label="For how many minutes"
              value={denial.puttingOff?.minutes ?? ""}
              onChange={(v) => setDenial("puttingOff", { minutes: v })}
            />
            <TextField
              label="How many times"
              value={denial.puttingOff?.times ?? ""}
              onChange={(v) => setDenial("puttingOff", { times: v })}
            />
          </div>
          <ScaleField
            label="Effectiveness"
            value={denial.puttingOff?.effectiveness ?? 0}
            onChange={(v) => setDenial("puttingOff", { effectiveness: v })}
          />
        </DenialBlock>

        <DenialBlock
          title="Reminded myself I only had to be abstinent for a short stretch"
          used={!!denial.shortStretch?.used}
          onUsed={(v) => setDenial("shortStretch", { used: v })}
        >
          <TextField
            label="The stretch I committed to"
            value={denial.shortStretch?.unit ?? ""}
            onChange={(v) => setDenial("shortStretch", { unit: v })}
            placeholder="e.g. 'an hour', 'today', 'until Friday'"
          />
          <ScaleField
            label="Effectiveness"
            value={denial.shortStretch?.effectiveness ?? 0}
            onChange={(v) => setDenial("shortStretch", { effectiveness: v })}
          />
        </DenialBlock>
      </section>
    </div>
  );
}
