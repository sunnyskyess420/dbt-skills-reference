"use client";

import * as React from "react";
import { type Skill, MODULES, SKILLS } from "@/data/skills";
import { getWorksheetForSkill, getWorksheetTypeMeta, type WorksheetType } from "@/lib/worksheet-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, ArrowLeft, BookOpen, Lightbulb, Footprints, CircleHelp, Quote, Clock, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Reader-mode text scale steps (1x → 1.12x → 1.25x → back). Persisted so
// the chosen size survives reloads — handy mid-session on a small screen.
const READER_SCALE_KEY = "dbt-skills:reader-scale";
const READER_SCALES: number[] = [1, 1.12, 1.25];

interface SkillDetailProps {
  skill: Skill | null;
  onBack?: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (skillId: string) => void;
  onSelectSkill: (skill: Skill) => void;
  onCreateWorksheet?: (type: WorksheetType) => void;
  /** True when the user already has a worksheet of this skill's linked type. */
  linkedWorksheetExists?: boolean;
  /** Force-create a blank worksheet of the linked type. */
  onStartBlankWorksheet?: (type: WorksheetType) => void;
}

export function SkillDetail({
  skill,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onSelectSkill,
  onCreateWorksheet,
  linkedWorksheetExists = false,
  onStartBlankWorksheet,
}: SkillDetailProps) {
  // Reader mode: persisted text scale, cycled with the "Aa" button.
  const [readerScale, setReaderScale] = React.useState(1);
  // Collapsible skill sections — resets to defaults when the skill changes.
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(READER_SCALE_KEY);
      if (raw) {
        const n = Number(raw);
        if (READER_SCALES.includes(n)) setReaderScale(n);
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    setOpenSections({});
  }, [skill?.id]);

  const cycleReaderScale = React.useCallback(() => {
    setReaderScale((prev) => {
      const idx = READER_SCALES.indexOf(prev);
      const next = READER_SCALES[(idx + 1) % READER_SCALES.length];
      try {
        localStorage.setItem(READER_SCALE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const toggleSection = React.useCallback((key: string, def: boolean) => {
    setOpenSections((prev) => ({ ...prev, [key]: !(prev[key] ?? def) }));
  }, []);

  const isSectionOpen = React.useCallback(
    (key: string, def: boolean) => openSections[key] ?? def,
    [openSections]
  );

  if (!skill) return null;

  const moduleInfo = MODULES.find((m) => m.id === skill.module)!;
  const linkedWsType = onCreateWorksheet ? getWorksheetForSkill(skill.id) : undefined;
  const linkedWsMeta = linkedWsType ? getWorksheetTypeMeta(linkedWsType) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="lg:hidden shrink-0"
                aria-label="Back to list"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <span className={cn("text-xs font-semibold uppercase tracking-wider", moduleInfo.color)}>
              {moduleInfo.short}
            </span>
            <span className="text-muted-foreground text-xs">/</span>
            <span className="text-xs text-muted-foreground truncate">{skill.category}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleReaderScale}
              className="px-2"
              title={`Text size ${Math.round(readerScale * 100)}% — click to change`}
              aria-label={`Text size ${Math.round(readerScale * 100)} percent. Click to change`}
            >
              <span className="font-semibold">Aa</span>
              <span className="text-[10px] text-muted-foreground ml-1 hidden sm:inline">
                {Math.round(readerScale * 100)}%
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleBookmark(skill.id)}
              className="shrink-0"
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="ml-1 hidden sm:inline">Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto" style={{ zoom: readerScale }}>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {skill.name}
          </h1>
          {skill.acronym && (
            <Badge variant="outline" className={cn("mt-2 font-mono", moduleInfo.color)}>
              {skill.acronym}
            </Badge>
          )}
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {skill.oneLiner}
          </p>

          <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              <span className="font-medium">Book reference:</span> {skill.reference}
              {skill.pages && (
                <>
                  {" · "}
                  <span className="font-mono">{skill.pages}</span>
                </>
              )}
            </span>
          </div>

          {linkedWsMeta && onCreateWorksheet && (
            <div className="mt-4">
              <Button
                onClick={() => onCreateWorksheet(linkedWsType!)}
                className="w-full sm:w-auto"
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                {linkedWorksheetExists
                  ? "Open your worksheet"
                  : "Practice with Worksheet"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">
                {linkedWorksheetExists ? (
                  <>
                    Opens your most recent{" "}
                    <span className="font-medium">{linkedWsMeta.shortName}</span> worksheet
                    {onStartBlankWorksheet && (
                      <>
                        {" — or "}
                        <button
                          onClick={() => onStartBlankWorksheet(linkedWsType!)}
                          className="underline hover:text-foreground"
                        >
                          start a blank copy
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Opens a <span className="font-medium">{linkedWsMeta.shortName}</span> worksheet to practice this skill
                  </>
                )}
              </p>
            </div>
          )}

          {/* Description */}
          <CollapsibleSection
            title="What it is"
            defaultOpen
            open={isSectionOpen("what", true)}
            onToggle={() => toggleSection("what", true)}
          >
            <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
              {skill.description}
            </p>
          </CollapsibleSection>

          {/* When to use */}
          {skill.whenToUse && skill.whenToUse.length > 0 && (
            <CollapsibleSection
              title="When to use it"
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              defaultOpen
              open={isSectionOpen("when", true)}
              onToggle={() => toggleSection("when", true)}
            >
              <ul className="space-y-2">
                {skill.whenToUse.map((item, i) => (
                  <li key={i} className="text-sm sm:text-base leading-relaxed flex gap-2">
                    <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Steps */}
          {skill.steps && skill.steps.length > 0 && (
            <CollapsibleSection
              title="How to do it"
              icon={<Footprints className="h-4 w-4 text-muted-foreground" />}
              defaultOpen
              open={isSectionOpen("steps", true)}
              onToggle={() => toggleSection("steps", true)}
            >
              <ol className="space-y-2">
                {skill.steps.map((step, i) => (
                  <li
                    key={i}
                    className="text-sm sm:text-base leading-relaxed flex gap-3 bg-muted/30 rounded-md p-3"
                  >
                    <span className="font-mono font-semibold text-xs shrink-0 mt-0.5 w-6 text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </CollapsibleSection>
          )}

          {/* Examples */}
          {skill.examples && skill.examples.length > 0 && (
            <CollapsibleSection
              title="Examples"
              icon={<Quote className="h-4 w-4 text-muted-foreground" />}
              open={isSectionOpen("examples", false)}
              onToggle={() => toggleSection("examples", false)}
            >
              <div className="space-y-2">
                {skill.examples.map((ex, i) => (
                  <blockquote
                    key={i}
                    className="text-sm sm:text-base leading-relaxed border-l-2 pl-4 italic text-foreground/80"
                  >
                    {ex}
                  </blockquote>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Tips */}
          {skill.tips && skill.tips.length > 0 && (
            <CollapsibleSection
              title="Tips & common pitfalls"
              icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
              open={isSectionOpen("tips", false)}
              onToggle={() => toggleSection("tips", false)}
            >
              <ul className="space-y-2">
                {skill.tips.map((tip, i) => (
                  <li key={i} className="text-sm sm:text-base leading-relaxed flex gap-2">
                    <CircleHelp className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Tags */}
          <section className="mt-8 pt-6 border-t">
            <div className="flex flex-wrap gap-1.5">
              {skill.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          {/* Related: same category */}
          <RelatedSkills currentSkill={skill} onSelectSkill={onSelectSkill} />

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-xs text-muted-foreground">
            <p>
              Content paraphrased educationally from{" "}
              <span className="italic">
                DBT Skills Training Handouts and Worksheets, Second Edition
              </span>{" "}
              by Marsha M. Linehan (Guilford Press, 2014). Not a substitute for treatment.
              Skills concepts are widely published; the original handouts/worksheets are
              copyrighted and available from the publisher.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Collapsible reader section for skill pages — lets members collapse what
// they don't need mid-session. Content always prints in full regardless
// of collapse state (see .reader-section-content in globals.css).
function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  const isOpen = open ?? defaultOpen;
  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-2 text-base font-semibold mb-2 text-left rounded-md px-1.5 py-1 -mx-1.5 hover:bg-muted/60 transition-colors"
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            !isOpen && "-rotate-90"
          )}
        />
        {icon}
        {title}
      </button>
      <div className={cn("reader-section-content", !isOpen && "hidden")}>
        {children}
      </div>
    </section>
  );
}

function RelatedSkills({
  currentSkill,
  onSelectSkill,
}: {
  currentSkill: Skill;
  onSelectSkill: (skill: Skill) => void;
}) {
  const related = React.useMemo(() => {
    // Find skills in the same module, same or related category, excluding current
    return SKILLS.filter(
      (s) =>
        s.id !== currentSkill.id &&
        s.module === currentSkill.module &&
        (s.category === currentSkill.category ||
          s.tags.some((t) => currentSkill.tags.includes(t)))
    ).slice(0, 4);
  }, [currentSkill]);

  if (related.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold mb-3">Related skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {related.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelectSkill(r)}
            className="text-left p-3 rounded-md border hover:bg-muted/50 transition-colors"
          >
            <div className="text-sm font-medium">{r.name}</div>
            <div className="text-xs text-muted-foreground truncate mt-0.5">
              {r.oneLiner}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

