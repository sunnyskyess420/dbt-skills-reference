"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

const LEVELS = [
  { num: 1, title: "Be present", key: "level1", desc: "Actually listen. Give yourself your full attention." },
  { num: 2, title: "Accurate reflection", key: "level2", desc: "Summarize what you're feeling back to yourself, accurately." },
  { num: 3, title: "Articulate the unsaid", key: "level3", desc: "Name what you may be feeling but haven't said. 'I'm feeling X because...'" },
  { num: 4, title: "Validate based on history", key: "level4", desc: "Given your history, this feeling makes sense because..." },
  { num: 5, title: "Validate in context", key: "level5", desc: "Anyone in this situation would feel this way because..." },
  { num: 6, title: "Treat yourself as equal", key: "level6", desc: "You're not broken for feeling this. You're a person with valid feelings, just like anyone else." },
];

export function SelfValidationForm({ entry, onChange }: Props) {
  const data = entry.data;
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation and feeling" subtitle="What feeling are you being harsh with yourself about?" />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextField label="Situation" value={data.situation ?? ""} onChange={(v) => update("situation", v)} placeholder="What happened?" />
        <TextAreaField label="The feeling" value={data.feeling ?? ""} onChange={(v) => update("feeling", v)} placeholder="What are you feeling? What are you telling yourself about having this feeling?" rows={3} />
      </section>

      <section className="space-y-4">
        <SectionHeading number={2} title="The 6 levels of self-validation" subtitle="Work through each level. You don't have to do all 6 — even one helps." />
        {LEVELS.map((level) => (
          <div key={level.num} className="rounded-md border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{level.num}</span>
              <h3 className="text-sm font-semibold">{level.title}</h3>
            </div>
            <p className="text-[11px] text-muted-foreground ml-8">{level.desc}</p>
            <div className="ml-8">
              <TextAreaField label="" value={data[level.key] ?? ""} onChange={(v) => update(level.key, v)} placeholder="Your self-validation at this level..." rows={2} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Reflection" subtitle="What changed after practicing self-validation?" />
        <TextAreaField label="Reflection" value={data.reflection ?? ""} onChange={(v) => update("reflection", v)} placeholder="Did the feeling shift? Did the harshness soften? What did you notice?" rows={3} />
      </section>
    </div>
  );
}
