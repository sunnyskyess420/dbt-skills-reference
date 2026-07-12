// Worksheet definitions, schemas, and localStorage CRUD.
// References the printed Linehan (2014) worksheets by number.

export type WorksheetType = "chain-analysis" | "pros-cons" | "diary-card";

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

export function blankData(type: WorksheetType): Record<string, any> {
  switch (type) {
    case "chain-analysis":
      return blankChainAnalysisData();
    case "pros-cons":
      return blankProsConsData();
    case "diary-card":
      return blankDiaryCardData();
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
