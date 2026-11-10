"use client";

// Top-bar text size control. Presentational — the page owns the value so the
// same number drives the content zoom and the label.

import * as React from "react";
import { Button } from "@/components/ui/button";
import { readerScalePercent, nextReaderScale } from "@/lib/reader-scale";

interface Props {
  value: number;
  onChange: (next: number) => void;
}

export function ReaderScaleControl({ value, onChange }: Props) {
  const pct = readerScalePercent(value);
  const isDefault = value === 1;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onChange(nextReaderScale(value))}
      className="h-8 px-2"
      title={`Text size ${pct}% — click to cycle 100% / 112% / 125%`}
      aria-label={`Text size ${pct} percent. Click to change.`}
    >
      <span className={isDefault ? "font-semibold" : "font-bold text-primary"}>Aa</span>
      <span className="text-[10px] text-muted-foreground ml-1 hidden sm:inline">{pct}%</span>
    </Button>
  );
}
