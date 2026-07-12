"use client";

import * as React from "react";
import type { WorksheetEntry } from "@/lib/worksheet-storage";
import { TextField, ScaleField } from "./form-primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DiaryCardForm({ entry, onChange }: Props) {
  const data = entry.data;
  const days: any[] = data.days ?? [];

  const updateDay = (idx: number, field: string, value: any) => {
    const nextDays = [...days];
    nextDays[idx] = { ...nextDays[idx], [field]: value };
    onChange({ ...data, days: nextDays });
  };

  const updateMeta = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Meta */}
      <section className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Week starting
            </Label>
            <Input
              type="date"
              value={data.weekStartDate ?? ""}
              onChange={(e) => updateMeta("weekStartDate", e.target.value)}
              className="max-w-[200px]"
            />
          </div>
          <TextField
            label="Custom target behavior (optional)"
            value={data.customTarget ?? ""}
            onChange={(v) => updateMeta("customTarget", v)}
            placeholder="e.g., Binge eating, restricting, social media use, etc."
          />
        </div>
      </section>

      {/* 7-day tabs */}
      <section>
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid grid-cols-7 w-full h-auto">
            {DAY_LABELS.map((label, idx) => {
              const day = days[idx];
              const hasData = day && (day.date || day.notes);
              return (
                <TabsTrigger
                  key={idx}
                  value={String(idx)}
                  className={cn(
                    "text-xs sm:text-sm py-2 px-1 sm:px-2 flex-col gap-0.5",
                    hasData && "data-[state=inactive]:text-foreground"
                  )}
                >
                  <span>{label}</span>
                  {day?.date && (
                    <span className="text-[9px] text-muted-foreground">
                      {new Date(day.date + "T00:00:00").toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {days.map((day, idx) => (
            <TabsContent key={idx} value={String(idx)} className="mt-4">
              <DayForm
                day={day}
                dayLabel={DAY_LABELS[idx]}
                customTarget={data.customTarget}
                onUpdate={(field, value) => updateDay(idx, field, value)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <div className="text-[11px] text-muted-foreground border-t pt-3">
        <p>
          Scale: 0 = none / no urge / no action &nbsp;→&nbsp; 5 = extreme / strongest urge /
          severe action. Bring this card to your individual therapy session.
        </p>
      </div>
    </div>
  );
}

function DayForm({
  day,
  dayLabel,
  customTarget,
  onUpdate,
}: {
  day: any;
  dayLabel: string;
  customTarget: string;
  onUpdate: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {dayLabel}
        </h3>
        <Input
          type="date"
          value={day?.date ?? ""}
          onChange={(e) => onUpdate("date", e.target.value)}
          className="max-w-[180px] h-8 text-xs"
        />
      </div>

      {/* Urges */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Urges (0–5)
        </h4>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
          <ScaleField
            label="Urge to self-harm"
            value={day?.urgeSelfHarm ?? 0}
            onChange={(v) => onUpdate("urgeSelfHarm", v)}
          />
          <ScaleField
            label="Urge to die by suicide"
            value={day?.urgeSuicide ?? 0}
            onChange={(v) => onUpdate("urgeSuicide", v)}
          />
          <ScaleField
            label="Urge to use substances"
            value={day?.urgeSubstances ?? 0}
            onChange={(v) => onUpdate("urgeSubstances", v)}
          />
          <ScaleField
            label="Urge to quit therapy"
            value={day?.urgeQuitTherapy ?? 0}
            onChange={(v) => onUpdate("urgeQuitTherapy", v)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Actions (0–5)
        </h4>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
          <ScaleField
            label="Self-harm"
            value={day?.actSelfHarm ?? 0}
            onChange={(v) => onUpdate("actSelfHarm", v)}
          />
          <ScaleField
            label="Substance use"
            value={day?.actSubstances ?? 0}
            onChange={(v) => onUpdate("actSubstances", v)}
          />
          <ScaleField
            label={customTarget ? customTarget : "Other target behavior"}
            value={day?.actOther ?? 0}
            onChange={(v) => onUpdate("actOther", v)}
          />
          {!customTarget && (
            <Input
              value={day?.actOtherLabel ?? ""}
              onChange={(e) => onUpdate("actOtherLabel", e.target.value)}
              placeholder="Label the 'other' target..."
              className="h-8 text-xs"
            />
          )}
        </div>
      </div>

      {/* Emotions */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Emotions (0–5)
        </h4>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
          <ScaleField label="Anger" value={day?.emoAnger ?? 0} onChange={(v) => onUpdate("emoAnger", v)} />
          <ScaleField label="Sadness" value={day?.emoSadness ?? 0} onChange={(v) => onUpdate("emoSadness", v)} />
          <ScaleField label="Fear" value={day?.emoFear ?? 0} onChange={(v) => onUpdate("emoFear", v)} />
          <ScaleField label="Shame" value={day?.emoShame ?? 0} onChange={(v) => onUpdate("emoShame", v)} />
          <ScaleField label="Joy" value={day?.emoJoy ?? 0} onChange={(v) => onUpdate("emoJoy", v)} />
        </div>
      </div>

      {/* Skills used */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Skills used today
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { key: "skillMindfulness", label: "Mindfulness" },
            { key: "skillDistressTolerance", label: "Distress Tolerance" },
            { key: "skillEmotionRegulation", label: "Emotion Regulation" },
            { key: "skillInterpersonal", label: "Interpersonal" },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center space-x-2">
              <Checkbox
                id={`${dayLabel}-${opt.key}`}
                checked={!!day?.[opt.key]}
                onCheckedChange={(c) => onUpdate(opt.key, c === true)}
              />
              <Label
                htmlFor={`${dayLabel}-${opt.key}`}
                className="text-xs font-normal cursor-pointer"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Notes
        </Label>
        <Textarea
          value={day?.notes ?? ""}
          onChange={(e) => onUpdate("notes", e.target.value)}
          placeholder="What happened today? What skills did you use specifically? Anything to bring up in therapy?"
          rows={3}
          className="resize-y"
        />
      </div>
    </div>
  );
}
