"use client";

export function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number?: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {number !== undefined && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {number}
          </span>
        )}
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1 ml-8">{subtitle}</p>}
    </div>
  );
}
