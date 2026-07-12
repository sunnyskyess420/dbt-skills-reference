"use client";

import * as React from "react";
import { type Skill, MODULES, SKILLS } from "@/data/skills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, ArrowLeft, BookOpen, Lightbulb, Footprints, CircleHelp, Quote, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillDetailProps {
  skill: Skill | null;
  onBack?: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (skillId: string) => void;
  onSelectSkill: (skill: Skill) => void;
}

export function SkillDetail({
  skill,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onSelectSkill,
}: SkillDetailProps) {
  if (!skill) return null;

  const moduleInfo = MODULES.find((m) => m.id === skill.module)!;

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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto">
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
            </span>
          </div>

          {/* Description */}
          <section className="mt-8">
            <h2 className="text-base font-semibold mb-2">What it is</h2>
            <p className="text-sm sm:text-base leading-relaxed text-foreground/90">
              {skill.description}
            </p>
          </section>

          {/* When to use */}
          {skill.whenToUse && skill.whenToUse.length > 0 && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-base font-semibold mb-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                When to use it
              </h2>
              <ul className="space-y-2">
                {skill.whenToUse.map((item, i) => (
                  <li key={i} className="text-sm sm:text-base leading-relaxed flex gap-2">
                    <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Steps */}
          {skill.steps && skill.steps.length > 0 && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-base font-semibold mb-3">
                <Footprints className="h-4 w-4 text-muted-foreground" />
                How to do it
              </h2>
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
            </section>
          )}

          {/* Examples */}
          {skill.examples && skill.examples.length > 0 && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-base font-semibold mb-3">
                <Quote className="h-4 w-4 text-muted-foreground" />
                Examples
              </h2>
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
            </section>
          )}

          {/* Tips */}
          {skill.tips && skill.tips.length > 0 && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-base font-semibold mb-3">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Tips & common pitfalls
              </h2>
              <ul className="space-y-2">
                {skill.tips.map((tip, i) => (
                  <li key={i} className="text-sm sm:text-base leading-relaxed flex gap-2">
                    <CircleHelp className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
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

