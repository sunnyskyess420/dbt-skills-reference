"use client";

// Cheat sheet — one dense page you can keep open beside the app (or print and
// keep beside you). Every row is a trimmed pointer into the skill library, so
// tapping a block opens the full entry: steps, examples, pitfalls, book page.

import * as React from "react";
import { SKILLS } from "@/data/skills";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Printer, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildCheatSheet,
  WISE_MIND_GLOSSES,
  type CheatBlock,
  type CheatSection,
} from "@/lib/cheat-sheet";

interface Props {
  /** Open the full skill entry behind a block. */
  onViewSkill: (skillId: string) => void;
}

export function CheatSheet({ onViewSkill }: Props) {
  const [showOneLiners, setShowOneLiners] = React.useState(false);
  const sections = React.useMemo(() => buildCheatSheet(), []);

  return (
    <div className="h-full overflow-y-auto">
      {/* Sticky bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider truncate">
              DBT Cheat Sheet
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <Switch
                id="cheat-one-liners"
                checked={showOneLiners}
                onCheckedChange={setShowOneLiners}
                className="scale-90"
              />
              <Label
                htmlFor="cheat-one-liners"
                className="text-[11px] text-muted-foreground cursor-pointer hidden sm:inline"
              >
                One-liners
              </Label>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.print()}
              aria-label="Print cheat sheet"
            >
              <Printer className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Print</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <div className="hidden print:block mb-4 pb-2 border-b">
          <h1 className="text-lg font-bold">DBT Cheat Sheet</h1>
          <p className="text-[11px] text-muted-foreground">
            Distilled from this app&apos;s {SKILLS.length} skills · printed{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="print:hidden mb-4">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            DBT Cheat Sheet
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            The whole toolkit on one page — keep it open during group, or print it. Tap any block
            to open the full skill.
          </p>
        </div>

        <div className="columns-1 lg:columns-2 xl:columns-3 gap-3 [column-fill:balance]">
          {/* Wise Mind figure */}
          <Card className="mb-3 break-inside-avoid">
            <SectionHeading title="Wise Mind" subtitle="The state you're aiming for" />
            <WiseMindDiagram />
            <ul className="mt-2 space-y-1">
              {WISE_MIND_GLOSSES.map((g) => (
                <li key={g.key} className="flex items-baseline gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                  <span className="text-[11px] leading-snug">
                    <span className="font-semibold">{g.label}</span>
                    <span className="text-muted-foreground"> — {g.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onViewSkill("wise-mind")}
              className="mt-2 inline-flex items-center gap-0.5 text-[10px] font-medium text-primary hover:underline print:hidden"
            >
              Open Wise Mind
              <ChevronRight className="h-3 w-3" />
            </button>
          </Card>

          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              showOneLiners={showOneLiners}
              onViewSkill={onViewSkill}
            />
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed border-t pt-3 mt-4">
          A compressed index, not a replacement for the full entries — each block opens the
          complete skill with steps, examples, pitfalls and its Linehan (2014) page reference.
          Everything here is derived from this app&apos;s own paraphrased content.
        </p>
      </div>
    </div>
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={cn(
        "rounded-lg border bg-card p-3 print:border-neutral-300 print:bg-white",
        className
      )}
    >
      {children}
    </section>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-1.5">
      <h2 className="text-[11px] font-bold uppercase tracking-wider">{title}</h2>
      {subtitle && (
        <p className="text-[10px] text-muted-foreground leading-tight">{subtitle}</p>
      )}
    </div>
  );
}

function SectionCard({
  section,
  showOneLiners,
  onViewSkill,
}: {
  section: CheatSection;
  showOneLiners: boolean;
  onViewSkill: (skillId: string) => void;
}) {
  return (
    <Card className="mb-3 break-inside-avoid">
      <SectionHeading title={section.title} subtitle={section.subtitle} />
      <div className="space-y-2.5">
        {section.blocks.map((block) => (
          <Block
            key={block.skillId}
            block={block}
            showOneLiners={showOneLiners}
            onViewSkill={onViewSkill}
          />
        ))}
      </div>
    </Card>
  );
}

function Block({
  block,
  showOneLiners,
  onViewSkill,
}: {
  block: CheatBlock;
  showOneLiners: boolean;
  onViewSkill: (skillId: string) => void;
}) {
  if (block.kind === "one") {
    return (
      <div>
        <button
          onClick={() => onViewSkill(block.skillId)}
          className="text-left text-[11px] font-semibold leading-tight hover:underline print:no-underline"
        >
          {block.name}
          {block.pages ? (
            <span className="ml-1 font-normal text-[9px] text-muted-foreground">{block.pages}</span>
          ) : null}
        </button>
        <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">
          {block.oneLiner}
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => onViewSkill(block.skillId)}
        className="flex items-baseline gap-1 text-left hover:underline print:no-underline"
      >
        <span className="text-[11px] font-semibold leading-tight">{block.name}</span>
        {block.acronym && block.acronym !== block.name && (
          <span className="text-[9px] uppercase tracking-wide text-muted-foreground">
            {block.acronym}
          </span>
        )}
        {block.pages && (
          <span className="text-[9px] font-normal text-muted-foreground">{block.pages}</span>
        )}
      </button>

      {showOneLiners && (
        <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">
          {block.oneLiner}
        </p>
      )}

      <ul className="mt-1 space-y-[3px]">
        {block.rows.map((row, i) => (
          <li key={`${block.skillId}-${i}`} className="flex gap-1.5">
            <span
              className={cn(
                "shrink-0 text-[10px] font-bold leading-[1.35]",
                row.label ? "text-primary w-auto min-w-[9px]" : "hidden"
              )}
            >
              {row.label}
            </span>
            <span className="text-[11px] leading-[1.35] text-foreground/90 line-clamp-2">
              {row.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Two overlapping circles with Wise Mind in the lens. */
function WiseMindDiagram() {
  return (
    <svg
      viewBox="0 0 240 120"
      className="w-full h-auto max-h-[112px] text-foreground"
      role="img"
      aria-label="Reasonable mind and emotion mind overlapping, with wise mind in the overlap"
    >
      <circle cx="92" cy="60" r="52" className="fill-primary/10 stroke-primary/40" strokeWidth="1" />
      <circle cx="148" cy="60" r="52" className="fill-primary/10 stroke-primary/40" strokeWidth="1" />
      <text x="60" y="44" textAnchor="middle" className="fill-current" fontSize="9" fontWeight="600">
        Reasonable
      </text>
      <text x="180" y="44" textAnchor="middle" className="fill-current" fontSize="9" fontWeight="600">
        Emotion
      </text>
      <text x="120" y="64" textAnchor="middle" className="fill-current" fontSize="9" fontWeight="700">
        Wise
      </text>
      <text x="120" y="76" textAnchor="middle" className="fill-current opacity-70" fontSize="7">
        mind
      </text>
    </svg>
  );
}
