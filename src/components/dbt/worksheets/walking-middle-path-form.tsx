"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function WalkingMiddlePathForm({ entry, onChange }: Props) {
  const data = entry.data;

  const update = (key: string, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="The situation"
          subtitle="What's the conflict or tension you're working with? Could be internal (two parts of yourself) or external (you and another person)."
        />
        <DateField
          label="Date"
          value={data.entryDate ?? ""}
          onChange={(v) => update("entryDate", v)}
        />
        <TextAreaField
          label="Describe the situation"
          value={data.situation ?? ""}
          onChange={(v) => update("situation", v)}
          placeholder="e.g., My parent wants me to visit every weekend, but I need time for myself and my own life."
          rows={3}
        />
      </section>

      {/* Two opposing positions */}
      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="The two opposing positions"
          subtitle="Name each side clearly. Don't soften — articulate each position at its strongest."
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-md border border-l-4 border-l-violet-500 bg-violet-500/5 p-4 space-y-3">
            <div>
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                Position A
              </Label>
              <Textarea
                value={data.positionA ?? ""}
                onChange={(e) => update("positionA", e.target.value)}
                placeholder="State one side of the conflict clearly..."
                rows={3}
                className="resize-y mt-1 bg-background"
              />
            </div>
            <div>
              <Label className="text-[11px] font-medium text-muted-foreground">
                What's true about Position A?
              </Label>
              <Textarea
                value={data.trueInA ?? ""}
                onChange={(e) => update("trueInA", e.target.value)}
                placeholder="Even if you disagree with Position A overall, what's valid in it? What does it get right?"
                rows={3}
                className="resize-y mt-1 bg-background"
              />
            </div>
          </div>

          <div className="rounded-md border border-l-4 border-l-amber-500 bg-amber-500/5 p-4 space-y-3">
            <div>
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Position B
              </Label>
              <Textarea
                value={data.positionB ?? ""}
                onChange={(e) => update("positionB", e.target.value)}
                placeholder="State the opposite side of the conflict clearly..."
                rows={3}
                className="resize-y mt-1 bg-background"
              />
            </div>
            <div>
              <Label className="text-[11px] font-medium text-muted-foreground">
                What's true about Position B?
              </Label>
              <Textarea
                value={data.trueInB ?? ""}
                onChange={(e) => update("trueInB", e.target.value)}
                placeholder="Even if you disagree with Position B overall, what's valid in it? What does it get right?"
                rows={3}
                className="resize-y mt-1 bg-background"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Old synthesis attempt (if any)"
          subtitle="Have you tried to resolve this before? What did you try? Why didn't it work?"
        />
        <TextAreaField
          label="Previous attempts at resolving this"
          value={data.oldSynthesisAttempt ?? ""}
          onChange={(v) => update("oldSynthesisAttempt", v)}
          placeholder="e.g., I tried compromising by visiting every other weekend, but I felt resentful..."
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={4}
          title="The synthesis"
          subtitle="What's true when you hold BOTH positions at once? The synthesis is not a compromise (splitting the difference). It's a new statement that integrates what's true in each side."
        />
        <div className="rounded-md border border-l-4 border-l-emerald-500 bg-emerald-500/5 p-4 space-y-3">
          <div>
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              My synthesis statement
            </Label>
            <Textarea
              value={data.synthesis ?? ""}
              onChange={(e) => update("synthesis", e.target.value)}
              placeholder="The synthesis. Both positions are true AND a new option emerges that honors both. Use 'and' instead of 'but'..."
              rows={4}
              className="resize-y mt-1 bg-background"
            />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Tip: Replace "but" with "and." Example: NOT "I love my parent BUT I need my space" —
          instead, "I love my parent AND I need my space, so I will visit on terms that
          honor both my relationship with them and my own life."
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={5}
          title="How I'll act on the synthesis"
          subtitle="A synthesis that doesn't change behavior is just words. What concrete action follows from holding both truths?"
        />
        <TextAreaField
          label="Concrete actions"
          value={data.howIWillAct ?? ""}
          onChange={(v) => update("howIWillAct", v)}
          placeholder="What will you actually DO differently? Be specific and concrete."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={6}
          title="Practice: noticing when you collapse back"
          subtitle="Dialectics is a practice, not a one-time realization. You'll keep sliding back into one-sided thinking. Tracking those slips IS the practice."
        />
        <TextAreaField
          label="When did I notice myself collapsing back into one side?"
          value={data.practiceNotes ?? ""}
          onChange={(v) => update("practiceNotes", v)}
          placeholder="e.g., On Tuesday I caught myself thinking 'they don't respect me at all' — collapsed into Position B. I turned the mind back to the synthesis."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={7}
          title="Awareness practice: opposites that can both be true"
          subtitle="Train your dialectical mind. List examples of opposites that can both be true at the same time. The more you practice, the more natural it becomes."
        />
        <TextAreaField
          label="Examples of opposites that can both be true"
          value={data.oppositesBothTrue ?? ""}
          onChange={(v) => update("oppositesBothTrue", v)}
          placeholder={"Examples:\n• I am doing my best AND I need to do better\n• I am strong AND I am vulnerable\n• This is hard AND I can handle it\n• I love them AND I'm angry at them\n• I want connection AND I want solitude"}
          rows={5}
        />
      </section>
    </div>
  );
}
