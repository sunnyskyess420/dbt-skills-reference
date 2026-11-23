"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextAreaField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { WeekTabs } from "./week-grid";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

// Mindfulness Worksheets 8 and 9 — the pleasant and unpleasant events
// calendars. They differ only in which events you're asked to notice, so one
// form with a switch covers both instead of two identical pages.
export function MindfulnessEventsForm({ entry, onChange }: Props) {
  const data = entry.data;
  const entries: any[] = data.entries ?? [];
  const kind = data.kind ?? "pleasant";
  const isPleasant = kind === "pleasant";
  const updateMeta = (key: string, value: string) => onChange({ ...data, [key]: value });
  const updateEntry = (idx: number, field: string, value: any) => {
    const next = [...entries];
    next[idx] = { ...next[idx], [field]: value };
    onChange({ ...data, entries: next });
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <SectionHeading
          number={1}
          title="Week"
          subtitle="The point isn't to have a good week. It's to catch events as they happen instead of reconstructing them later."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Which calendar
            </Label>
            <Select value={kind} onValueChange={(v) => updateMeta("kind", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pleasant">Pleasant events</SelectItem>
                <SelectItem value="unpleasant">Unpleasant events</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Week starting
            </Label>
            <Input
              type="date"
              value={data.weekStartDate ?? ""}
              onChange={(e) => updateMeta("weekStartDate", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          number={2}
          title={isPleasant ? "One pleasant event a day" : "One unpleasant event a day"}
          subtitle={
            isPleasant
              ? "Notice it while it's happening — the senses, not the summary."
              : "Stay with what happened before you explain it away."
          }
        />
        <WeekTabs entries={entries} onUpdate={updateEntry}>
          {(day, update) => (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  The event
                </Label>
                <Textarea
                  value={day.event ?? ""}
                  onChange={(e) => update("event", e.target.value)}
                  placeholder={isPleasant ? "Coffee in the sun, a text from a friend…" : "A cancelled plan, a sharp email…"}
                  rows={2}
                  className="resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What I noticed with my senses
                </Label>
                <Textarea
                  value={day.senses ?? ""}
                  onChange={(e) => update("senses", e.target.value)}
                  placeholder="Sight, sound, smell, taste, touch — before any story about it."
                  rows={2}
                  className="resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What my body did
                </Label>
                <Textarea
                  value={day.body ?? ""}
                  onChange={(e) => update("body", e.target.value)}
                  placeholder="Where did I feel it, and how did my posture or breathing change?"
                  rows={2}
                  className="resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  What my mind did
                </Label>
                <Textarea
                  value={day.mind ?? ""}
                  onChange={(e) => update("mind", e.target.value)}
                  placeholder={isPleasant ? "Did I let myself have it, or start bracing for it to end?" : "Judging, rehearsing, arguing with it?"}
                  rows={2}
                  className="resize-y"
                />
              </div>
            </div>
          )}
        </WeekTabs>
      </section>

      <section className="space-y-4 border-t pt-6">
        <SectionHeading number={3} title="End of week" />
        <TextAreaField
          label={isPleasant ? "What I'd have missed without the calendar" : "What I stopped fighting by noticing it"}
          value={data.reflection ?? ""}
          onChange={(v) => updateMeta("reflection", v)}
          placeholder="Two or three lines."
          rows={3}
        />
      </section>
    </div>
  );
}
