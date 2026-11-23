"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Shared weekly grid. Several book worksheets (Emotion Regulation W9, Distress
// Tolerance W8, Mindfulness W2c) are the same shape: one page per day, ticked
// skills and a line of reflection. Keeping the tab bar, date picker and day
// heading here means those forms only have to describe their own checkboxes.

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export interface DayEntry {
  date?: string;
  [key: string]: any;
}

export function blankWeek(): DayEntry[] {
  return DAY_LABELS.map(() => ({ date: "" }));
}

export function WeekTabs({
  entries,
  onUpdate,
  children,
}: {
  entries: DayEntry[];
  onUpdate: (idx: number, field: string, value: any) => void;
  children: (
    day: DayEntry,
    update: (field: string, value: any) => void,
    label: string
  ) => React.ReactNode;
}) {
  const days = entries && entries.length ? entries : blankWeek();

  return (
    <Tabs defaultValue="0" className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-7">
        {DAY_LABELS.map((label, idx) => {
          const day = days[idx];
          return (
            <TabsTrigger
              key={label}
              value={String(idx)}
              className={cn(
                "flex-col gap-0.5 px-1 py-2 text-xs sm:px-2 sm:text-sm",
                day?.date && "data-[state=inactive]:text-foreground"
              )}
            >
              <span>{label}</span>
              {day?.date && (
                <span className="text-[9px] text-muted-foreground">
                  {new Date(day.date + "T00:00:00").toLocaleDateString(undefined, {
                    month: "numeric",
                    day: "numeric",
                  })}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {DAY_LABELS.map((label, idx) => (
        <TabsContent key={label} value={String(idx)} className="mt-4">
          <DayHeader
            label={label}
            date={days[idx]?.date ?? ""}
            onChange={(v) => onUpdate(idx, "date", v)}
          />
          {children(days[idx] ?? { date: "" }, (field, value) => onUpdate(idx, field, value), label)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function DayHeader({
  label,
  date,
  onChange,
}: {
  label: string;
  date: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{label}</h3>
      <Input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 max-w-[180px] text-xs"
      />
    </div>
  );
}

/** A labelled checkbox that keeps its own stable id. */
export function CheckRow({
  id,
  label,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(c) => onToggle(c === true)} className="mt-0.5" />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal leading-snug">
        {label}
      </Label>
    </div>
  );
}
