// Book page-number index for the DBT skills reference.
//
// Every skill and worksheet template in this app already carries a printed
// page number from Linehan (2014), "DBT Skills Training Handouts and
// Worksheets, Second Edition" — e.g. "p. 9", "pp. 20-21", "p. 53+".
//
// This module turns those strings into a searchable page -> content index so
// the app can answer "what is on page 174?" and jump straight to it. It also
// mirrors the common group-therapy vocabulary ("Handout 11", "Worksheet 9a")
// so a facilitator can search the way they actually speak.
//
// Deliberately dependency-free: only type-only imports (erased at build/run),
// so the logic can be unit-tested in plain Node with
// `node --experimental-strip-types`.

import type { Skill, Module } from "@/data/skills";
import type { WorksheetTypeMeta } from "@/lib/worksheet-storage";

export type PageHitKind = "skill" | "worksheet";

/** A parsed "p. 9" / "pp. 20-21" / "p. 53+" reference. */
export interface ParsedPageRef {
  start: number;
  end: number;
  /** true for "p. 53+" — matches that page and anything after it. */
  openEnded: boolean;
  raw: string;
}

/** One indexable piece of content that lives on a printed book page. */
export interface PageHit {
  kind: PageHitKind;
  /** Skill id or worksheet-type id — routes the selection on click. */
  id: string;
  name: string;
  module: Module;
  moduleName: string;
  /** Skill category, or the worksheet's short name. */
  category: string;
  /** Handout / worksheet cross-reference, e.g. "General Worksheet 2". */
  reference: string;
  /** Raw page string as authored, e.g. "pp. 174-175". */
  pageRef: string;
  start: number;
  end: number;
  openEnded: boolean;
  /** One-line summary shown under the title. */
  summary: string;
}

/** A user query that looks like a page number ("42", "p42", "pp. 20-21"). */
export interface PageQuery {
  start: number;
  end: number;
  label: string;
}

export interface PageIndex {
  hits: PageHit[];
  /** Every distinct page that has content, ascending. */
  pages: number[];
  minPage: number;
  maxPage: number;
  /** Content on exactly this page (open-ended refs match their anchor page). */
  lookup: (page: number) => PageHit[];
  /** Content overlapping the inclusive range [start, end]. */
  lookupRange: (start: number, end: number) => PageHit[];
  /** Closest indexed pages to `page`, nearest first (for "did you mean"). */
  nearestPages: (page: number, limit?: number) => number[];
}

/** Fallback module labels; the app passes its canonical MODULES names in. */
export const MODULE_LABELS: Record<Module, string> = {
  general: "General Skills",
  mindfulness: "Mindfulness Skills",
  interpersonal: "Interpersonal Effectiveness Skills",
  "emotion-regulation": "Emotion Regulation Skills",
  "distress-tolerance": "Distress Tolerance Skills",
};

const PAGE_REF_RE = /(?:pages?|pp?|pg)\.?\s*(\d+)(?:\s*[-–—]\s*(\d+))?(\s*\+)?/i;
const BARE_NUMBER_RE = /^\s*(\d+)(?:\s*[-–—]\s*(\d+))?\s*(\+)?\s*$/;

/** Parse a raw page string into numbers. Returns null when unparseable. */
export function parsePageRef(raw: string | undefined | null): ParsedPageRef | null {
  if (!raw) return null;
  const match = PAGE_REF_RE.exec(raw) ?? BARE_NUMBER_RE.exec(raw);
  if (!match) return null;
  const start = Number(match[1]);
  if (!Number.isFinite(start)) return null;
  const end = match[2] ? Number(match[2]) : start;
  return {
    start,
    end: Math.max(start, end),
    openEnded: Boolean(match[3]),
    raw: raw.trim(),
  };
}

/**
 * Interpret free text as a page query. Accepts "42", "p. 42", "page 42",
 * "pp. 20-21", "20-21", "20 to 21". Returns null when it is not a page query
 * (so callers can fall back to normal text search).
 */
export function parsePageQuery(query: string): PageQuery | null {
  if (!query) return null;
  const cleaned = query
    .trim()
    .toLowerCase()
    .replace(/^(?:pages|page|pgs|pg|pp|p)\.?\s*/, "");
  const match = /^(\d{1,4})(?:\s*(?:[-–—]|to)\s*(\d{1,4}))?$/.exec(cleaned);
  if (!match) return null;
  const a = Number(match[1]);
  const b = match[2] ? Number(match[2]) : a;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  const start = Math.min(a, b);
  const end = Math.max(a, b);
  return { start, end, label: start === end ? `p. ${start}` : `pp. ${start}–${end}` };
}

export function isPageQuery(query: string): boolean {
  return parsePageQuery(query) !== null;
}

/** Infer a module from a worksheet's book reference (no worksheet metadata). */
export function moduleFromReference(reference: string): { module: Module; name: string } {
  const r = (reference || "").toLowerCase();
  if (r.startsWith("mindfulness")) return { module: "mindfulness", name: MODULE_LABELS.mindfulness };
  if (r.startsWith("interpersonal")) return { module: "interpersonal", name: MODULE_LABELS.interpersonal };
  if (r.startsWith("emotion regulation")) return { module: "emotion-regulation", name: MODULE_LABELS["emotion-regulation"] };
  if (r.startsWith("distress tolerance")) return { module: "distress-tolerance", name: MODULE_LABELS["distress-tolerance"] };
  return { module: "general", name: MODULE_LABELS.general };
}

/** Collapse a list of page numbers into compact ranges: [9,10,11,14] -> "9–11, 14". */
export function formatPageRanges(nums: number[]): string {
  const sorted = Array.from(new Set(nums)).sort((a, b) => a - b);
  if (sorted.length === 0) return "";
  const parts: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const n = sorted[i];
    if (n === prev + 1) {
      prev = n;
      continue;
    }
    parts.push(start === prev ? `${start}` : `${start}–${prev}`);
    start = n;
    prev = n;
  }
  parts.push(start === prev ? `${start}` : `${start}–${prev}`);
  return parts.join(", ");
}

/** Build the page -> content index from the app's skills and worksheets. */
export function buildPageIndex(
  skills: Skill[],
  worksheets: WorksheetTypeMeta[],
  moduleNames: Record<Module, string> = MODULE_LABELS
): PageIndex {
  const hits: PageHit[] = [];

  for (const skill of skills) {
    const ref = parsePageRef(skill.pages);
    if (!ref) continue;
    hits.push({
      kind: "skill",
      id: skill.id,
      name: skill.name,
      module: skill.module,
      moduleName: moduleNames[skill.module] ?? skill.module,
      category: skill.category,
      reference: skill.reference,
      pageRef: ref.raw,
      start: ref.start,
      end: ref.end,
      openEnded: ref.openEnded,
      summary: skill.oneLiner,
    });
  }

  for (const worksheet of worksheets) {
    const ref = parsePageRef(worksheet.pages);
    if (!ref) continue;
    const mod = moduleFromReference(worksheet.reference);
    hits.push({
      kind: "worksheet",
      id: worksheet.id,
      name: worksheet.name,
      module: mod.module,
      moduleName: moduleNames[mod.module] ?? mod.name,
      category: worksheet.shortName,
      reference: worksheet.reference,
      pageRef: ref.raw,
      start: ref.start,
      end: ref.end,
      openEnded: ref.openEnded,
      summary: worksheet.description,
    });
  }

  hits.sort(
    (a, b) =>
      a.start - b.start ||
      a.kind.localeCompare(b.kind) ||
      a.name.localeCompare(b.name)
  );

  const covered = new Set<number>();
  for (const hit of hits) {
    // Open-ended refs ("p. 53+") register their anchor page only; lookup()
    // still matches every later page.
    for (let p = hit.start; p <= hit.end; p++) covered.add(p);
  }
  const pages = Array.from(covered).sort((a, b) => a - b);

  const lookup = (page: number): PageHit[] =>
    hits.filter((hit) =>
      // An open-ended ref like "p. 230+" is anchored to its printed page; we
      // do not fan it out across every later page (that would put the same
      // chapter-range item on nearly every result list).
      hit.openEnded
        ? page === hit.start
        : page >= hit.start && page <= hit.end
    );

  const lookupRange = (start: number, end: number): PageHit[] => {
    const lo = Math.min(start, end);
    const hi = Math.max(start, end);
    return hits.filter((hit) =>
      hit.openEnded
        ? hit.start >= lo && hit.start <= hi
        : hit.start <= hi && hit.end >= lo
    );
  };

  const nearestPages = (page: number, limit = 3): number[] =>
    pages
      .filter((p) => p !== page) // nearest *other* indexed pages
      .sort((a, b) => Math.abs(a - page) - Math.abs(b - page) || a - b)
      .slice(0, limit);

  return {
    hits,
    pages,
    minPage: pages.length ? pages[0] : 0,
    maxPage: pages.length ? pages[pages.length - 1] : 0,
    lookup,
    lookupRange,
    nearestPages,
  };
}

const REF_QUERY_RE = /\b(handouts?|worksheets?)\s*([0-9]+[a-z]?)\b/i;

/** True when the query names a handout/worksheet, e.g. "worksheet 9a". */
export function isReferenceQuery(query: string): boolean {
  return REF_QUERY_RE.test(query);
}

/**
 * Match hits whose book reference names the same handout/worksheet number,
 * so "DT Worksheet 6" or "handout 5" finds the right page.
 */
export function findByReference(hits: PageHit[], query: string): PageHit[] {
  const match = REF_QUERY_RE.exec(query);
  if (!match) return [];
  const word = match[1].toLowerCase().startsWith("handout") ? "handout" : "worksheet";
  const num = match[2];
  const re = new RegExp(`${word}s?\\s*${num}(?![0-9a-z])`, "i");
  return hits.filter((hit) => re.test(hit.reference));
}

/** One-line description used in result rows and "did you mean" hints. */
export function describeHit(hit: PageHit): string {
  const kindLabel = hit.kind === "skill" ? "Skill" : "Worksheet";
  return `${kindLabel} · ${hit.moduleName} · ${hit.pageRef} · ${hit.reference}`;
}
