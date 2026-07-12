// Skill suggestions engine for diary cards.
// Analyzes a diary card's data and returns prioritized DBT skill recommendations
// based on which emotions, urges, or actions spiked during the week.

import type { WorksheetEntry } from "./worksheet-storage";

export interface Suggestion {
  skillId: string;
  skillName: string;
  reason: string;
  priority: "high" | "medium" | "low";
  module: "general" | "mindfulness" | "interpersonal" | "emotion-regulation" | "distress-tolerance";
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function generateDiarySuggestions(entry: WorksheetEntry): Suggestion[] {
  const days: any[] = (entry.data.days ?? []).slice(0, 7);
  if (days.length === 0) return [];

  const suggestions: Suggestion[] = [];
  const seen = new Set<string>();

  const add = (s: Suggestion) => {
    if (!seen.has(s.skillId)) {
      seen.add(s.skillId);
      suggestions.push(s);
    }
  };

  // Aggregate stats
  const sum = (key: string) =>
    days.reduce((acc, d) => acc + (Number(d?.[key] ?? 0) || 0), 0);
  const max = (key: string) =>
    days.reduce((m, d) => Math.max(m, Number(d?.[key] ?? 0) || 0), 0);
  const avg = (key: string) => sum(key) / days.length;

  // ===== Urges (any day ≥ 3, or avg ≥ 2) =====
  const maxSelfHarmUrge = max("urgeSelfHarm");
  const maxSuicideUrge = max("urgeSuicide");
  const maxSubstanceUrge = max("urgeSubstances");

  if (maxSuicideUrge >= 3 || maxSelfHarmUrge >= 4) {
    add({
      skillId: "tipp",
      skillName: "TIPP",
      reason: `Self-harm or suicide urges reached ${Math.max(
        maxSelfHarmUrge,
        maxSuicideUrge
      )}/5 this week. TIPP is the fastest way to drop extreme emotional intensity through body chemistry.`,
      priority: "high",
      module: "distress-tolerance",
    });
    add({
      skillId: "pros-and-cons",
      skillName: "Pros and Cons",
      reason:
        "With urges at this level, having a pre-written Pros & Cons sheet ready before the next crisis can save critical seconds.",
      priority: "high",
      module: "distress-tolerance",
    });
    add({
      skillId: "stop",
      skillName: "STOP",
      reason:
        "STOP is the first crisis survival skill to reach for — it interrupts the autopilot of an urge in seconds.",
      priority: "high",
      module: "distress-tolerance",
    });
  }

  if (maxSubstanceUrge >= 3) {
    add({
      skillId: "dialectical-abstinence",
      skillName: "Dialectical Abstinence",
      reason:
        "Substance urges spiked this week. Dialectical abstinence is the DBT approach: aim for abstinence AND have a harm-reduction plan for slips.",
      priority: "high",
      module: "distress-tolerance",
    });
  }

  // ===== Actions taken =====
  const maxSelfHarmAction = max("actSelfHarm");
  const maxSubstanceAction = max("actSubstances");
  const actionDays = days.filter(
    (d) => (d?.actSelfHarm ?? 0) > 0 || (d?.actSubstances ?? 0) > 0
  ).length;

  if (actionDays > 0) {
    add({
      skillId: "chain-analysis",
      skillName: "Chain Analysis",
      reason: `You recorded ${actionDays} day(s) with target actions this week. A chain analysis on the most recent instance can reveal where to intervene next time.`,
      priority: "high",
      module: "general",
    });
  }

  // ===== Emotions =====
  const maxAnger = max("emoAnger");
  const maxSadness = max("emoSadness");
  const maxFear = max("emoFear");
  const maxShame = max("emoShame");
  const avgJoy = avg("emoJoy");

  if (maxAnger >= 3) {
    add({
      skillId: "check-the-facts",
      skillName: "Check the Facts",
      reason: `Anger peaked at ${maxAnger}/5. Check the Facts helps you verify whether your interpretation (and the anger's intensity) fits the situation.`,
      priority: "high",
      module: "emotion-regulation",
    });
    add({
      skillId: "opposite-action",
      skillName: "Opposite Action",
      reason:
        "If the anger doesn't fit the facts, opposite action (gentle de-escalation instead of attack) can change the emotion.",
      priority: "medium",
      module: "emotion-regulation",
    });
  }

  if (maxShame >= 3) {
    add({
      skillId: "opposite-action",
      skillName: "Opposite Action",
      reason: `Shame peaked at ${maxShame}/5. If the shame doesn't fit the facts, the opposite action is to engage rather than hide — tell someone trustworthy what happened.`,
      priority: "high",
      module: "emotion-regulation",
    });
  }

  if (maxSadness >= 3) {
    add({
      skillId: "accumulate-positive-emotions-short-term",
      skillName: "Accumulate Positive Emotions (Short Term)",
      reason: `Sadness peaked at ${maxSadness}/5. Intentionally scheduling small pleasant activities this week can build resilience against low mood.`,
      priority: "medium",
      module: "emotion-regulation",
    });
    add({
      skillId: "build-mastery",
      skillName: "Build Mastery",
      reason:
        "Doing one thing each day that gives a sense of competence directly counters the helplessness that often accompanies sadness.",
      priority: "medium",
      module: "emotion-regulation",
    });
  }

  if (maxFear >= 3) {
    add({
      skillId: "check-the-facts",
      skillName: "Check the Facts",
      reason: `Fear peaked at ${maxFear}/5. Check whether the threat is real and the intensity fits — fear often overestimates danger.`,
      priority: "high",
      module: "emotion-regulation",
    });
    add({
      skillId: "cope-ahead",
      skillName: "Cope Ahead",
      reason:
        "If you can anticipate the situations that triggered fear, rehearsing the skill you'll use (cope ahead) makes it more accessible next time.",
      priority: "medium",
      module: "emotion-regulation",
    });
  }

  // ===== Low joy + low skills → recommend preventive skills =====
  const skillsUsedDays = days.filter(
    (d) =>
      d?.skillMindfulness ||
      d?.skillDistressTolerance ||
      d?.skillEmotionRegulation ||
      d?.skillInterpersonal
  ).length;

  if (avgJoy < 1.5 && skillsUsedDays < 3) {
    add({
      skillId: "accumulate-positive-emotions-long-term",
      skillName: "Accumulate Positive Emotions (Long Term)",
      reason:
        "Joy was low across the week and few skills were used. Long-term positive emotion comes from living by your values — start with one small action this week.",
      priority: "medium",
      module: "emotion-regulation",
    });
  }

  // ===== PLEASE basics — if emotions were erratic and no clear cause =====
  const totalEmotionIntensity =
    sum("emoAnger") + sum("emoSadness") + sum("emoFear") + sum("emoShame");
  if (totalEmotionIntensity > 12 && skillsUsedDays < 4) {
    add({
      skillId: "please",
      skillName: "PLEASE",
      reason:
        "High overall emotion intensity this week. Check the physical basics (sleep, food, exercise, illness, substances) — these affect every other skill.",
      priority: "medium",
      module: "emotion-regulation",
    });
  }

  // ===== Mindfulness recommendation if no mindfulness used =====
  const mindfulnessDays = days.filter((d) => d?.skillMindfulness).length;
  if (mindfulnessDays === 0 && (maxAnger >= 2 || maxSadness >= 2 || maxFear >= 2)) {
    add({
      skillId: "wise-mind",
      skillName: "Wise Mind",
      reason:
        "No mindfulness skills recorded this week, despite emotional intensity. Wise Mind is the entry point — a minute of practice before reacting can change outcomes.",
      priority: "low",
      module: "mindfulness",
    });
  }

  // ===== Interpersonal — if shame or anger and no IE skills used =====
  const ieDays = days.filter(
    (d) => d?.skillInterpersonal
  ).length;
  if (ieDays === 0 && (maxShame >= 3 || maxAnger >= 3)) {
    add({
      skillId: "validation",
      skillName: "Validation",
      reason:
        "Shame and anger often have interpersonal roots. Validation (of yourself and others) can de-escalate conflicts that fuel these emotions.",
      priority: "low",
      module: "interpersonal",
    });
  }

  // Sort by priority (high → medium → low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
}

// Format day label for an index (0-6 → Mon-Sun)
export function dayLabel(idx: number): string {
  return DAY_LABELS[idx] ?? `Day ${idx + 1}`;
}
