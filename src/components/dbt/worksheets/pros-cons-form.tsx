"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { cn } from "@/lib/utils";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function ProsConsForm({ entry, onChange }: Props) {
  const data = entry.data;

  const update = (key: string, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">The urge</h2>
          <p className="text-xs text-muted-foreground mt-1">
            What is the crisis urge you're considering acting on? Be specific.
          </p>
        </div>
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="The urge I'm considering acting on"
          value={data.urgeDescription ?? ""}
          onChange={(v) => update("urgeDescription", v)}
          placeholder="e.g., The urge to text my ex, the urge to drink, the urge to self-harm, the urge to send an angry email..."
          rows={3}
        />
      </section>

      {/* Four-quadrant grid */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Four-quadrant analysis</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Weigh each side. The point is the structured weighing — especially of long-term
            consequences, which often change the decision.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {/* Acting - Pros */}
          <QuadrantCard
            tone="danger"
            heading="ACTING on the urge — Pros"
            subtitle="What do you get from doing it?"
            shortValue={data.actingProsShort ?? ""}
            longValue={data.actingProsLong ?? ""}
            onShortChange={(v) => update("actingProsShort", v)}
            onLongChange={(v) => update("actingProsLong", v)}
          />
          {/* Acting - Cons */}
          <QuadrantCard
            tone="danger"
            heading="ACTING on the urge — Cons"
            subtitle="What does it cost you?"
            shortValue={data.actingConsShort ?? ""}
            longValue={data.actingConsLong ?? ""}
            onShortChange={(v) => update("actingConsShort", v)}
            onLongChange={(v) => update("actingConsLong", v)}
          />
          {/* Not acting - Pros */}
          <QuadrantCard
            tone="good"
            heading="RESISTING the urge — Pros"
            subtitle="What do you gain by NOT acting?"
            shortValue={data.notActingProsShort ?? ""}
            longValue={data.notActingProsLong ?? ""}
            onShortChange={(v) => update("notActingProsShort", v)}
            onLongChange={(v) => update("notActingProsLong", v)}
          />
          {/* Not acting - Cons */}
          <QuadrantCard
            tone="warning"
            heading="RESISTING the urge — Cons"
            subtitle="What does it cost you to resist?"
            shortValue={data.notActingConsShort ?? ""}
            longValue={data.notActingConsLong ?? ""}
            onShortChange={(v) => update("notActingConsShort", v)}
            onLongChange={(v) => update("notActingConsLong", v)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">My decision</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Based on the full picture — not the loudest short-term relief — what will you do?
          </p>
        </div>
        <TextAreaField
          label="My decision"
          value={data.decision ?? ""}
          onChange={(v) => update("decision", v)}
          placeholder="State your decision clearly. Will you act on the urge or resist it? Why?"
          rows={3}
        />
        <TextAreaField
          label="Skill(s) I will use"
          value={data.skillToUse ?? ""}
          onChange={(v) => update("skillToUse", v)}
          placeholder="Which DBT skill(s) will you use to follow through on this decision? (e.g., TIPP, ACCEPTS, opposite action, radical acceptance)"
          rows={3}
        />
      </section>
    </div>
  );
}

function QuadrantCard({
  tone,
  heading,
  subtitle,
  shortValue,
  longValue,
  onShortChange,
  onLongChange,
}: {
  tone: "danger" | "warning" | "good";
  heading: string;
  subtitle: string;
  shortValue: string;
  longValue: string;
  onShortChange: (v: string) => void;
  onLongChange: (v: string) => void;
}) {
  const toneClasses = {
    danger: "border-l-rose-500 bg-rose-500/5",
    warning: "border-l-amber-500 bg-amber-500/5",
    good: "border-l-emerald-500 bg-emerald-500/5",
  }[tone];

  return (
    <div className={cn("rounded-md border border-l-4 p-4 space-y-3", toneClasses)}>
      <div>
        <h3 className="text-sm font-semibold">{heading}</h3>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Short-term (now / next few hours)
        </label>
        <textarea
          value={shortValue}
          onChange={(e) => onShortChange(e.target.value)}
          placeholder="Immediate effects..."
          rows={2}
          className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Long-term (days, weeks, months)
        </label>
        <textarea
          value={longValue}
          onChange={(e) => onLongChange(e.target.value)}
          placeholder="Longer-term effects..."
          rows={3}
          className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
