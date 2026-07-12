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
  | "dime-game";

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
  icon: string; // lucide icon name (we map in component)
  reference: string; // book cross-reference
  color: string; // tailwind class
}

export const WORKSHEET_TYPES: WorksheetTypeMeta[] = [
  {
    id: "chain-analysis",
    name: "Chain Analysis",
    shortName: "Chain Analysis",
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
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "walking-middle-path",
    name: "Walking the Middle Path (Dialectics)",
    shortName: "Middle Path",
    description:
      "Identify two opposing positions, find what's true in each, and articulate a synthesis that integrates both. The core dialectical thinking skill.",
    icon: "GitMerge",
    reference: "Mindfulness Worksheets 10, 10a, 10b / IE Worksheets 11–11b (Handouts 10, 15, 16)",
    color: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "missing-links",
    name: "Missing-Links Analysis (Behavior Analysis)",
    shortName: "Missing-Links",
    description:
      "When you knew a skill that would have helped but didn't use it: find the precise gap between knowing and doing, and plan a strategy to close it.",
    icon: "Unplug",
    reference: "General Handout 8 / General Worksheet 3",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "dear-man-script",
    name: "DEAR MAN Script",
    shortName: "DEAR MAN",
    description:
      "Write out a full interpersonal effectiveness script before a difficult conversation: Describe, Express, Assert, Reinforce, stay Mindful, Appear confident, Negotiate.",
    icon: "MessageSquareText",
    reference: "IE Handout 5a / IE Worksheet 4",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "check-the-facts",
    name: "Check the Facts",
    shortName: "Check the Facts",
    description:
      "Walk through whether your emotion and its intensity fit the situation: what happened, your interpretation, alternative interpretations, and whether the threat is real.",
    icon: "SearchCheck",
    reference: "ER Handouts 8, 8a / ER Worksheet 5",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "opposite-action",
    name: "Opposite Action",
    shortName: "Opposite Action",
    description:
      "Identify an emotion, its action urge, whether it fits the facts, and plan the opposite action step-by-step. The core skill for changing unwanted emotions.",
    icon: "FlipHorizontal",
    reference: "ER Handouts 9-11 / ER Worksheet 7",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "radical-acceptance",
    name: "Radical Acceptance Practice",
    shortName: "Radical Acceptance",
    description:
      "Guided steps for practicing radical acceptance of a specific situation: what you're accepting, what makes it hard, willingness, half-smile, turning the mind.",
    icon: "HeartHandshake",
    reference: "DT Handouts 11, 11b / DT Worksheets 9, 9a",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "crisis-survival-tracker",
    name: "Crisis Survival Skills Tracker",
    shortName: "Crisis Tracker",
    description:
      "After a crisis, check off which survival skills you used (STOP, TIPP, Pros/Cons, Distract, Self-Soothe, IMPROVE) and what worked. Helps you learn what helps.",
    icon: "ShieldCheck",
    reference: "DT Handouts 2-9a / DT Worksheet 1",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "values-to-actions",
    name: "Values to Action Steps",
    shortName: "Values to Actions",
    description:
      "Identify your top values, pick one, break it into concrete weekly action steps. Directly builds a life worth living.",
    icon: "Target",
    reference: "ER Handouts 17-18 / ER Worksheets 11, 11a, 11b",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "pleasant-events-diary",
    name: "Pleasant Events Diary",
    shortName: "Pleasant Events",
    description:
      "Track one pleasant activity per day and rate your emotion before and after. Builds the 'accumulate positive emotions' skill.",
    icon: "Smile",
    reference: "ER Handout 15 / ER Worksheet 10",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "emotion-diary",
    name: "Emotion Diary (Single Emotion)",
    shortName: "Emotion Diary",
    description:
      "Track one specific emotion (e.g., anger, shame) across a week: triggers, intensity, what you did, what worked. More detailed than the diary card for a single emotion.",
    icon: "Activity",
    reference: "ER Handout 3 / ER Worksheet 2b",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "dialectics-practice",
    name: "Dialectics Practice",
    shortName: "Dialectics",
    description:
      "Practice finding the synthesis between two opposing positions in a specific relationship conflict. Similar to Walking the Middle Path but focused on one relationship.",
    icon: "GitMerge",
    reference: "IE Handouts 15-16 / IE Worksheet 11",
    color: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "self-validation",
    name: "Self-Validation Practice",
    shortName: "Self-Validation",
    description:
      "Practice the 6 levels of validation on yourself, for when you're being harsh with yourself about a feeling you're having.",
    icon: "HeartPulse",
    reference: "IE Handouts 17-19 / IE Worksheet 13",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "dime-game",
    name: "The Dime Game (Intensity of Asking or Saying No)",
    shortName: "Dime Game",
    description:
      "Interactive decision tool: answer 10 questions about your situation to figure out how intensely to ask for what you want or how firmly to say no. Live score calculation.",
    icon: "Coins",
    reference: "IE Handout 8 / IE Worksheet 6",
    color: "text-amber-600 dark:text-amber-400",
  },
];

export function getWorksheetTypeMeta(type: WorksheetType): WorksheetTypeMeta {
  return WORKSHEET_TYPES.find((w) => w.id === type)!;
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
  const days = [];
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
    // "ask" or "sayno"
    mode: "ask",
    // 10 factors, each: "yes" | "no" | "maybe"
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

export function createEntry(type: WorksheetType): WorksheetEntry {
  const now = new Date().toISOString();
  const entry: WorksheetEntry = {
    id: generateId(),
    type,
    title: defaultTitle(type),
    createdAt: now,
    updatedAt: now,
    data: blankData(type),
  };
  const all = listEntries();
  all.push(entry);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    // ignore
  }
  return entry;
}

export function updateEntry(
  id: string,
  updates: Partial<Pick<WorksheetEntry, "title" | "data">>
): WorksheetEntry | null {
  const all = listEntries();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const updated: WorksheetEntry = {
    ...all[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    // ignore
  }
  return updated;
}

export function deleteEntry(id: string): void {
  const all = listEntries().filter((e) => e.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    // ignore
  }
}
