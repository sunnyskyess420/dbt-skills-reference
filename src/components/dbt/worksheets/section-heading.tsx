"use client";

import * as React from "react";

export function SectionHeading({
  number,
  title,
  subtitle,
  children,
}: {
  number?: number;
  /** Title passed as a prop. If omitted, the title falls back to `children`. */
  title?: string;
  subtitle?: string;
  /** Some worksheets pass the heading text as children — render it as the
   *  title so the text isn't silently dropped. */
  children?: React.ReactNode;
}) {
  const heading = title ?? children;
  return (
    <div>
      <div className="flex items-center gap-2">
        {number !== undefined && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {number}
          </span>
        )}
        {heading !== undefined && heading !== null && heading !== "" && (
          <h2 className="text-base font-semibold">{heading}</h2>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1 ml-8">{subtitle}</p>}
    </div>
  );
}
