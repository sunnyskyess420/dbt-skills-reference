"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

// Field wrapper
export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-y"
      />
    </Field>
  );
}

export function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[200px]"
      />
    </Field>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Field>
  );
}

export function CheckboxGroup({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: { key: string; label: string }[];
  values: Record<string, boolean>;
  onToggle: (key: string, checked: boolean) => void;
}) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((opt) => (
          <div key={opt.key} className="flex items-center space-x-2">
            <Checkbox
              id={opt.key}
              checked={!!values[opt.key]}
              onCheckedChange={(c) => onToggle(opt.key, c === true)}
            />
            <Label htmlFor={opt.key} className="text-sm font-normal cursor-pointer">
              {opt.label}
            </Label>
          </div>
        ))}
      </div>
    </Field>
  );
}

// 0-5 slider with label
export function ScaleField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  help?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">{label}</Label>
        <span className="text-xs font-mono font-semibold tabular-nums w-6 text-right">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={0}
        max={5}
        step={1}
        className="py-1"
      />
      {help && <p className="text-[10px] text-muted-foreground">{help}</p>}
    </div>
  );
}

// Repeating list section (for chain links etc.)
export function RepeatList({
  label,
  items,
  onAdd,
  onRemove,
  onRemoveAll,
  renderItem,
  minItems = 1,
  addLabel = "Add row",
}: {
  label: string;
  items: any[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onRemoveAll?: () => void;
  renderItem: (item: any, idx: number) => React.ReactNode;
  minItems?: number;
  addLabel?: string;
}) {
  return (
    <Field label={label}>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-md border bg-card p-3 pr-9"
          >
            {items.length > minItems && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(idx)}
                aria-label="Remove row"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Link {String(idx + 1).padStart(2, "0")}
            </div>
            {renderItem(item, idx)}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {addLabel}
          </Button>
          {onRemoveAll && items.length > minItems && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemoveAll}
              className="text-muted-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>
    </Field>
  );
}
