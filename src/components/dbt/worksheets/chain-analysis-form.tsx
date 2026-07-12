"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import {
  TextAreaField,
  DateField,
  TextField,
  CheckboxGroup,
  RepeatList,
  Field,
} from "./form-primitives";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "./section-heading";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

const VULNERABILITY_OPTIONS = [
  { key: "tired", label: "Tired" },
  { key: "hungry", label: "Hungry" },
  { key: "sick", label: "Sick" },
  { key: "pain", label: "In pain" },
  { key: "substances", label: "Alcohol/drugs" },
  { key: "stressfulEnv", label: "Stressful environment" },
  { key: "recentLoss", label: "Recent loss" },
  { key: "conflict", label: "Interpersonal conflict" },
  { key: "poorSleep", label: "Poor sleep" },
  { key: "other", label: "Other" },
];

export function ChainAnalysisForm({ entry, onChange }: Props) {
  const data = entry.data;

  const update = (path: string, value: any) => {
    const next = { ...data };
    if (path.includes(".")) {
      const [k1, k2] = path.split(".");
      next[k1] = { ...next[k1], [k2]: value };
    } else {
      next[path] = value;
    }
    onChange(next);
  };

  const updateChainLink = (idx: number, field: string, value: string) => {
    const links = [...(data.chainLinks ?? [])];
    links[idx] = { ...links[idx], [field]: value };
    onChange({ ...data, chainLinks: links });
  };

  const addLink = () => {
    const links = [...(data.chainLinks ?? [])];
    links.push({ situation: "", thought: "", feeling: "", body: "", action: "" });
    onChange({ ...data, chainLinks: links });
  };

  const removeLink = (idx: number) => {
    const links = [...(data.chainLinks ?? [])];
    links.splice(idx, 1);
    onChange({ ...data, chainLinks: links });
  };

  const clearAllLinks = () => {
    onChange({ ...data, chainLinks: [{ situation: "", thought: "", feeling: "", body: "", action: "" }] });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading number={1} title="Header" />
        <div className="grid sm:grid-cols-2 gap-4">
          <DateField
            label="Date of behavior"
            value={data.behaviorDate ?? ""}
            onChange={(v) => update("behaviorDate", v)}
          />
          <TextField
            label="Worksheet title (optional)"
            value={entry.title}
            onChange={() => { /* title edited via header */ }}
            hint="Edit the title at the top of the page."
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={2}
          title="The problem behavior"
          subtitle="Be specific. What exactly did you do? When? Where? How?"
        />
        <TextAreaField
          label="Specific problem behavior"
          value={data.problemBehavior ?? ""}
          onChange={(v) => update("problemBehavior", v)}
          placeholder="e.g., Self-harmed by cutting my arm with a razor blade"
          rows={2}
        />
        <TextAreaField
          label="What, when, where, how"
          value={data.whatWhenWhere ?? ""}
          onChange={(v) => update("whatWhenWhere", v)}
          placeholder="Describe in factual detail. What did you do, when did it happen, where were you, how did you do it?"
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={3}
          title="Prompting event"
          subtitle="What started the chain? The first link — the event that began the sequence."
        />
        <TextAreaField
          label="Prompting event"
          value={data.promptingEvent ?? ""}
          onChange={(v) => update("promptingEvent", v)}
          placeholder="What happened right before the chain started? Be specific and factual."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={4}
          title="Vulnerability factors"
          subtitle="What made you more vulnerable in this moment? Check all that apply."
        />
        <CheckboxGroup
          label="Vulnerabilities"
          options={VULNERABILITY_OPTIONS}
          values={data.vulnerabilities ?? {}}
          onToggle={(k, c) => update(`vulnerabilities.${k}`, c)}
        />
        {data.vulnerabilities?.other && (
          <TextField
            label="Other (describe)"
            value={data.vulnerabilities?.otherText ?? ""}
            onChange={(v) => update("vulnerabilities.otherText", v)}
            placeholder="Describe the other vulnerability"
          />
        )}
        <TextAreaField
          label="Additional notes on vulnerabilities"
          value={data.vulnerabilityNotes ?? ""}
          onChange={(v) => update("vulnerabilityNotes", v)}
          placeholder="Anything else that made you more vulnerable? Recent stressors, environmental factors, physical state..."
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={5}
          title="The chain of events"
          subtitle="Trace each link in order. What were you thinking, feeling, sensing in your body, and doing at each step?"
        />
        <RepeatList
          label="Links in the chain"
          items={data.chainLinks ?? []}
          onAdd={addLink}
          onRemove={removeLink}
          onRemoveAll={clearAllLinks}
          addLabel="Add another link"
          renderItem={(item: any, idx: number) => (
            <div className="space-y-3">
              <div>
                <Label className="text-[11px] font-medium text-muted-foreground">
                  Situation / what happened
                </Label>
                <Textarea
                  value={item.situation ?? ""}
                  onChange={(e) => updateChainLink(idx, "situation", e.target.value)}
                  placeholder="What happened in the external world at this point?"
                  rows={2}
                  className="resize-y mt-1"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-medium text-muted-foreground">
                    Thought
                  </Label>
                  <Textarea
                    value={item.thought ?? ""}
                    onChange={(e) => updateChainLink(idx, "thought", e.target.value)}
                    placeholder="What were you thinking?"
                    rows={2}
                    className="resize-y mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-medium text-muted-foreground">
                    Feeling
                  </Label>
                  <Textarea
                    value={item.feeling ?? ""}
                    onChange={(e) => updateChainLink(idx, "feeling", e.target.value)}
                    placeholder="What emotion(s) arose?"
                    rows={2}
                    className="resize-y mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-medium text-muted-foreground">
                    Body sensation
                  </Label>
                  <Textarea
                    value={item.body ?? ""}
                    onChange={(e) => updateChainLink(idx, "body", e.target.value)}
                    placeholder="What did you feel in your body?"
                    rows={2}
                    className="resize-y mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-medium text-muted-foreground">
                    Action
                  </Label>
                  <Textarea
                    value={item.action ?? ""}
                    onChange={(e) => updateChainLink(idx, "action", e.target.value)}
                    placeholder="What did you do?"
                    rows={2}
                    className="resize-y mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={6}
          title="The behavior itself"
          subtitle="Describe the specific problem behavior you're analyzing. What did you actually do?"
        />
        <TextAreaField
          label="Behavior description"
          value={data.behaviorDescription ?? ""}
          onChange={(v) => update("behaviorDescription", v)}
          placeholder="Describe the behavior in factual detail — what you did, how, for how long."
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={7}
          title="Consequences"
          subtitle="What happened as a result of the behavior? Both immediately and longer-term."
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <TextAreaField
            label="Immediate consequences"
            value={data.consequencesImmediate ?? ""}
            onChange={(v) => update("consequencesImmediate", v)}
            placeholder="What happened right after? How did you feel? How did others react?"
            rows={3}
          />
          <TextAreaField
            label="Longer-term consequences"
            value={data.consequencesLongTerm ?? ""}
            onChange={(v) => update("consequencesLongTerm", v)}
            placeholder="What happened later? Hours, days, weeks after? Effects on relationships, self-respect, goals?"
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          number={8}
          title="Skills analysis"
          subtitle="Where could a different DBT skill have changed the chain? What will you use next time?"
        />
        <TextAreaField
          label="Links where a different skill could have been used"
          value={data.skillsCouldHaveUsed ?? ""}
          onChange={(v) => update("skillsCouldHaveUsed", v)}
          placeholder="Look back at the chain. At which link(s) could you have used a DBT skill? Which skill? Be specific."
          rows={4}
        />
        <TextAreaField
          label="Skills I will use next time"
          value={data.skillsNextTime ?? ""}
          onChange={(v) => update("skillsNextTime", v)}
          placeholder="Make a concrete plan. What skill? At which link? What cue will remind you to use it?"
          rows={3}
        />
      </section>
    </div>
  );
}

