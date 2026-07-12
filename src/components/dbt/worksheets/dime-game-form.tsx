"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextAreaField, DateField, TextField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

interface Factor {
  key: string;
  question: string;
  // "harder" means YES → ask harder. "softer" means YES → ask softer.
  yesEffect: "harder" | "softer";
  hint: string;
}

// For "ask" mode
const ASK_FACTORS: Factor[] = [
  { key: "capability", question: "Is the person capable of giving me what I want?", yesEffect: "harder", hint: "If they can't give it to you, asking harder won't help" },
  { key: "right", question: "Is it my right to ask for this?", yesEffect: "harder", hint: "Do you have a legitimate claim or authority?" },
  { key: "timing", question: "Is now a good time to ask?", yesEffect: "harder", hint: "Bad timing → ask more softly or wait" },
  { key: "priority", question: "Is what I want important to me?", yesEffect: "harder", hint: "Low priority → don't push hard" },
  { key: "giveToGet", question: "Am I willing to give something to get something?", yesEffect: "harder", hint: "Willing to negotiate → can push harder" },
  { key: "relationship", question: "Is what I want appropriate to this relationship?", yesEffect: "harder", hint: "If it's too much to ask of this relationship, back off" },
  { key: "clarity", question: "Am I clear and specific about what I want?", yesEffect: "harder", hint: "Vague requests get vague responses" },
  { key: "selfRespect", question: "Is asking important for my self-respect?", yesEffect: "harder", hint: "If staying silent would betray your values, push harder" },
  { key: "reciprocity", question: "Has this person given to me in the past?", yesEffect: "harder", hint: "If they've been generous, you can ask more" },
  { key: "authority", question: "Does this person have authority over me?", yesEffect: "softer", hint: "If they have power over you (boss, parent), ask more softly" },
];

// For "sayno" mode — same factors, slightly different framing
const SAYNO_FACTORS: Factor[] = [
  { key: "capability", question: "Is the person capable of accepting my 'no'?", yesEffect: "harder", hint: "If they can't handle no, you may need to be firmer" },
  { key: "right", question: "Do I have the right to say no?", yesEffect: "harder", hint: "It's almost always your right to say no" },
  { key: "timing", question: "Is now a good time to say no?", yesEffect: "harder", hint: "Bad timing → say no more softly or later" },
  { key: "priority", question: "Is saying no important to me?", yesEffect: "harder", hint: "Low priority → consider accommodating" },
  { key: "giveToGet", question: "Am I willing to offer an alternative?", yesEffect: "harder", hint: "Offering a compromise → can be firmer" },
  { key: "relationship", question: "Is saying no appropriate to this relationship?", yesEffect: "harder", hint: "Consider the relationship context" },
  { key: "clarity", question: "Am I clear and specific about my no?", yesEffect: "harder", hint: "Clear boundaries are firmer" },
  { key: "selfRespect", question: "Is saying no important for my self-respect?", yesEffect: "harder", hint: "If saying yes would betray your values, say no firmly" },
  { key: "reciprocity", question: "Has this person respected my no in the past?", yesEffect: "harder", hint: "If they've pushed before, be firmer" },
  { key: "authority", question: "Does this person have authority over me?", yesEffect: "softer", hint: "If they have power over you, consider the consequences" },
];

function getScore(factors: Record<string, string>, factorDefs: Factor[]): number {
  let score = 0;
  for (const factor of factorDefs) {
    const answer = factors[factor.key];
    if (answer === "yes") {
      score += factor.yesEffect === "harder" ? 1 : -1;
    } else if (answer === "no") {
      score += factor.yesEffect === "harder" ? -1 : 1;
    }
    // "maybe" or "" = 0
  }
  return score;
}

function getIntensityLabel(score: number, mode: "ask" | "sayno"): { label: string; color: string; description: string } {
  const action = mode === "ask" ? "Ask" : "Say no";
  if (score <= -7) {
    return {
      label: "Don't ask / Let it go",
      color: "text-slate-500",
      description: "The factors are strongly against you. Consider not asking at all, or letting it go for now.",
    };
  }
  if (score <= -3) {
    return {
      label: `${action} lightly`,
      color: "text-blue-500",
      description: `The factors are against you. ${action} softly, or consider waiting for a better time.`,
    };
  }
  if (score <= 2) {
    return {
      label: `${action} with some hesitation`,
      color: "text-amber-500",
      description: `The factors are mixed. ${action}, but be prepared to negotiate or back off.`,
    };
  }
  if (score <= 6) {
    return {
      label: `${action} firmly`,
      color: "text-orange-500",
      description: `The factors are in your favor. ${action} clearly and firmly.`,
    };
  }
  return {
    label: `${action} as firmly as you can`,
    color: "text-rose-500",
    description: `The factors are strongly in your favor. ${action} as firmly as you can — this matters.`,
  };
}

export function DimeGameForm({ entry, onChange }: Props) {
  const data = entry.data;
  const mode: "ask" | "sayno" = data.mode === "sayno" ? "sayno" : "ask";
  const factors: Record<string, string> = data.factors ?? {};
  const factorDefs = mode === "ask" ? ASK_FACTORS : SAYNO_FACTORS;
  const score = getScore(factors, factorDefs);
  const intensity = getIntensityLabel(score, mode);

  const update = (key: string, value: any) => onChange({ ...data, [key]: value });
  const setFactor = (key: string, value: string) => {
    update("factors", { ...factors, [key]: value });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="The situation" subtitle="What do you want to ask for, or say no to?" />
        <DateField label="Date" value={data.entryDate ?? ""} onChange={(v) => update("entryDate", v)} />
        <TextAreaField
          label="What I want to ask for (or say no to)"
          value={data.situation ?? ""}
          onChange={(v) => update("situation", v)}
          placeholder="e.g., I want to ask my boss for a raise, or I want to say no to my friend's request to borrow money"
          rows={2}
        />
        {/* Mode toggle */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Am I asking or saying no?
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === "ask" ? "default" : "outline"}
              size="sm"
              onClick={() => update("mode", "ask")}
              className="flex-1"
            >
              Asking for something
            </Button>
            <Button
              type="button"
              variant={mode === "sayno" ? "default" : "outline"}
              size="sm"
              onClick={() => update("mode", "sayno")}
              className="flex-1"
            >
              Saying no to something
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="The 10 questions"
          subtitle="Answer each question. Your score updates live as you answer."
        />
        <div className="space-y-3">
          {factorDefs.map((factor, idx) => {
            const value = factors[factor.key] ?? "";
            return (
              <div
                key={factor.key}
                className={cn(
                  "rounded-md border p-3 transition-colors",
                  value === "yes" && "border-emerald-500/50 bg-emerald-500/5",
                  value === "no" && "border-rose-500/50 bg-rose-500/5",
                  value === "maybe" && "border-amber-500/50 bg-amber-500/5",
                  !value && "border-border"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{factor.question}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{factor.hint}</p>
                    <div className="flex gap-1.5 mt-2">
                      <Button
                        type="button"
                        variant={value === "yes" ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setFactor(factor.key, "yes")}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={value === "no" ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setFactor(factor.key, "no")}
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant={value === "maybe" ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setFactor(factor.key, "maybe")}
                      >
                        Maybe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live score */}
      <section className="space-y-4">
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Your score
            </h3>
            <span className="text-3xl font-bold tabular-nums">
              {score > 0 ? "+" : ""}{score}
            </span>
          </div>
          <div className={cn("text-lg font-bold", intensity.color)}>
            {intensity.label}
          </div>
          <p className="text-sm text-muted-foreground">{intensity.description}</p>
          {/* Score bar */}
          <div className="relative h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="absolute top-0 bottom-0 left-1/2 w-px bg-border"
              aria-hidden
            />
            <div
              className={cn(
                "absolute top-0 bottom-0 transition-all",
                score >= 0
                  ? "left-1/2 bg-gradient-to-r from-amber-500 to-rose-500"
                  : " right-1/2 bg-gradient-to-l from-blue-500 to-slate-500"
              )}
              style={{
                width: `${Math.min(Math.abs(score) / 10, 1) * 50}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Don't ask</span>
            <span>Ask lightly</span>
            <span>Hesitant</span>
            <span>Ask firmly</span>
            <span>Ask as hard as you can</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading number={3} title="Notes" subtitle="Any other considerations?" />
        <TextAreaField
          label="Notes"
          value={data.notes ?? ""}
          onChange={(v) => update("notes", v)}
          placeholder="Anything else to consider? What will you actually do?"
          rows={3}
        />
      </section>
    </div>
  );
}
