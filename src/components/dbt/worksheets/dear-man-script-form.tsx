"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function DearManScriptForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="What conversation do you need to have? With whom? What do you want from it?" />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextField label="Relationship (who)" value={data.relationship ?? ""} onChange={(v) => update("relationship", v)} placeholder="e.g., My partner, my boss, my parent" />
        <TextField label="My objective (what I want)" value={data.objective ?? ""} onChange={(v) => update("objective", v)} placeholder="e.g., Ask for more help with childcare" />
        <TextField label="Priority (objective / relationship / self-respect)" value={data.priority ?? ""} onChange={(v) => update("priority", v)} placeholder="Which matters most in this conversation?" />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="DEAR MAN script" subtitle="Write out each step of your script before the conversation." />
        <TextAreaField label="D — Describe (just the facts)" value={data.describe ?? ""} onChange={(v) => update("describe", v)} placeholder="e.g., You said you'd be home by 6, and you came home at 9." rows={2} />
        <TextAreaField label="E — Express (your feeling)" value={data.express ?? ""} onChange={(v) => update("express", v)} placeholder="e.g., I felt worried and frustrated when that happened." rows={2} />
        <TextAreaField label="A — Assert (ask clearly)" value={data.assert ?? ""} onChange={(v) => update("assert", v)} placeholder="e.g., I'd like you to text me if you're going to be late." rows={2} />
        <TextAreaField label="R — Reinforce (positive outcome)" value={data.reinforce ?? ""} onChange={(v) => update("reinforce", v)} placeholder="e.g., That would help me not worry, and I'd feel respected." rows={2} />
        <TextAreaField label="M — stay Mindful (don't get derailed)" value={data.mindfulPlan ?? ""} onChange={(v) => update("mindfulPlan", v)} placeholder="If they change the subject or attack, what's your plan to stay on target?" rows={2} />
        <TextAreaField label="A — Appear confident (body language)" value={data.appearConfident ?? ""} onChange={(v) => update("appearConfident", v)} placeholder="Eye contact, tone, posture — how will you show confidence?" rows={2} />
        <TextAreaField label="N — Negotiate (be willing to give)" value={data.negotiate ?? ""} onChange={(v) => update("negotiate", v)} placeholder="What are you willing to compromise on?" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Relationship & self-respect" subtitle="Also consider GIVE (keep the relationship) and FAST (keep your self-respect)." />
        <TextAreaField label="GIVE — How will you keep the relationship?" value={data.givePlan ?? ""} onChange={(v) => update("givePlan", v)} placeholder="Gentle, Interested, Validate, Easy manner" rows={2} />
        <TextAreaField label="FAST — How will you keep self-respect?" value={data.fastPlan ?? ""} onChange={(v) => update("fastPlan", v)} placeholder="Fair, no Apologies, Stick to values, Truthful" rows={2} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={4} title="Rehearsal" subtitle="Anticipate their response and plan yours." />
        <TextAreaField label="What response do you anticipate?" value={data.anticipatedResponse ?? ""} onChange={(v) => update("anticipatedResponse", v)} placeholder="How might they react?" rows={2} />
        <TextAreaField label="Your response to resistance" value={data.myResponseToResistance ?? ""} onChange={(v) => update("myResponseToResistance", v)} placeholder="If they push back, what will you say?" rows={2} />
      </section>
    </div>
  );
}
