// My Goals — data model, localStorage persistence and the
// offline (fallback) goal → skill matching engine.
//
// Goals are stored locally on this device (same pattern as Session Prep)
// under the key below. Up to MAX_GOALS active goal slots are supported.

import { SKILLS, type Skill } from "@/data/skills";

export const GOALS_STORAGE_KEY = "dbt-skills:goals";
export const MAX_GOALS = 3;

export interface GoalStep {
  id: string;
  text: string;
  done: boolean;
}

/** One suggested skill attached to a goal, with an optional "why". */
export interface GoalSkillLink {
  skillId: string;
  reason?: string;
}

/** Result of a breakdown (AI-generated or the offline template). */
export interface GoalGuidance {
  source: "ai" | "offline";
  generatedAt: string;
  summary: string;
  /** Suggested steps — appended to the checklist when the goal has none. */
  steps: { text: string; hint?: string }[];
  obstacles?: string;
  progressSignals?: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  /** "How my group / therapist can support me" — free text. */
  groupSupport: string;
  steps: GoalStep[];
  skills: GoalSkillLink[];
  guidance?: GoalGuidance;
  createdAt: string;
  updatedAt: string;
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyGoal(): Goal {
  const now = new Date().toISOString();
  return {
    id: newId(),
    title: "",
    description: "",
    targetDate: "",
    groupSupport: "",
    steps: [],
    skills: [],
    createdAt: now,
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

export function loadGoals(): Goal[] | null {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!raw) return null;
    // One-time cleanup: an earlier build auto-seeded example goals into
    // storage. Those were build-time examples only, never real user data —
    // detect and remove them so every user starts from a clean slate.
    if (raw.includes("Part of your September plan")) {
      localStorage.removeItem(GOALS_STORAGE_KEY);
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.goals)) return null;
    // Basic shape repair so older/partial entries never crash the UI.
    return parsed.goals
      .slice(0, MAX_GOALS)
      .map((g: Partial<Goal>) => ({ ...emptyGoal(), ...g, id: g.id || newId() }));
  } catch {
    return null;
  }
}

export function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(
      GOALS_STORAGE_KEY,
      JSON.stringify({ goals, savedAt: new Date().toISOString() })
    );
  } catch {
    // ignore quota / privacy-mode errors
  }
}

// ---------------------------------------------------------------------------
// Offline skill matching — keyword rules → skill suggestions.
// Used as the instant "Find skills" action and as the fallback whenever the
// AI breakdown is unavailable. Scores are additive; best matches first.
// ---------------------------------------------------------------------------

interface MatchRule {
  /** Any of these phrases (lowercase) appearing in the goal text triggers the rule. */
  keywords: string[];
  /** Points added per matched keyword occurrence group. */
  weight: number;
  skillIds: string[];
  reason: string;
}

const MATCH_RULES: MatchRule[] = [
  {
    keywords: ["leave the house", "exposure", "going out", "go outside", "alone outside", "errands", "agoraphobia", "leave home", "leave alone", "step outside"],
    weight: 4,
    skillIds: ["opposite-action", "cope-ahead", "check-the-facts", "tipp", "self-soothing", "paired-muscle-relaxation", "wise-mind"],
    reason: "Gradual exposure works best when you plan coping ahead, act on opposite action, and rate anxiety before and after.",
  },
  {
    keywords: ["anxiety", "anxious", "fear", "afraid", "scared", "panic", "worried", "worry", "nervous", "dread"],
    weight: 3,
    skillIds: ["check-the-facts", "opposite-action", "tipp", "paired-muscle-relaxation", "cope-ahead", "mindfulness-of-current-emotions"],
    reason: "Fear and anxiety respond well to checking the facts, opposite action, and paced breathing / TIPP.",
  },
  {
    keywords: ["negative thoughts", "automatic thoughts", "reframe", "thought record", "catastrophiz", "mind-reading", "mind reading", "all-or-nothing", "thinking pattern", "overthinking", "rumination", "ruminate"],
    weight: 4,
    skillIds: ["check-the-facts", "mindfulness-of-current-thoughts", "model-for-describing-emotions", "what-skills", "wise-mind", "opposite-action"],
    reason: "Thought records + Check the Facts help you test anxious predictions and find balanced replacement thoughts.",
  },
  {
    keywords: ["glimmer", "glimmers", "positive moments", "savor", "gratitude", "notice joy", "small joys", "hope", "moments of calm", "appreciate"],
    weight: 4,
    skillIds: ["accumulate-positive-emotions-short-term", "what-skills", "self-soothing", "improve-the-moment", "accumulate-positive-emotions-long-term", "loving-kindness"],
    reason: "Accumulating positives and Observe/Describe help you notice, pause, and take in small good moments.",
  },
  {
    keywords: ["sleep", "insomnia", "tired", "exhausted", "nightmare", "rest"],
    weight: 3,
    skillIds: ["sleep-hygiene", "please", "nightmare-protocol"],
    reason: "Sleep hygiene, PLEASE and the Nightmare Protocol target rest and nighttime distress directly.",
  },
  {
    keywords: ["sad", "depressed", "depression", "down", "low mood", "lonely", "loneliness", "empty", "cry"],
    weight: 3,
    skillIds: ["opposite-action", "accumulate-positive-emotions-short-term", "build-mastery", "please", "problem-solving", "check-the-facts"],
    reason: "For low mood: opposite action (approach, don't withdraw), accumulating positives, and Build Mastery.",
  },
  {
    keywords: ["anger", "angry", "frustrated", "frustration", "irritable", "irritation", "annoyed", "rage", "snap at"],
    weight: 3,
    skillIds: ["stop", "tipp", "check-the-facts", "opposite-action", "mindfulness-of-current-emotions", "walking-the-middle-path"],
    reason: "STOP + TIPP cool the crisis wave; Check the Facts and middle-path thinking address the heat underneath.",
  },
  {
    keywords: ["relationship", "friend", "friendship", "partner", "family", "dating", "people", "social"],
    weight: 2,
    skillIds: ["give", "dear-man", "validation", "mindfulness-of-others", "finding-people-to-like-you", "dialectics"],
    reason: "GIVE and Validation keep relationships warm while you work on what you need.",
  },
  {
    keywords: ["say no", "boundaries", "boundary", "ask for", "assertive", "stand up", "conflict", "difficult conversation"],
    weight: 3,
    skillIds: ["dear-man", "fast", "dime-game", "troubleshooting-interpersonal", "validation"],
    reason: "DEAR MAN scripts the ask; FAST keeps self-respect; the Dime Game tells you how hard to push.",
  },
  {
    keywords: ["shame", "guilt", "self-critic", "self critic", "judge myself", "self-esteem", "hate myself", "not good enough", "self-compassion", "self-validation"],
    weight: 3,
    skillIds: ["validation", "loving-kindness", "half-smiling-willing-hands", "check-the-facts", "how-skills"],
    reason: "Self-validation, loving kindness and nonjudgmental How Skills soften shame and self-criticism.",
  },
  {
    keywords: ["urge", "urges", "addiction", "relapse", "substance", "alcohol", "drinking", "smoking", "vape", "binge", "purge", "self-harm", "gambling"],
    weight: 4,
    skillIds: ["clear-mind", "dialectical-abstinence", "stop", "pros-and-cons", "distracting-accepts", "improve-the-moment", "tipp"],
    reason: "Crisis survival + Clear Mind / Dialectical Abstinence are designed exactly for riding out urges.",
  },
  {
    keywords: ["overwhelm", "overwhelmed", "stress", "stressed", "burnout", "too much", "pressure", "chaos"],
    weight: 3,
    skillIds: ["tipp", "self-soothing", "distracting-accepts", "improve-the-moment", "balancing-doing-and-being-mind"],
    reason: "TIPP brings the body down fast; self-soothing and ACCEPTS give the wave space to pass.",
  },
  {
    keywords: ["dissociat", "numb", "unreal", "zoning out", "detached", "grounding", "depersonal", "derealiz"],
    weight: 4,
    skillIds: ["self-soothing", "what-skills", "using-cold-water", "tipp", "mindfulness-of-current-emotions"],
    reason: "Five-senses self-soothing and Observe/Describe re-anchor you in the present; cold water re-alerts the body.",
  },
  {
    keywords: ["communicat", "argue", "argument", "fight", "talk to", "conversation", "explain myself", "be heard"],
    weight: 3,
    skillIds: ["dear-man", "give", "validation", "dialectics", "troubleshooting-interpersonal"],
    reason: "DEAR MAN + GIVE structure the conversation; Validation lowers the temperature on both sides.",
  },
  {
    keywords: ["accept", "acceptance", "let go", "letting go", "can't change", "cannot change", "chronic", "it is what it is", "radical acceptance"],
    weight: 3,
    skillIds: ["radical-acceptance", "turning-the-mind", "willingness", "half-smiling-willing-hands", "mindfulness-of-current-emotions"],
    reason: "Reality acceptance skills reduce suffering when the facts can't be changed — acceptance is not approval.",
  },
  {
    keywords: ["procrastinat", "motivation", "motivated", "focus", "productiv", "get started", "avoid starting", "perfection"],
    weight: 3,
    skillIds: ["build-mastery", "problem-solving", "accumulate-positive-emotions-short-term", "cope-ahead", "options-for-solving-any-problem"],
    reason: "Build Mastery + short-term positives rebuild momentum; Problem Solving unpicks what's blocking the start.",
  },
  {
    keywords: ["eat", "eating", "food", "appetite", "meal", "skip meals"],
    weight: 3,
    skillIds: ["please", "mindfulness-of-current-emotions"],
    reason: "PLEASE treats balanced eating as emotional first aid — it keeps vulnerability down.",
  },
  {
    keywords: ["exercise", "workout", "move my body", "walk more", "fitness", "stretch"],
    weight: 2,
    skillIds: ["please", "build-mastery", "cope-ahead"],
    reason: "Movement is a PLEASE skill and each session builds mastery — plan with Cope Ahead for low-motivation days.",
  },
  {
    keywords: ["school", "study", "exam", "homework", "work project", "deadline", "class", "test"],
    weight: 2,
    skillIds: ["problem-solving", "cope-ahead", "build-mastery", "please", "distracting-accepts"],
    reason: "Cope Ahead for the hard session, Problem Solving for the plan, PLEASE so fatigue doesn't win.",
  },
  {
    keywords: ["emotion", "emotions", "feelings", "feel so much", "mood swings", "understand my feelings", "name what i feel", "label"],
    weight: 2,
    skillIds: ["model-for-describing-emotions", "what-emotions-do", "myths-about-emotions", "mindfulness-of-current-emotions"],
    reason: "The emotion model helps you name and understand what you feel before deciding what to do with it.",
  },
  {
    keywords: ["my goals", "direction", "life worth living", "stuck", "where do i start", "big change", "life change"],
    weight: 2,
    skillIds: ["goals-of-skills-training", "options-for-solving-any-problem", "chain-analysis", "missing-links-analysis"],
    reason: "Orientation + Options for Solving Any Problem help size the change; chain analysis finds what's blocking it.",
  },
];

/** Distinctive skill names typed directly in the goal get a strong boost. */
const NAME_PATTERNS: { pattern: RegExp; skillId: string }[] = [
  { pattern: /\bwise mind\b/i, skillId: "wise-mind" },
  { pattern: /\bcheck the facts\b/i, skillId: "check-the-facts" },
  { pattern: /\bopposite action\b/i, skillId: "opposite-action" },
  { pattern: /\bradical acceptance\b/i, skillId: "radical-acceptance" },
  { pattern: /\bcope ahead\b/i, skillId: "cope-ahead" },
  { pattern: /\bpros and cons\b/i, skillId: "pros-and-cons" },
  { pattern: /\bself-soothing\b/i, skillId: "self-soothing" },
  { pattern: /\bhalf-smil/i, skillId: "half-smiling-willing-hands" },
  { pattern: /\bturning the mind\b/i, skillId: "turning-the-mind" },
  { pattern: /\bdear man\b/i, skillId: "dear-man" },
  { pattern: /\bgive skill\b/i, skillId: "give" },
  { pattern: /\bimprove the moment\b/i, skillId: "improve-the-moment" },
  { pattern: /\bchain analysis\b/i, skillId: "chain-analysis" },
  { pattern: /\bproblem solving\b/i, skillId: "problem-solving" },
  { pattern: /\bloving kindness\b/i, skillId: "loving-kindness" },
  { pattern: /\bmiddle path\b/i, skillId: "walking-the-middle-path" },
  { pattern: /\btipp\b/i, skillId: "tipp" },
  { pattern: /\bstop skill\b/i, skillId: "stop" },
  { pattern: /\bpaced breathing\b/i, skillId: "paired-muscle-relaxation" },
  { pattern: /\bgrounding\b/i, skillId: "self-soothing" },
];

const DIRECT_MATCH_REASON = "You mentioned this skill in the goal itself.";

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export interface SkillMatch {
  skillId: string;
  reason: string;
  score: number;
}

/**
 * Match a goal's text against the app's skill catalog using keyword rules.
 * Deterministic, instant, and works fully offline.
 */
export function matchSkillsForGoal(
  title: string,
  description: string,
  limit = 6
): SkillMatch[] {
  const text = `${normalize(title)} ${normalize(description)}`.trim();
  if (!text) return [];

  const scores = new Map<string, { score: number; reason: string }>();
  const bump = (skillId: string, points: number, reason: string) => {
    const cur = scores.get(skillId);
    if (cur) {
      cur.score += points;
      // Keep the most specific reason (longest) — good enough for display.
      if (reason.length > cur.reason.length) cur.reason = reason;
    } else {
      scores.set(skillId, { score: points, reason });
    }
  };

  for (const rule of MATCH_RULES) {
    const hits = rule.keywords.filter((kw) => text.includes(kw));
    if (hits.length === 0) continue;
    const points = rule.weight * Math.min(hits.length, 3);
    for (const skillId of rule.skillIds) {
      if (SKILLS.some((s) => s.id === skillId)) bump(skillId, points, rule.reason);
    }
  }

  for (const { pattern, skillId } of NAME_PATTERNS) {
    if (pattern.test(text) && SKILLS.some((s) => s.id === skillId)) {
      bump(skillId, 8, DIRECT_MATCH_REASON);
    }
  }

  return [...scores.entries()]
    .map(([skillId, { score, reason }]) => ({ skillId, reason, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Offline breakdown template — used when the AI endpoint is unavailable.
// ---------------------------------------------------------------------------

function templateSteps(title: string, description: string): { text: string; hint?: string }[] {
  const text = `${normalize(title)} ${normalize(description)}`;
  const steps: { text: string; hint?: string }[] = [
    {
      text: "Write down what success for this goal would look like this week — one sentence.",
      hint: "Keep it small and observable — something you could actually check off this week.",
    },
    {
      text: "Break it into the smallest step you can do today (10 minutes or less).",
      hint: "A step that feels challenging but possible is the right size.",
    },
  ];

  if (/(anxiety|anxious|fear|afraid|panic|exposure|leave the house|leave home)/.test(text)) {
    steps.push({
      text: "Rate your anxiety 1–10 before and after the step, and note predicted vs. actual outcome.",
      hint: "This is your evidence log — it's how anxious predictions get tested.",
    });
  }
  if (/(thought|reframe|negative|catastrophiz|mind-reading)/.test(text)) {
    steps.push({
      text: "Fill out one thought record: situation → automatic thought → emotion → balanced thought.",
      hint: "Check the Facts is the skill for this.",
    });
  }
  if (/(glimmer|savor|positive moment|gratitude|joy)/.test(text)) {
    steps.push({
      text: "When you notice a good moment, pause for 10–30 seconds and let it land before moving on.",
      hint: "Notice body sensations and the feeling that comes with it.",
    });
  }

  steps.push(
    {
      text: "Pick the skill you'll use first, and exactly when you'll use it.",
      hint: "Linking a skill to a moment ('when I reach the door') makes it far more likely to happen.",
    },
    {
      text: "After practicing, note one thing that helped and one thing that was hard.",
      hint: "Bring it to group or your therapist — that's where problem-solving happens.",
    }
  );
  return steps;
}

const OFFLINE_SIGNALS = [
  "You did the smallest step even though you didn't feel like it",
  "Anxiety came down a few points before/after practicing",
  "You used a skill without being prompted",
  "You noticed a pattern (thought, urge, or trigger) earlier than usual",
];

/**
 * Deterministic fallback breakdown when the AI service can't be reached.
 */
export function offlineBreakdown(title: string, description: string): GoalGuidance {
  return {
    source: "offline",
    generatedAt: new Date().toISOString(),
    summary: `Here is a starting breakdown for “${title.trim()}” using DBT's build-a-life-worth-living approach: make the goal small, pair it with a skill, and measure what happens.`,
    steps: templateSteps(title, description),
    obstacles:
      "Common obstacles: the step feels too big (shrink it), avoidance shows up (that's information, not failure — use opposite action), or you forget in the moment (link the skill to a specific cue, like a time or place).",
    progressSignals: OFFLINE_SIGNALS,
  };
}

/**
 * Offline breakdown including matched skills — one call for the fallback path.
 */
export function offlineBreakdownWithSkills(
  title: string,
  description: string
): { guidance: GoalGuidance; skills: SkillMatch[] } {
  const skills = matchSkillsForGoal(title, description, 6);
  return { guidance: offlineBreakdown(title, description), skills };
}
