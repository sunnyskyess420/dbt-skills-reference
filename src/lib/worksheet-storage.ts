// Worksheet definitions, schemas, and localStorage CRUD.
// References the printed Linehan (2014) worksheets by number.

export type WorksheetType =
  | "chain-analysis"
  | "pros-cons"
  | "diary-card"
  | "walking-middle-path"
  | "missing-links"
  | "dear-man-script"
  | "check-the-facts"
  | "opposite-action"
  | "radical-acceptance"
  | "crisis-survival-tracker"
  | "values-to-actions"
  | "pleasant-events-diary"
  | "emotion-diary"
  | "dialectics-practice"
  | "self-validation"
  | "dime-game"
  | "cope-ahead"
  | "build-mastery"
  | "please-tracker"
  | "nightmare-protocol"
  | "mindfulness-emotions"
  | "mindfulness-thoughts"
  | "turning-mind-willingness"
  | "clarifying-priorities"
  | "troubleshooting-ie"
  | "validating-others"
  | "myths-emotions"
  | "being-effective"
  | "wise-mind"
  | "what-skills"
  | "how-skills"
  | "loving-kindness"
  | "balancing-doing-being"
  | "stop-skill"
  | "tipp"
  | "accepts"
  | "self-soothing"
  | "improve"
  | "half-smiling"
  | "emotion-model"
  | "problem-solving"
  | "positives-short"
  | "positives-long"
  | "sleep-hygiene"
  | "extreme-emotions"
  | "clear-mind"
  | "finding-people"
  | "mindfulness-others"
  | "ending-relationships"
  | "options-problems"
  | "dialectical-abstinence"
  | "behavior-change";

export interface WorksheetEntry {
  id: string;
  type: WorksheetType;
  title: string;
  createdAt: string;
  updatedAt: string;
  data: Record<string, any>;
}

export interface WorksheetTypeMeta {
  id: WorksheetType;
  name: string;
  shortName: string;
  description: string;
  pages?: string; // printed page number in the 2nd edition
  icon: string; // lucide icon name (we map in component)
  reference: string; // book cross-reference
  color: string; // tailwind class
}

export const WORKSHEET_TYPES: WorksheetTypeMeta[] = [
  {
    id: "chain-analysis",
    name: "Chain Analysis",
    shortName: "Chain Analysis",
    pages: "p. 31",
    description:
      "Map a specific problem behavior link-by-link: prompting event → vulnerabilities → thoughts/feelings/sensations/actions → behavior → consequences. Find the links where a different DBT skill could have changed the chain.",
    icon: "Link2",
    reference: "General Worksheets 2, 2a (Handouts 7, 7a)",
    color: "text-slate-600 dark:text-slate-300",
  },
  {
    id: "pros-cons",
    name: "Pros and Cons of Acting on Crisis Urges",
    shortName: "Pros & Cons",
    pages: "p. 374",
    description:
      "Before acting on a crisis urge, weigh the pros and cons of BOTH acting on it AND resisting it — short-term AND long-term. The point is the structured weighing, especially of long-term consequences.",
    icon: "Scale",
    reference: "Distress Tolerance Worksheets 3, 3a (Handout 5)",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "diary-card",
    name: "DBT Diary Card (7 days)",
    shortName: "Diary Card",
    description:
      "Track urges, actions, emotions, and skills used across a 7-day period. The classic DBT weekly tracking tool. Bring to your individual therapy session.",
    icon: "CalendarRange",
    reference: "Standard DBT Diary Card format",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "walking-middle-path",
    name: "Walking the Middle Path (Dialectics)",
    shortName: "Middle Path",
    pages: "p. 105",
    description:
      "Identify two opposing positions, find what's true in each, and articulate a synthesis that integrates both. The core dialectical thinking skill.",
    icon: "GitMerge",
    reference: "Mindfulness Worksheets 10, 10a, 10b / Interpersonal Effectiveness Worksheets 11–11b (Handouts 10, 15, 16)",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "missing-links",
    name: "Missing-Links Analysis (Behavior Analysis)",
    shortName: "Missing-Links",
    pages: "p. 23",
    description:
      "When you knew a skill that would have helped but didn't use it: find the precise gap between knowing and doing, and plan a strategy to close it.",
    icon: "Unplug",
    reference: "General Handout 8 / General Worksheet 3",
    color: "text-slate-600 dark:text-slate-300",
  },
  {
    id: "dear-man-script",
    name: "DEAR MAN Script",
    shortName: "DEAR MAN",
    pages: "p. 174",
    description:
      "Write out a full interpersonal effectiveness script before a difficult conversation: Describe, Express, Assert, Reinforce, stay Mindful, Appear confident, Negotiate.",
    icon: "MessageSquareText",
    reference: "Interpersonal Effectiveness Handout 5a / Interpersonal Effectiveness Worksheet 4",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "check-the-facts",
    name: "Check the Facts",
    shortName: "Check the Facts",
    pages: "p. 230",
    description:
      "Walk through whether your emotion and its intensity fit the situation: what happened, your interpretation, alternative interpretations, and whether the threat is real.",
    icon: "SearchCheck",
    reference: "Emotion Regulation Handouts 8, 8a / Emotion Regulation Worksheet 5",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "opposite-action",
    name: "Opposite Action",
    shortName: "Opposite Action",
    pages: "p. 231",
    description:
      "Identify an emotion, its action urge, whether it fits the facts, and plan the opposite action step-by-step. The core skill for changing unwanted emotions.",
    icon: "FlipHorizontal",
    reference: "Emotion Regulation Handouts 9-11 / Emotion Regulation Worksheet 7",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "radical-acceptance",
    name: "Radical Acceptance Practice",
    shortName: "Radical Acceptance",
    pages: "p. 394",
    description:
      "Guided steps for practicing radical acceptance of a specific situation: what you're accepting, what makes it hard, willingness, half-smile, turning the mind.",
    icon: "HeartHandshake",
    reference: "Distress Tolerance Handouts 11, 11b / Distress Tolerance Worksheets 9, 9a",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "crisis-survival-tracker",
    name: "Crisis Survival Skills Tracker",
    shortName: "Crisis Tracker",
    pages: "p. 369",
    description:
      "After a crisis, check off which survival skills you used (STOP, TIPP, Pros/Cons, Distract, Self-Soothe, IMPROVE) and what worked. Helps you learn what helps.",
    icon: "ShieldCheck",
    reference: "Distress Tolerance Handouts 2-9a / Distress Tolerance Worksheet 1",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "values-to-actions",
    name: "Values to Action Steps",
    shortName: "Values to Actions",
    pages: "p. 296",
    description:
      "Identify your top values, pick one, break it into concrete weekly action steps. Directly builds a life worth living.",
    icon: "Target",
    reference: "Emotion Regulation Handouts 17-18 / Emotion Regulation Worksheets 11, 11a, 11b",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "pleasant-events-diary",
    name: "Pleasant Events Diary",
    shortName: "Pleasant Events",
    pages: "p. 295",
    description:
      "Track one pleasant activity per day and rate your emotion before and after. Builds the 'accumulate positive emotions' skill.",
    icon: "Smile",
    reference: "Emotion Regulation Handout 15 / Emotion Regulation Worksheet 10",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "emotion-diary",
    name: "Emotion Diary (Single Emotion)",
    shortName: "Emotion Diary",
    pages: "p. 295",
    description:
      "Track one specific emotion (e.g., anger, shame) across a week: triggers, intensity, what you did, what worked. More detailed than the diary card for a single emotion.",
    icon: "Activity",
    reference: "Emotion Regulation Handout 3 / Emotion Regulation Worksheet 2b",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "dialectics-practice",
    name: "Dialectics Practice",
    shortName: "Dialectics",
    pages: "p. 189",
    description:
      "Practice finding the synthesis between two opposing positions in a specific relationship conflict. Similar to Walking the Middle Path but focused on one relationship.",
    icon: "GitMerge",
    reference: "Interpersonal Effectiveness Handouts 15-16 / Interpersonal Effectiveness Worksheet 11",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "self-validation",
    name: "Self-Validation Practice",
    shortName: "Self-Validation",
    pages: "p. 241",
    description:
      "Practice the 6 levels of validation on yourself, for when you're being harsh with yourself about a feeling you're having.",
    icon: "HeartPulse",
    reference: "Interpersonal Effectiveness Handouts 17-19 / Interpersonal Effectiveness Worksheet 13",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "dime-game",
    name: "The Dime Game (Intensity of Asking or Saying No)",
    shortName: "Dime Game",
    pages: "p. 175",
    description:
      "Interactive decision tool: answer 10 questions about your situation to figure out how intensely to ask for what you want or how firmly to say no. Live score calculation.",
    icon: "Coins",
    reference: "Interpersonal Effectiveness Handout 8 / Interpersonal Effectiveness Worksheet 6",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "cope-ahead",
    name: "Cope Ahead",
    shortName: "Cope Ahead",
    pages: "p. 293",
    description:
      "Rehearse a difficult situation in detail — imagine it vividly, feel the emotions, and practice the skill you'll use. So it's ready when the situation arrives.",
    icon: "BrainCog",
    reference: "Emotion Regulation Handout 19 / Emotion Regulation Worksheets 12, 13",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "build-mastery",
    name: "Build Mastery",
    shortName: "Build Mastery",
    pages: "p. 301",
    description:
      "Daily competence tracker — do one thing each day that gives you a sense of accomplishment. Builds self-respect and resilience against despair.",
    icon: "TrendingUp",
    reference: "Emotion Regulation Handout 19 / Emotion Regulation Worksheets 12, 13",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "please-tracker",
    name: "PLEASE Skills Tracker",
    shortName: "PLEASE Tracker",
    pages: "p. 302",
    description:
      "Weekly physical self-care checklist: treat Physical iLLness, balanced Eating, avoid mood-Altering drugs, balanced Sleep, get Exercise.",
    icon: "HeartPulse",
    reference: "Emotion Regulation Handout 20 / Emotion Regulation Worksheet 14",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "nightmare-protocol",
    name: "Nightmare Protocol",
    shortName: "Nightmare Protocol",
    pages: "p. 258",
    description:
      "Rewrite a recurring nightmare with a different, mastery-ending. Rehearse the new version before sleep to reduce nightmare frequency.",
    icon: "Moon",
    reference: "Emotion Regulation Handout 20a / Emotion Regulation Worksheet 14a",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "mindfulness-emotions",
    name: "Mindfulness of Current Emotions",
    shortName: "Mindfulness of Emotions",
    pages: "p. 101",
    description:
      "Observe an emotion as a wave — notice where you feel it in your body, name it, let it crest and pass without acting on it or suppressing it.",
    icon: "Waves",
    reference: "Emotion Regulation Handout 22 / Emotion Regulation Worksheet 15",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "mindfulness-thoughts",
    name: "Mindfulness of Current Thoughts",
    shortName: "Mindfulness of Thoughts",
    pages: "p. 103",
    description:
      "Observe thoughts as passing mental events — like leaves on a stream or clouds in the sky. Not as truth, not as you. Let them come and go.",
    icon: "Cloud",
    reference: "Distress Tolerance Handouts 15, 15a / Distress Tolerance Worksheets 12, 12a",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "turning-mind-willingness",
    name: "Turning the Mind & Willingness",
    shortName: "Turning & Willingness",
    pages: "p. 348",
    description:
      "Practice turning back to acceptance each time you slip, and choosing willingness (doing what's needed) over willfulness (refusing reality).",
    icon: "RefreshCw",
    reference: "Distress Tolerance Handouts 12, 13 / Distress Tolerance Worksheets 8, 8a, 10",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "clarifying-priorities",
    name: "Clarifying Priorities",
    shortName: "Clarifying Priorities",
    pages: "p. 156",
    description:
      "Figure out whether your priority is objectives (get what you want), relationship (keep the connection), or self-respect in a specific situation.",
    icon: "ListChecks",
    reference: "Interpersonal Effectiveness Handout 4 / Interpersonal Effectiveness Worksheet 3",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "troubleshooting-ie",
    name: "Troubleshooting Interpersonal Effectiveness",
    shortName: "Troubleshooting IE",
    pages: "p. 158",
    description:
      "When DEAR MAN, GIVE, or FAST didn't work — diagnose what got in the way and what to try differently next time.",
    icon: "Wrench",
    reference: "Interpersonal Effectiveness Handout 9 / Interpersonal Effectiveness Worksheet 7",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "validating-others",
    name: "Validating Others",
    shortName: "Validating Others",
    pages: "p. 194",
    description:
      "Practice the 6 levels of validation on another person. Communicate that their experience makes sense — without necessarily agreeing with it.",
    icon: "Users",
    reference: "Interpersonal Effectiveness Handouts 17-18 / Interpersonal Effectiveness Worksheet 12",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "myths-emotions",
    name: "Myths About Emotions",
    shortName: "Myths About Emotions",
    pages: "p. 212",
    description:
      "Identify and challenge false beliefs about emotions — 'there's a right way to feel', 'negative emotions are bad', 'if I feel it I must act on it'.",
    icon: "Lightbulb",
    reference: "Emotion Regulation Handout 4a / Emotion Regulation Worksheet 3",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "being-effective",
    name: "Being Effective (FAST Skill)",
    shortName: "Being Effective",
    pages: "p. 88",
    description:
      "Plan and practice the FAST skill for self-respect effectiveness: Be Fair, no Apologies, Stick to values, Be Truthful. Write your script, rehearse it, and reflect.",
    icon: "ShieldCheck",
    reference: "Interpersonal Effectiveness Handout 7 / Interpersonal Effectiveness Worksheet 5",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "wise-mind",
    name: "Wise Mind Practice",
    shortName: "Wise Mind",
    pages: "p. 50",
    description:
      "Distinguish reasonable mind vs. emotion mind, and find Wise Mind — the quiet synthesis that includes both feeling and reason.",
    icon: "Sparkles",
    reference: "Mindfulness Handouts 3, 3a / Mindfulness Worksheet 3",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "what-skills",
    name: "What Skills: Observe, Describe, Participate",
    shortName: "What Skills",
    pages: "p. 84",
    description:
      "Practice the three What skills — notice experience, put words on it nonjudgmentally, or enter fully into an activity.",
    icon: "Eye",
    reference: "Mindfulness Handouts 4, 4a, 4b, 4c / Mindfulness Worksheets 4, 4a, 4b",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "how-skills",
    name: "How Skills: Nonjudgmental, One-Mindful, Effective",
    shortName: "How Skills",
    pages: "p. 88",
    description:
      "Practice the quality you bring to mindfulness — nonjudgmentalness, one-mindfulness, and effectiveness.",
    icon: "Compass",
    reference: "Mindfulness Handouts 5, 5a, 5b, 5c / Mindfulness Worksheets 5, 5a, 5b, 5c",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "loving-kindness",
    name: "Loving Kindness Practice",
    shortName: "Loving-Kindness",
    pages: "p. 70",
    description:
      "Silently repeat phrases of well-wishing, starting with yourself and extending outward — even to difficult people.",
    icon: "Heart",
    reference: "Mindfulness Handout 8 / Mindfulness Worksheet 6",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "balancing-doing-being",
    name: "Balancing Doing Mind and Being Mind",
    shortName: "Doing & Being Mind",
    pages: "p. 98",
    description:
      "Recognize whether you're in doing mind (goal-focused) or being mind (present-moment) and shift toward balance.",
    icon: "RefreshCw",
    reference: "Mindfulness Handouts 9, 9a / Mindfulness Worksheets 7, 7a",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "stop-skill",
    name: "STOP Skill Practice",
    shortName: "STOP Skill",
    pages: "p. 372",
    description:
      "Stop, Take a step back, Observe, Proceed mindfully. The first crisis survival skill — interrupts the autopilot of emotional reaction.",
    icon: "Octagon",
    reference: "Distress Tolerance Handout 4 / Distress Tolerance Worksheets 2, 2a",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "tipp",
    name: "TIPP Skills Log",
    shortName: "TIPP",
    pages: "p. 329",
    description:
      "Use Temperature, Intense exercise, Paced breathing, and Paired muscle relaxation to rapidly reduce extreme emotional arousal.",
    icon: "Zap",
    reference: "Distress Tolerance Handouts 6, 6a, 6b, 6c / Distress Tolerance Worksheets 4, 4a, 4b",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "accepts",
    name: "Distracting with ACCEPTS",
    shortName: "ACCEPTS",
    pages: "p. 379",
    description:
      "Seven distraction strategies — Activities, Contributing, Comparisons, Emotions, Pushing away, Thoughts, Sensations.",
    icon: "Shuffle",
    reference: "Distress Tolerance Handout 7 / Distress Tolerance Worksheets 5, 5a, 5b",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "self-soothing",
    name: "Self-Soothing with the Five Senses",
    shortName: "Self-Soothing",
    pages: "p. 6",
    description:
      "Comfort yourself through the five senses — vision, hearing, smell, taste, touch. Calms the nervous system directly.",
    icon: "Flower2",
    reference: "Distress Tolerance Handout 8 / Distress Tolerance Worksheets 6, 6a, 6b",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "improve",
    name: "IMPROVE the Moment",
    shortName: "IMPROVE",
    pages: "p. 386",
    description:
      "Imagery, Meaning, Prayer, Relaxation, One thing, Vacation, Encouragement — reshape how you relate to a difficult moment.",
    icon: "Sparkle",
    reference: "Distress Tolerance Handout 9 / Distress Tolerance Worksheets 7, 7a, 7b",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "half-smiling",
    name: "Half-Smiling and Willing Hands",
    shortName: "Half-Smiling",
    pages: "p. 397",
    description:
      "Body-based cues that support radical acceptance — a slight smile and open palms communicate safety to your nervous system.",
    icon: "SmilePlus",
    reference: "Distress Tolerance Handouts 14, 14a / Distress Tolerance Worksheets 11, 11a",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "emotion-model",
    name: "Model for Describing Emotions",
    shortName: "Emotion Model",
    pages: "p. 212",
    description:
      "Break down an emotion into its components — prompting event, interpretation, biology, expressions, aftereffects — to find where to intervene.",
    icon: "Puzzle",
    reference: "Emotion Regulation Handouts 5, 6 / Emotion Regulation Worksheets 4, 4a",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    shortName: "Problem Solving",
    pages: "p. 241",
    description:
      "When the emotion fits the facts, solve the problem: define it, brainstorm, evaluate, choose, plan, do it, evaluate the result.",
    icon: "Lightbulb",
    reference: "Emotion Regulation Handout 12 / Emotion Regulation Worksheet 8",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "positives-short",
    name: "Accumulate Positive Emotions — Short Term",
    shortName: "Positives Short-Term",
    pages: "p. 295",
    description:
      "Plan and track one small pleasant activity per day for a week. Motivation follows action — don't wait until you feel like it.",
    icon: "Sun",
    reference: "Emotion Regulation Handouts 15, 16 / Emotion Regulation Worksheets 9, 10, 13",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "positives-long",
    name: "Accumulating Positive Emotions — Long Term",
    shortName: "Positives Long-Term",
    pages: "p. 295",
    description:
      "Identify values, set goals connected to them, and take small daily actions toward building a life worth living.",
    icon: "Mountain",
    reference: "Emotion Regulation Handouts 17, 18 / Emotion Regulation Worksheets 11, 11a, 11b",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "sleep-hygiene",
    name: "Sleep Hygiene Tracker",
    shortName: "Sleep Hygiene",
    pages: "p. 259",
    description:
      "Daily sleep log with hygiene checklist. Good sleep is foundational to emotion regulation — without it, no other skill fully works.",
    icon: "BedDouble",
    reference: "Emotion Regulation Handout 20b / Emotion Regulation Worksheet 14b",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "extreme-emotions",
    name: "Managing Extreme Emotions Plan",
    shortName: "Extreme Emotions",
    pages: "p. 266",
    description:
      "Create a crisis plan for when emotions reach 8/10+: distress tolerance first, then emotion regulation when intensity drops.",
    icon: "Siren",
    reference: "Emotion Regulation Handout 23",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "clear-mind",
    name: "Clear Mind (Addiction Recovery)",
    shortName: "Clear Mind",
    pages: "p. 359",
    description:
      "The synthesis of addiction recovery: abstinent AND aware of the vulnerability, prepared, and engaged in ongoing recovery.",
    icon: "CircleDot",
    reference: "Distress Tolerance Handouts 18, 18a / Distress Tolerance Worksheet 15",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "finding-people",
    name: "Finding and Getting People to Like You",
    shortName: "Finding People",
    pages: "p. 183",
    description:
      "Plan where to meet people who share your interests, how to start conversations, and how to be someone others enjoy being around.",
    icon: "UserPlus",
    reference: "Interpersonal Effectiveness Handouts 11, 11a / Interpersonal Effectiveness Worksheet 8",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "mindfulness-others",
    name: "Mindfulness of Others",
    shortName: "Mindfulness of Others",
    pages: "p. 184",
    description:
      "Practice being present with another person — noticing their mood, body language, and what they might need. The foundation of attunement.",
    icon: "ScanEye",
    reference: "Interpersonal Effectiveness Handouts 12, 12a / Interpersonal Effectiveness Worksheet 9",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "ending-relationships",
    name: "Ending Relationships",
    shortName: "Ending Relationships",
    pages: "p. 145",
    description:
      "Guided reflection for ending a relationship skillfully — be clear, preserve the learning, and maintain self-respect.",
    icon: "UserMinus",
    reference: "Interpersonal Effectiveness Handouts 13, 13a / Interpersonal Effectiveness Worksheet 10",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "options-problems",
    name: "Options for Solving Any Problem",
    shortName: "Options for Problems",
    pages: "p. 10",
    description:
      "Four options for any problem: solve it, feel better about it, radically accept it, or stay miserable. Map your situation to the right skill family.",
    icon: "GitFork",
    reference: "General Handout 1a",
    color: "text-slate-600 dark:text-slate-300",
  },
  {
    id: "dialectical-abstinence",
    name: "Dialectical Abstinence",
    shortName: "Dialectical Abstinence",
    pages: "p. 357",
    description:
      "Aim for absolute abstinence AND have a detailed harm reduction plan for slips. The synthesis of recovery.",
    icon: "ShieldHalf",
    reference: "Distress Tolerance Handouts 17, 17a / Distress Tolerance Worksheet 14",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "behavior-change",
    name: "Behavior Change Strategies",
    shortName: "Behavior Change",
    pages: "p. 162",
    description:
      "To increase a behavior, reinforce it immediately. To decrease a behavior, stop reinforcing it. Be deliberate, consistent, aware.",
    icon: "Repeat",
    reference: "Interpersonal Effectiveness Handouts 20, 21, 22, 22a / Interpersonal Effectiveness Worksheets 14, 15",
    color: "text-amber-600 dark:text-amber-400",
  },
];

export function getWorksheetTypeMeta(type: WorksheetType): WorksheetTypeMeta {
  return WORKSHEET_TYPES.find((w) => w.id === type)!;
}

// =================== Skill ↔ Worksheet linking ===================

/** Map from worksheet type to the skill ID it practices. */
export const WORKSHEET_TO_SKILL: Partial<Record<WorksheetType, string>> = {
  // General
  "chain-analysis": "chain-analysis",
  "missing-links": "missing-links-analysis",
  "options-problems": "options-for-solving-any-problem",
  // Distress Tolerance
  "pros-cons": "pros-and-cons",
  "radical-acceptance": "radical-acceptance",
  "mindfulness-thoughts": "mindfulness-of-current-thoughts",
  "turning-mind-willingness": "willingness",
  "stop-skill": "stop",
  "tipp": "tipp",
  "accepts": "distracting-accepts",
  "self-soothing": "self-soothing",
  "improve": "improve-the-moment",
  "half-smiling": "half-smiling-willing-hands",
  "clear-mind": "clear-mind",
  "dialectical-abstinence": "dialectical-abstinence",
  // Emotion Regulation
  "check-the-facts": "check-the-facts",
  "opposite-action": "opposite-action",
  "cope-ahead": "cope-ahead",
  "build-mastery": "build-mastery",
  "please-tracker": "please",
  "nightmare-protocol": "nightmare-protocol",
  "mindfulness-emotions": "mindfulness-of-current-emotions",
  "myths-emotions": "myths-about-emotions",
  "emotion-model": "model-for-describing-emotions",
  "problem-solving": "problem-solving",
  "positives-short": "accumulate-positive-emotions-short-term",
  "positives-long": "accumulate-positive-emotions-long-term",
  "sleep-hygiene": "sleep-hygiene",
  "extreme-emotions": "managing-extreme-emotions",
  // Interpersonal Effectiveness
  "dear-man-script": "dear-man",
  "dialectics-practice": "dialectics",
  "self-validation": "validation",
  "dime-game": "dime-game",
  "troubleshooting-ie": "troubleshooting-interpersonal",
  "validating-others": "validation",
  "being-effective": "fast",
  "finding-people": "finding-people-to-like-you",
  "mindfulness-others": "mindfulness-of-others",
  "ending-relationships": "ending-relationships",
  "behavior-change": "behavior-change-strategies",
  // Mindfulness
  "walking-middle-path": "walking-the-middle-path",
  "wise-mind": "wise-mind",
  "what-skills": "what-skills",
  "how-skills": "how-skills",
  "loving-kindness": "loving-kindness",
  "balancing-doing-being": "balancing-doing-and-being-mind",
};

/** Reverse lookup: skill ID → worksheet type. */
export const SKILL_TO_WORKSHEET: Record<string, WorksheetType> = {} as Record<string, WorksheetType>;
for (const [wsType, skillId] of Object.entries(WORKSHEET_TO_SKILL)) {
  // If multiple worksheets link to the same skill, keep the first (most specific) one
  if (!(skillId in SKILL_TO_WORKSHEET)) {
    SKILL_TO_WORKSHEET[skillId] = wsType as WorksheetType;
  }
}

/** Get the linked worksheet type for a skill, if one exists. */
export function getWorksheetForSkill(skillId: string): WorksheetType | undefined {
  return SKILL_TO_WORKSHEET[skillId];
}

/** Get the linked skill ID for a worksheet type, if one exists. */
export function getSkillForWorksheet(worksheetType: WorksheetType): string | undefined {
  return WORKSHEET_TO_SKILL[worksheetType];
}

// =================== Blank templates ===================

export function blankChainAnalysisData(): Record<string, any> {
  return {
    behaviorDate: "",
    problemBehavior: "",
    whatWhenWhere: "",
    promptingEvent: "",
    vulnerabilities: {
      tired: false,
      hungry: false,
      sick: false,
      pain: false,
      substances: false,
      stressfulEnv: false,
      recentLoss: false,
      conflict: false,
      poorSleep: false,
      other: false,
      otherText: "",
    },
    vulnerabilityNotes: "",
    chainLinks: [
      { situation: "", thought: "", feeling: "", body: "", action: "" },
    ],
    behaviorDescription: "",
    consequencesImmediate: "",
    consequencesLongTerm: "",
    skillsCouldHaveUsed: "",
    skillsNextTime: "",
  };
}

export function blankProsConsData(): Record<string, any> {
  return {
    entryDate: "",
    urgeDescription: "",
    actingProsShort: "",
    actingProsLong: "",
    actingConsShort: "",
    actingConsLong: "",
    notActingProsShort: "",
    notActingProsLong: "",
    notActingConsShort: "",
    notActingConsLong: "",
    decision: "",
    skillToUse: "",
  };
}

export function blankDiaryCardData(): Record<string, any> {
  // 7 days, each with metrics
  const days: Record<string, any>[] = [];
  for (let i = 0; i < 7; i++) {
    days.push({
      date: "",
      // Urges 0-5
      urgeSelfHarm: 0,
      urgeSuicide: 0,
      urgeSubstances: 0,
      urgeQuitTherapy: 0,
      // Actions 0-5
      actSelfHarm: 0,
      actSubstances: 0,
      actOther: 0,
      actOtherLabel: "",
      // Emotions 0-5
      emoAnger: 0,
      emoSadness: 0,
      emoFear: 0,
      emoShame: 0,
      emoJoy: 0,
      // Skills used (checkboxes)
      skillMindfulness: false,
      skillDistressTolerance: false,
      skillEmotionRegulation: false,
      skillInterpersonal: false,
      // Notes
      notes: "",
    });
  }
  return {
    weekStartDate: "",
    customTarget: "",
    days,
  };
}

export function blankWalkingMiddlePathData(): Record<string, any> {
  return {
    entryDate: "",
    situation: "",
    positionA: "",
    trueInA: "",
    positionB: "",
    trueInB: "",
    oldSynthesisAttempt: "",
    synthesis: "",
    howIWillAct: "",
    // Tracking practice: when did you notice you collapsed back into one side?
    practiceNotes: "",
    // Examples of opposites that can both be true (awareness practice)
    oppositesBothTrue: "",
  };
}

export function blankMissingLinksData(): Record<string, any> {
  return {
    entryDate: "",
    skillIntended: "",
    situation: "",
    whatHappened: "",
    // Where did the skill drop out? (the missing link)
    missingLinkType: [] as string[], // multi-select
    missingLinkNotes: "",
    // What got in the way
    barriers: "",
    // Plan to close the gap
    planStrategy: "",
    nextTimePlan: "",
    // Implementation intentions
    cueReminder: "",
  };
}

// =================== New worksheet blank templates ===================

export function blankDearManScriptData(): Record<string, any> {
  return {
    entryDate: "",
    relationship: "",
    objective: "",
    priority: "",
    // D — Describe
    describe: "",
    // E — Express
    express: "",
    // A — Assert
    assert: "",
    // R — Reinforce
    reinforce: "",
    // M — stay Mindful
    mindfulPlan: "",
    // A — Appear confident
    appearConfident: "",
    // N — Negotiate
    negotiate: "",
    // GIVE (relationship)
    givePlan: "",
    // FAST (self-respect)
    fastPlan: "",
    // Rehearsal
    anticipatedResponse: "",
    myResponseToResistance: "",
  };
}

export function blankCheckTheFactsData(): Record<string, any> {
  return {
    entryDate: "",
    emotion: "",
    intensity: 0,
    promptingEvent: "",
    interpretation: "",
    alternativeInterpretations: "",
    threatAssumed: "",
    threatReal: "",
    intensityFits: "",
    // If emotion doesn't fit
    skillToUse: "",
    // If it does fit
    problemSolving: "",
    notes: "",
  };
}

export function blankOppositeActionData(): Record<string, any> {
  return {
    entryDate: "",
    emotion: "",
    intensity: 0,
    actionUrge: "",
    fitsFacts: "",
    intensityAppropriate: "",
    oppositeAction: "",
    allTheWay: "",
    bodyLanguage: "",
    timesToRepeat: "",
    obstacles: "",
    plan: "",
  };
}

export function blankRadicalAcceptanceData(): Record<string, any> {
  return {
    entryDate: "",
    whatIAmAccepting: "",
    whyHard: "",
    willfulness: "",
    willingness: "",
    // Practice
    halfSmile: "",
    willingHands: "",
    turningMind: "",
    // Body
    bodyPractice: "",
    // Reflection
    whatChanged: "",
    notes: "",
  };
}

export function blankCrisisSurvivalTrackerData(): Record<string, any> {
  return {
    crisisDate: "",
    crisisDescription: "",
    intensity: 0,
    skillsUsed: {
      stop: false,
      tipp: false,
      prosCons: false,
      distract: false,
      selfSoothe: false,
      improve: false,
      radicalAcceptance: false,
      turningMind: false,
    },
    whatHelped: "",
    whatDidntHelp: "",
    whatIDidInstead: "",
    whatToTryNextTime: "",
    skillsListMissing: "",
  };
}

export function blankValuesToActionsData(): Record<string, any> {
  return {
    entryDate: "",
    // Step 1: List values
    valuesList: "",
    // Step 2: Pick one
    chosenValue: "",
    whyImportant: "",
    // Step 3: Set a goal
    goal: "",
    // Step 4: Action steps
    actionStep1: "",
    actionStep2: "",
    actionStep3: "",
    // Step 5: When
    when: "",
    // Step 6: Track
    progressNotes: "",
  };
}

export function blankPleasantEventsDiaryData(): Record<string, any> {
  return {
    weekStartDate: "",
    entries: Array.from({ length: 7 }, () => ({
      date: "",
      activity: "",
      emotionBefore: 0,
      emotionAfter: 0,
      present: false,
      notes: "",
    })),
  };
}

export function blankEmotionDiaryData(): Record<string, any> {
  return {
    weekStartDate: "",
    targetEmotion: "",
    entries: Array.from({ length: 7 }, () => ({
      date: "",
      trigger: "",
      intensity: 0,
      interpretation: "",
      whatIDid: "",
      whatWorked: "",
      notes: "",
    })),
  };
}

export function blankDialecticsPracticeData(): Record<string, any> {
  return {
    entryDate: "",
    relationship: "",
    positionA: "",
    trueInA: "",
    positionB: "",
    trueInB: "",
    synthesis: "",
    howIWillAct: "",
    whenSlippedBack: "",
  };
}

export function blankSelfValidationData(): Record<string, any> {
  return {
    entryDate: "",
    situation: "",
    feeling: "",
    // Level 1: Be present
    level1: "",
    // Level 2: Accurate reflection
    level2: "",
    // Level 3: Articulate what's unsaid
    level3: "",
    // Level 4: Validate based on history
    level4: "",
    // Level 5: Validate in context
    level5: "",
    // Level 6: Treat as equal
    level6: "",
    reflection: "",
  };
}

export function blankDimeGameData(): Record<string, any> {
  return {
    entryDate: "",
    situation: "",
    mode: "ask",
    factors: {
      capability: "",
      right: "",
      timing: "",
      priority: "",
      giveToGet: "",
      relationship: "",
      clarity: "",
      selfRespect: "",
      reciprocity: "",
      authority: "",
    },
    notes: "",
  };
}

export function blankCopeAheadData(): Record<string, any> {
  return {
    entryDate: "",
    situation: "",
    expectedEmotions: "",
    intensity: 0,
    skillToUse: "",
    vividImagery: "",
    rehearsal: "",
    relaxationPlan: "",
    copingPlan: "",
    obstacles: "",
    notes: "",
  };
}

// =================== Batch 10 new blank templates ===================

export function blankBuildMasteryData(): Record<string, any> {
  return {
    weekStartDate: "",
    entries: Array.from({ length: 7 }, () => ({
      date: "", activity: "", difficulty: 0, accomplished: false, notes: "",
    })),
  };
}

export function blankPleaseTrackerData(): Record<string, any> {
  return {
    weekStartDate: "",
    entries: Array.from({ length: 7 }, () => ({
      date: "",
      physicalIllness: false,
      eating: "",
      moodAltering: false,
      sleepHours: 0,
      exercise: false,
      notes: "",
    })),
  };
}

export function blankNightmareProtocolData(): Record<string, any> {
  return {
    entryDate: "",
    nightmareDescription: "",
    originalEnding: "",
    newEnding: "",
    rehearsalPlan: "",
    sleepHygienePlan: "",
    progress: "",
  };
}

export function blankMindfulnessEmotionsData(): Record<string, any> {
  return {
    entryDate: "",
    emotion: "",
    whereInBody: "",
    intensity: 0,
    waveDescription: "",
    whatIDid: "",
    whatChanged: "",
    notes: "",
  };
}

export function blankMindfulnessThoughtsData(): Record<string, any> {
  return {
    entryDate: "",
    recurringThought: "",
    howItFeels: "",
    observation: "",
    metaphor: "",
    whatHappened: "",
    notes: "",
  };
}

export function blankTurningMindWillingnessData(): Record<string, any> {
  return {
    entryDate: "",
    whatIAmAccepting: "",
    whenSlippedBack: "",
    turningBack: "",
    willfulness: "",
    willingness: "",
    whatIDid: "",
    notes: "",
  };
}

export function blankClarifyingPrioritiesData(): Record<string, any> {
  return {
    entryDate: "",
    situation: "",
    objective: "",
    relationship: "",
    selfRespect: "",
    priority: "",
    howPriorityAffectsPlan: "",
    notes: "",
  };
}

export function blankTroubleshootingIEData(): Record<string, any> {
  return {
    entryDate: "",
    situation: "",
    skillUsed: "",
    whatHappened: "",
    whatWentWrong: "",
    factorsInterfering: "",
    whatToDoDifferently: "",
    notes: "",
  };
}

export function blankValidatingOthersData(): Record<string, any> {
  return {
    entryDate: "",
    person: "",
    situation: "",
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
    whatHappened: "",
    notes: "",
  };
}

export function blankMythsEmotionsData(): Record<string, any> {
  return {
    entryDate: "",
    myth: "",
    whyItsAMyth: "",
    challenge: "",
    replacementBelief: "",
    notes: "",
  };
}

export function blankBeingEffectiveData(): Record<string, any> {
  return {
    entryDate: "",
    situation: "",
    objective: "",
    fair: "",
    apologies: "",
    values: "",
    truthful: "",
    script: "",
    reflection: "",
  };
}

export function blankWiseMindData(): Record<string, any> {
  return { entryDate: "", situation: "", emotionMind: "", reasonableMind: "", wiseMindAnswer: "", confidence: 0, bodyCue: "", practice: "", reflection: "" };
}
export function blankWhatSkillsData(): Record<string, any> {
  return { entryDate: "", situation: "", skill: "", observe: "", describe: "", participate: "", whatHappened: "", presence: 0, reflection: "" };
}
export function blankHowSkillsData(): Record<string, any> {
  return { entryDate: "", situation: "", whatSkill: "", nonjudgmental: "", oneMindful: "", effective: "", whatHappened: "", effectiveness: 0, reflection: "" };
}
export function blankLovingKindnessData(): Record<string, any> {
  return { entryDate: "", setting: "", duration: "", self: "", lovedOne: "", neutralPerson: "", difficultPerson: "", allBeings: "", wandering: "", reflection: "" };
}
export function blankBalancingDoingBeingData(): Record<string, any> {
  return { entryDate: "", currentMode: "", balance: 0, doingDescription: "", doingCost: "", beingDescription: "", beingBenefit: "", shift: "", reflection: "" };
}
export function blankStopSkillData(): Record<string, any> {
  return { entryDate: "", situation: "", aboutToDo: "", stop: "", takeStepBack: "", observe: "", proceed: "", reflection: "" };
}
export function blankTippData(): Record<string, any> {
  return { entryDate: "", situation: "", intensityBefore: 0, temperature: "", intenseExercise: "", pacedBreathing: "", pairedRelaxation: "", intensityAfter: 0, whatHappened: "", reflection: "" };
}
export function blankAcceptsData(): Record<string, any> {
  return { entryDate: "", situation: "", urgency: 0, activities: "", contributing: "", comparisons: "", emotions: "", pushingAway: "", thoughts: "", sensations: "", whatHappened: "" };
}
export function blankSelfSoothingData(): Record<string, any> {
  return { entryDate: "", situation: "", vision: "", hearing: "", smell: "", taste: "", touch: "", whatHappened: "", kitPlan: "" };
}
export function blankImproveData(): Record<string, any> {
  return { entryDate: "", situation: "", imagery: "", meaning: "", prayer: "", relaxation: "", oneThing: "", vacation: "", encouragement: "", reflection: "" };
}
export function blankHalfSmilingData(): Record<string, any> {
  return { entryDate: "", situation: "", practicingWith: "", halfSmile: "", willingHands: "", duration: "", whatShifted: "", reflection: "" };
}
export function blankEmotionModelData(): Record<string, any> {
  return { entryDate: "", emotion: "", intensity: 0, promptingEvent: "", interpretation: "", biologicalChanges: "", expressions: "", aftereffects: "", leverage: "", reflection: "" };
}
export function blankProblemSolvingData(): Record<string, any> {
  return { entryDate: "", problem: "", emotion: "", brainstorm: "", evaluate: "", chosen: "", steps: "", whatHappened: "", evaluateResult: "" };
}
export function blankPositivesShortData(): Record<string, any> {
  return { weekStartDate: "", activitiesList: "", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "", reflection: "" };
}
export function blankPositivesLongData(): Record<string, any> {
  return { entryDate: "", valuesList: "", chosenValue: "", whyImportant: "", goal: "", actionSteps: "", thisWeekAction: "", progressNotes: "", reflection: "" };
}
export function blankSleepHygieneData(): Record<string, any> {
  return { weekStartDate: "", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "", hygienePractices: "", reflection: "" };
}
export function blankExtremeEmotionsData(): Record<string, any> {
  return { entryDate: "", commonEmotions: "", warningSigns: "", dtSkills: "", erSkills: "", contacts: "", whatHappened: "", aftercare: "", reflection: "" };
}
export function blankClearMindData(): Record<string, any> {
  return { entryDate: "", currentstate: "", confidence: 0, triggers: "", complacencySigns: "", recoveryPractices: "", slipPlan: "", reflection: "" };
}
export function blankFindingPeopleData(): Record<string, any> {
  return { entryDate: "", interests: "", whereToLook: "", conversationStarters: "", howToBe: "", thisWeekStep: "", reflection: "" };
}
export function blankMindfulnessOthersData(): Record<string, any> {
  return { entryDate: "", person: "", observations: "", whatHappened: "", beyondWords: "", reflection: "" };
}
export function blankEndingRelationshipsData(): Record<string, any> {
  return { entryDate: "", relationship: "", whyEnd: "", learned: "", howToEnd: "", selfRespect: "", whatHappened: "", reflection: "" };
}
export function blankOptionsProblemsData(): Record<string, any> {
  return { entryDate: "", problem: "", optionSolve: "", optionFeelBetter: "", optionAccept: "", optionStayMiserable: "", myChoice: "" };
}
export function blankDialecticalAbstinenceData(): Record<string, any> {
  return { entryDate: "", substance: "", commitment: "", slipPlan: "", relapsePreventionPlan: "", support: "", reflection: "" };
}
export function blankBehaviorChangeData(): Record<string, any> {
  return { entryDate: "", targetBehavior: "", target: "", reinforcement: "", accidentalReward: "", extinctionPlan: "", reflection: "" };
}

export function blankData(type: WorksheetType): Record<string, any> {
  switch (type) {
    case "chain-analysis":
      return blankChainAnalysisData();
    case "pros-cons":
      return blankProsConsData();
    case "diary-card":
      return blankDiaryCardData();
    case "walking-middle-path":
      return blankWalkingMiddlePathData();
    case "missing-links":
      return blankMissingLinksData();
    case "dear-man-script":
      return blankDearManScriptData();
    case "check-the-facts":
      return blankCheckTheFactsData();
    case "opposite-action":
      return blankOppositeActionData();
    case "radical-acceptance":
      return blankRadicalAcceptanceData();
    case "crisis-survival-tracker":
      return blankCrisisSurvivalTrackerData();
    case "values-to-actions":
      return blankValuesToActionsData();
    case "pleasant-events-diary":
      return blankPleasantEventsDiaryData();
    case "emotion-diary":
      return blankEmotionDiaryData();
    case "dialectics-practice":
      return blankDialecticsPracticeData();
    case "self-validation":
      return blankSelfValidationData();
    case "dime-game":
      return blankDimeGameData();
    case "cope-ahead":
      return blankCopeAheadData();
    case "build-mastery":
      return blankBuildMasteryData();
    case "please-tracker":
      return blankPleaseTrackerData();
    case "nightmare-protocol":
      return blankNightmareProtocolData();
    case "mindfulness-emotions":
      return blankMindfulnessEmotionsData();
    case "mindfulness-thoughts":
      return blankMindfulnessThoughtsData();
    case "turning-mind-willingness":
      return blankTurningMindWillingnessData();
    case "clarifying-priorities":
      return blankClarifyingPrioritiesData();
    case "troubleshooting-ie":
      return blankTroubleshootingIEData();
    case "validating-others":
      return blankValidatingOthersData();
    case "myths-emotions":
      return blankMythsEmotionsData();
    case "being-effective":
      return blankBeingEffectiveData();
    case "wise-mind":
      return blankWiseMindData();
    case "what-skills":
      return blankWhatSkillsData();
    case "how-skills":
      return blankHowSkillsData();
    case "loving-kindness":
      return blankLovingKindnessData();
    case "balancing-doing-being":
      return blankBalancingDoingBeingData();
    case "stop-skill":
      return blankStopSkillData();
    case "tipp":
      return blankTippData();
    case "accepts":
      return blankAcceptsData();
    case "self-soothing":
      return blankSelfSoothingData();
    case "improve":
      return blankImproveData();
    case "half-smiling":
      return blankHalfSmilingData();
    case "emotion-model":
      return blankEmotionModelData();
    case "problem-solving":
      return blankProblemSolvingData();
    case "positives-short":
      return blankPositivesShortData();
    case "positives-long":
      return blankPositivesLongData();
    case "sleep-hygiene":
      return blankSleepHygieneData();
    case "extreme-emotions":
      return blankExtremeEmotionsData();
    case "clear-mind":
      return blankClearMindData();
    case "finding-people":
      return blankFindingPeopleData();
    case "mindfulness-others":
      return blankMindfulnessOthersData();
    case "ending-relationships":
      return blankEndingRelationshipsData();
    case "options-problems":
      return blankOptionsProblemsData();
    case "dialectical-abstinence":
      return blankDialecticalAbstinenceData();
    case "behavior-change":
      return blankBehaviorChangeData();
  }
}

export function defaultTitle(type: WorksheetType, date = new Date()): string {
  const dateStr = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const meta = getWorksheetTypeMeta(type);
  return `${meta.shortName} — ${dateStr}`;
}

// =================== Storage ===================

const STORAGE_KEY = "dbt-skills:worksheets";

// Tombstones record which worksheet ids have been intentionally deleted.
// Without them, the cross-device sync merge logic (see src/lib/sync.ts)
// cannot tell the difference between "entry exists locally but not on the
// server because it was just created offline on this device" and "entry
// exists locally but not on the server because *another* device deleted
// it". The merge would then resurrect the deleted entry on the next sync.
// Each tombstone is `{ id, deletedAt }` and lives under the dbt-skills:
// prefix so it flows through the same snapshot/restore/push pipeline as
// the worksheets themselves.
const TOMBSTONE_KEY = "dbt-skills:worksheet-tombstones";

// How long to keep tombstones around. After this many days a tombstone is
// considered safe to drop — every device the user actually uses will have
// seen it by then, and any device that has been offline longer than this
// is unlikely to come back with a stale entry that needs to be re-deleted.
const TOMBSTONE_TTL_DAYS = 90;

export interface WorksheetTombstone {
  id: string;
  deletedAt: string; // ISO timestamp
}

// Fire a custom event whenever local storage changes. The sync layer listens
// for this to trigger a debounced push to the server when the user is signed
// in. Safe to call on the server (no window) — the guard skips silently.
function notifyLocalChange(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("dbt-local-changed"));
  } catch {
    // ignore — this is best-effort
  }
}

function generateId(): string {
  // Prefer crypto.randomUUID when available
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function listEntries(): WorksheetEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Sort by updatedAt desc
    return parsed.sort(
      (a: WorksheetEntry, b: WorksheetEntry) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch {
    return [];
  }
}

export function getEntry(id: string): WorksheetEntry | null {
  return listEntries().find((e) => e.id === id) ?? null;
}

// ---- Tombstones ----

// Read the raw tombstone list. Returns [] on any error / missing key.
export function listTombstones(): WorksheetTombstone[] {
  try {
    const raw = localStorage.getItem(TOMBSTONE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive: drop malformed entries so a single bad tombstone doesn't
    // break the whole sync pipeline.
    return parsed.filter(
      (t): t is WorksheetTombstone =>
        !!t && typeof t === "object" && typeof t.id === "string" && typeof t.deletedAt === "string"
    );
  } catch {
    return [];
  }
}

// Convenience: just the set of tombstoned ids, for quick membership checks
// (used by the sync merge logic).
export function listTombstoneIds(): Set<string> {
  return new Set(listTombstones().map((t) => t.id));
}

// Write the tombstone array without firing a change event. Used internally
// by addTombstone / clearTombstone / pruneTombstones so they can compose
// with other writes (e.g. deleteEntry writes both worksheets and tombstones
// and fires exactly one change event at the end).
function writeTombstonesRaw(all: WorksheetTombstone[]): void {
  try {
    localStorage.setItem(TOMBSTONE_KEY, JSON.stringify(all));
  } catch {
    // ignore — quota or private mode
  }
}

// Mark a worksheet id as deleted. Idempotent — if a tombstone already exists
// for this id, we update its `deletedAt` to now (so a re-delete after a sync
// conflict still wins). Fires `dbt-local-changed` so the sync layer pushes.
export function addTombstone(id: string): void {
  const rest = listTombstones().filter((t) => t.id !== id);
  rest.push({ id, deletedAt: new Date().toISOString() });
  writeTombstonesRaw(rest);
  notifyLocalChange();
}

// Remove a tombstone (used if you ever implement "undo delete" or "restore
// from trash"). Also fires `dbt-local-changed` so the un-deletion propagates.
export function clearTombstone(id: string): void {
  const rest = listTombstones().filter((t) => t.id !== id);
  writeTombstonesRaw(rest);
  notifyLocalChange();
}

// Drop tombstones older than TOMBSTONE_TTL_DAYS. Safe to call periodically
// (e.g. on app load). Does NOT fire a change event — pruning is a
// housekeeping task, not a user action.
export function pruneTombstones(olderThanDays = TOMBSTONE_TTL_DAYS): void {
  const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
  const kept = listTombstones().filter(
    (t) => new Date(t.deletedAt).getTime() > cutoff
  );
  writeTombstonesRaw(kept);
}

export function createEntry(type: WorksheetType): WorksheetEntry {
  // Returns a new entry object WITHOUT persisting to localStorage.
  // The entry is only saved when the user actually fills in data
  // (handled by updateEntry's upsert logic).
  const now = new Date().toISOString();
  return {
    id: generateId(),
    type,
    title: defaultTitle(type),
    createdAt: now,
    updatedAt: now,
    data: blankData(type),
  };
}

export function updateEntry(
  id: string,
  updates: Partial<Pick<WorksheetEntry, "title" | "data">>,
  fallback?: WorksheetEntry
): WorksheetEntry | null {
  const all = listEntries();
  let idx = all.findIndex((e) => e.id === id);
  let base: WorksheetEntry;

  if (idx !== -1) {
    // Entry exists in storage — update it
    base = all[idx];
  } else if (fallback) {
    // Entry is a draft (not yet persisted) — insert it
    base = fallback;
    all.unshift(base);
    idx = 0;
  } else {
    return null;
  }

  const updated: WorksheetEntry = {
    ...base,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    notifyLocalChange();
  } catch (e) {
    // ignore
  }
  return updated;
}

export function deleteEntry(id: string): void {
  const all = listEntries().filter((e) => e.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    // Record a tombstone so other devices know this entry was deleted
    // intentionally. Without it, the cross-device merge logic in sync.ts
    // would see "entry exists locally on Device B but not on server" and
    // wrongly assume Device B created it offline — then push it back to
    // the server, resurrecting the deletion.
    const tombstones = listTombstones().filter((t) => t.id !== id);
    tombstones.push({ id, deletedAt: new Date().toISOString() });
    writeTombstonesRaw(tombstones);
    notifyLocalChange();
  } catch (e) {
    // ignore
  }
}
