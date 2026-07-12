"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextField, ScaleField, Field } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function PleasantEventsDiaryForm({ entry, onChange }: Props) {
  const data = entry.data;
  const entries: any[] = data.entries ?? [];
  const updateMeta = (key: string, value: string) => onChange({ ...data, [key]: value });
  const updateEntry = (idx: number, field: string, value: any) => {
    const next = [...entries];
    next[idx] = { ...next[idx], [field]: value };
    onChange({ ...data, entries: next });
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <SectionHeading number={1} title="Week" subtitle="Set the week you're tracking." />
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Week starting</Label>
          <Input type="date" value={data.weekStartDate ?? ""} onChange={(e) => updateMeta("weekStartDate", e.target.value)} className="max-w-[200px]" />
        </div>
      </section>

      <section>
        <SectionHeading number={2} title="Daily pleasant events" subtitle="Each day, do one pleasant activity. Rate your emotion before and after (0-5)." />
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid grid-cols-7 w-full h-auto">
            {DAY_LABELS.map((label, idx) => {
              const e = entries[idx];
              const hasData = e && (e.date || e.activity);
              return (
                <TabsTrigger key={idx} value={String(idx)} className={cn("text-xs sm:text-sm py-2 px-1 sm:px-2 flex-col gap-0.5", hasData && "data-[state=inactive]:text-foreground")}>
                  <span>{label}</span>
                  {e?.date && <span className="text-[9px] text-muted-foreground">{new Date(e.date + "T00:00:00").toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}</span>}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {entries.map((entry, idx) => (
            <TabsContent key={idx} value={String(idx)} className="mt-4">
              <DayForm day={entry} dayLabel={DAY_LABELS[idx]} onUpdate={(field, value) => updateEntry(idx, field, value)} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <div className="text-[11px] text-muted-foreground border-t pt-3">
        <p>Scale: 0 = no positive emotion → 5 = extreme joy/pleasure. The goal is to notice the effect of pleasant activities on your mood.</p>
      </div>
    </div>
  );
}

function DayForm({ day, dayLabel, onUpdate }: { day: any; dayLabel: string; onUpdate: (field: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{dayLabel}</h3>
        <Input type="date" value={day?.date ?? ""} onChange={(e) => onUpdate("date", e.target.value)} className="max-w-[180px] h-8 text-xs" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pleasant activity</Label>
        <Textarea value={day?.activity ?? ""} onChange={(e) => onUpdate("activity", e.target.value)} placeholder="What pleasant activity did you do? (e.g., walked in the park, called a friend, listened to music)" rows={2} className="resize-y" />
      </div>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
        <ScaleField label="Emotion before (0-5)" value={day?.emotionBefore ?? 0} onChange={(v) => onUpdate("emotionBefore", v)} />
        <ScaleField label="Emotion after (0-5)" value={day?.emotionAfter ?? 0} onChange={(v) => onUpdate("emotionAfter", v)} />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id={`${dayLabel}-present`} checked={!!day?.present} onCheckedChange={(c) => onUpdate("present", c === true)} />
        <Label htmlFor={`${dayLabel}-present`} className="text-xs font-normal cursor-pointer">I was fully present during this activity (mindful, not multitasking)</Label>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</Label>
        <Textarea value={day?.notes ?? ""} onChange={(e) => onUpdate("notes", e.target.value)} placeholder="How did it feel? Did the activity affect your mood for the rest of the day?" rows={2} className="resize-y" />
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
