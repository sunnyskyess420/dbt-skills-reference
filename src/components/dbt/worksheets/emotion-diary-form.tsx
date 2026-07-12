"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextField, ScaleField } from "./form-primitives";
import { SectionHeading } from "./section-heading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function EmotionDiaryForm({ entry, onChange }: Props) {
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
        <SectionHeading number={1} title="Target emotion" subtitle="Pick ONE emotion to track this week (e.g., anger, shame, fear, sadness)." />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Week starting</Label>
            <Input type="date" value={data.weekStartDate ?? ""} onChange={(e) => updateMeta("weekStartDate", e.target.value)} className="max-w-[200px]" />
          </div>
          <TextField label="Target emotion" value={data.targetEmotion ?? ""} onChange={(v) => updateMeta("targetEmotion", v)} placeholder="e.g., Anger" />
        </div>
      </section>

      <section>
        <SectionHeading number={2} title="Daily tracking" subtitle="Track instances of this emotion each day." />
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid grid-cols-7 w-full h-auto">
            {DAY_LABELS.map((label, idx) => {
              const e = entries[idx];
              const hasData = e && (e.date || e.trigger);
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
              <DayForm day={entry} dayLabel={DAY_LABELS[idx]} targetEmotion={data.targetEmotion} onUpdate={(field, value) => updateEntry(idx, field, value)} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <div className="text-[11px] text-muted-foreground border-t pt-3">
        <p>Intensity: 0 = none → 5 = extreme. The goal is to notice patterns in triggers and what helps.</p>
      </div>
    </div>
  );
}

function DayForm({ day, dayLabel, targetEmotion, onUpdate }: { day: any; dayLabel: string; targetEmotion: string; onUpdate: (field: string, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{dayLabel}</h3>
        <Input type="date" value={day?.date ?? ""} onChange={(e) => onUpdate("date", e.target.value)} className="max-w-[180px] h-8 text-xs" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trigger</Label>
        <Textarea value={day?.trigger ?? ""} onChange={(e) => onUpdate("trigger", e.target.value)} placeholder={`What triggered ${targetEmotion || "this emotion"} today?`} rows={2} className="resize-y" />
      </div>
      <ScaleField label={`${targetEmotion || "Emotion"} intensity (0-5)`} value={day?.intensity ?? 0} onChange={(v) => onUpdate("intensity", v)} />
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">My interpretation</Label>
        <Textarea value={day?.interpretation ?? ""} onChange={(e) => onUpdate("interpretation", e.target.value)} placeholder="What were you thinking? What did you tell yourself about the trigger?" rows={2} className="resize-y" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What I did</Label>
        <Textarea value={day?.whatIDid ?? ""} onChange={(e) => onUpdate("whatIDid", e.target.value)} placeholder="How did you respond? What action did you take?" rows={2} className="resize-y" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What worked</Label>
        <Textarea value={day?.whatWorked ?? ""} onChange={(e) => onUpdate("whatWorked", e.target.value)} placeholder="Did anything help reduce the emotion? What was it?" rows={2} className="resize-y" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</Label>
        <Textarea value={day?.notes ?? ""} onChange={(e) => onUpdate("notes", e.target.value)} placeholder="Anything else?" rows={2} className="resize-y" />
      </div>
    </div>
  );
}
