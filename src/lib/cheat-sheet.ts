// Cheat sheet — a compressed, print-friendly view of the skill library.
//
// This intentionally contains no new DBT text: every row is derived from the
// paraphrased entries already in `src/data/skills.ts`, trimmed to the shortest
// useful form (the letter or keyword plus its first clause). The full entry is
// always one click away, which is what keeps the sheet honest — it points at
// the library rather than replacing it.
//
// Nothing here reproduces handout text from Linehan (2014); see NOTICE.md.

import { SKILLS, type Module, type Skill } from "@/data/skills";

export interface CheatRow {
  /** Acronym letter or keyword, when the step provides one. */
  label: string | null;
  /** Short gloss, already trimmed. */
  text: string;
}

export type CheatBlockKind = "acronym" | "rows" | "one";

export interface CheatBlock {
  skillId: string;
  name: string;
  acronym?: string;
  module: Module;
  kind: CheatBlockKind;
  rows: CheatRow[];
  oneLiner: string;
  pages?: string;
}

export interface CheatSection {
  id: string;
  title: string;
  subtitle: string;
  module: Module;
  blocks: CheatBlock[];
}

/** Max characters for a gloss before it is cut at a word boundary. */
const MAX_GLOSS = 68;

/** Drop parenthetical asides — they are detail, not cheat-sheet material. */
function stripParentheticals(text: string): string {
  return text.replace(/\s*\([^)]*\)/g, "").replace(/\s{2,}/g, " ");
}

function firstClause(raw: string): string {
  let text = stripParentheticals(raw.trim());
  // Stop at the first finished sentence or clause break: "Stop. Literally
  // freeze" → "Stop". A short guard keeps abbreviations like "e.g." intact.
  const cut = text.search(/\.\s|;/);
  if (cut >= 3) text = text.slice(0, cut);
  // Cut at a long dash only when the left side stands on its own
  // ("savor something slowly — tea…" but not "If no — identify…").
  const dash = text.search(/\s[\u2014\u2013-]\s/);
  if (dash >= 15) text = text.slice(0, dash);
  // A long gloss reads better cut at its first comma than mid-word.
  const comma = text.indexOf(", ");
  if (text.length > 48 && comma > 20) text = text.slice(0, comma);
  text = text.trim().replace(/[.,;:]$/, "");
  if (text.length <= MAX_GLOSS) return text;
  const slice = text.slice(0, MAX_GLOSS);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 30 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

const LETTER_STEP_RE = /^([A-Z](?:\s?[A-Z])?)\s*[\u2014\u2013-]\s*(.+)$/;
const KEYWORD_STEP_RE = /^([A-Za-z][A-Za-z' /-]{0,28}):\s*(.+)$/;

/** Turn one `steps[]` entry into a cheat-sheet row. */
export function rowFromStep(raw: string): CheatRow {
  const step = raw.trim();

  // "T — Temperature: cold water…" → letter + keyword only.
  const letter = LETTER_STEP_RE.exec(step);
  if (letter) {
    const body = letter[2];
    const colon = body.indexOf(":");
    const keyword = colon > 0 ? body.slice(0, colon) : body;
    return { label: letter[1].replace(/\s/g, ""), text: firstClause(keyword) };
  }

  // "Observe: notice the experience…" → keyword + first clause of the gloss.
  const keyword = KEYWORD_STEP_RE.exec(step);
  if (keyword) {
    // "Ask: is this interpretation…" reads better as one clause than as a
    // repeated "Ask" label on four consecutive rows.
    if (keyword[1].toLowerCase() === "ask") {
      return { label: null, text: firstClause(`${keyword[1]}: ${keyword[2]}`) };
    }
    return { label: keyword[1], text: firstClause(keyword[2]) };
  }

  return { label: null, text: firstClause(step) };
}

interface BlockConfig {
  id: string;
  kind: CheatBlockKind;
  /** How many steps to show (rows/acronym only). */
  limit?: number;
  /** Override the display name when the full one is too long for the sheet. */
  name?: string;
}

interface SectionConfig {
  id: string;
  title: string;
  subtitle: string;
  module: Module;
  blocks: BlockConfig[];
}

// Order follows the sheet most groups hand out: mindfulness first, then
// emotion regulation, distress tolerance, interpersonal effectiveness.
const CONFIG: SectionConfig[] = [
  {
    id: "mindfulness",
    title: "Mindfulness",
    subtitle: "The WHAT and HOW skills",
    module: "mindfulness",
    blocks: [
      { id: "what-skills", kind: "rows", limit: 3, name: "WHAT skills" },
      { id: "how-skills", kind: "rows", limit: 3, name: "HOW skills" },
      { id: "walking-the-middle-path", kind: "one" },
    ],
  },
  {
    id: "emotion-regulation",
    title: "Emotion Regulation",
    subtitle: "Change the emotion, reduce vulnerability",
    module: "emotion-regulation",
    blocks: [
      { id: "please", kind: "acronym" },
      { id: "check-the-facts", kind: "rows", limit: 5 },
      { id: "opposite-action", kind: "rows", limit: 4 },
      {
        id: "accumulate-positive-emotions-short-term",
        kind: "one",
        name: "Accumulate positives — short term",
      },
      {
        id: "accumulate-positive-emotions-long-term",
        kind: "one",
        name: "Accumulate positives — long term",
      },
      { id: "build-mastery", kind: "one" },
      { id: "cope-ahead", kind: "one" },
      { id: "mindfulness-of-current-emotions", kind: "one", name: "Mindfulness of current emotions" },
    ],
  },
  {
    id: "distress-tolerance",
    title: "Distress Tolerance",
    subtitle: "Survive the moment without making it worse",
    module: "distress-tolerance",
    blocks: [
      { id: "tipp", kind: "acronym" },
      { id: "stop", kind: "acronym", name: "STOP" },
      { id: "distracting-accepts", kind: "acronym", name: "ACCEPTS" },
      { id: "improve-the-moment", kind: "acronym", name: "IMPROVE" },
      { id: "self-soothing", kind: "rows", limit: 5, name: "Self-soothe — five senses" },
      { id: "radical-acceptance", kind: "rows", limit: 3 },
      { id: "pros-and-cons", kind: "one" },
      { id: "turning-the-mind", kind: "one" },
      { id: "willingness", kind: "one" },
    ],
  },
  {
    id: "interpersonal",
    title: "Interpersonal Effectiveness",
    subtitle: "Ask, say no, keep the relationship",
    module: "interpersonal",
    blocks: [
      { id: "dear-man", kind: "acronym" },
      { id: "give", kind: "acronym", name: "GIVE" },
      { id: "fast", kind: "acronym", name: "FAST" },
      { id: "dime-game", kind: "one", name: "The Dime Game" },
      { id: "validation", kind: "one" },
      { id: "dialectics", kind: "one" },
    ],
  },
];

function toBlock(skill: Skill, config: BlockConfig): CheatBlock {
  const rows =
    config.kind === "one"
      ? []
      : (skill.steps ?? []).slice(0, config.limit ?? 8).map(rowFromStep);

  return {
    skillId: skill.id,
    name: config.name ?? skill.name,
    acronym: skill.acronym,
    module: skill.module,
    kind: config.kind,
    rows,
    oneLiner: skill.oneLiner,
    pages: skill.pages,
  };
}

/**
 * Build the cheat-sheet sections from the skill catalog.
 * Unknown skill ids are skipped rather than throwing — the sheet is a view,
 * and a renamed skill should never take the page down.
 */
export function buildCheatSheet(config: SectionConfig[] = CONFIG): CheatSection[] {
  return config
    .map((section) => ({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      module: section.module,
      blocks: section.blocks.flatMap((blockConfig) => {
        const skill = SKILLS.find((s) => s.id === blockConfig.id);
        return skill ? [toBlock(skill, blockConfig)] : [];
      }),
    }))
    .filter((section) => section.blocks.length > 0);
}

/** Wise Mind figure text. Short glosses, in our own words. */
export const WISE_MIND_GLOSSES = [
  { key: "reasonable", label: "Reasonable Mind", text: "Facts, logic, planning" },
  { key: "emotion", label: "Emotion Mind", text: "Feelings, urges, intensity" },
  { key: "wise", label: "Wise Mind", text: "Both, held together" },
] as const;
