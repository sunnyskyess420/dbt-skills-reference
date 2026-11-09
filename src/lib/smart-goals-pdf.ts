// PDF generation for SMART Goals using jsPDF.
// Same helper-driven A4 layout as goals-pdf.ts, with the SMART fields and the
// check-in record rendered as a table so a printed copy is usable in session.

import { jsPDF } from "jspdf";
import { SKILLS, MODULES } from "@/data/skills";
import {
  type SmartGoal,
  progressFor,
  smartChecks,
  isValidDateString,
} from "./smart-goals-storage";

const PAGE_MARGIN = 50;
const CONTENT_WIDTH = 595.28 - PAGE_MARGIN * 2;
const PAGE_HEIGHT = 842;
let y = 0;

function newDoc(): jsPDF {
  return new jsPDF({ unit: "pt", format: "a4" });
}

function ensureSpace(doc: jsPDF, needed: number) {
  if (y + needed > PAGE_HEIGHT - PAGE_MARGIN) {
    doc.addPage();
    y = PAGE_MARGIN;
  }
}

function writeTitle(doc: jsPDF, text: string) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  ensureSpace(doc, lines.length * 22 + 8);
  doc.text(lines, PAGE_MARGIN, y);
  y += lines.length * 22 + 8;
}

function writeSubtitle(doc: jsPDF, text: string) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  ensureSpace(doc, lines.length * 13 + 4);
  doc.text(lines, PAGE_MARGIN, y);
  y += lines.length * 13 + 4;
}

function writeSectionTitle(doc: jsPDF, text: string) {
  y += 12;
  ensureSpace(doc, 22);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text(doc.splitTextToSize(text, CONTENT_WIDTH), PAGE_MARGIN, y);
  y += 16;
}

function writeKeyValue(doc: jsPDF, label: string, value: string) {
  const text = value.trim();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(90);
  ensureSpace(doc, 12);
  doc.text(label.toUpperCase(), PAGE_MARGIN, y);
  y += 11;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(30);
  if (!text) {
    ensureSpace(doc, 15);
    doc.setTextColor(175);
    doc.text("(not filled in)", PAGE_MARGIN, y);
    y += 15;
    return;
  }
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  ensureSpace(doc, lines.length * 14 + 4);
  doc.text(lines, PAGE_MARGIN, y);
  y += lines.length * 14 + 4;
}

function writeBullets(doc: jsPDF, items: string[], prefix = "\u2022  ") {
  if (items.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(175);
    ensureSpace(doc, 14);
    doc.text("(none listed)", PAGE_MARGIN, y);
    y += 14;
    return;
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(30);
  for (const item of items) {
    const lines = doc.splitTextToSize(`${prefix}${item}`, CONTENT_WIDTH);
    ensureSpace(doc, lines.length * 14 + 3);
    doc.text(lines, PAGE_MARGIN, y);
    y += lines.length * 14 + 3;
  }
}

function writeFooter(doc: jsPDF, subtitle: string) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(
      `DBT Skills Reference · ${subtitle} · Generated ${new Date().toLocaleDateString()}`,
      PAGE_MARGIN,
      PAGE_HEIGHT - 30
    );
    doc.text(`Page ${i} of ${pageCount}`, 595.28 - PAGE_MARGIN, PAGE_HEIGHT - 30, {
      align: "right",
    });
  }
}

function sanitizeFilename(text: string, fallback: string): string {
  return (
    (text || fallback)
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || fallback
  );
}

function saveDoc(doc: jsPDF, baseName: string) {
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`${baseName}-${dateStr}.pdf`);
}

function measureLine(goal: SmartGoal): string {
  const unit = goal.measureUnit.trim() ? ` ${goal.measureUnit.trim()}` : "";
  const bits: string[] = [];
  if (goal.baseline !== null) bits.push(`start ${goal.baseline}${unit}`);
  if (goal.current !== null) bits.push(`now ${goal.current}${unit}`);
  if (goal.target !== null) bits.push(`target ${goal.target}${unit}`);
  return goal.measureName.trim()
    ? `${goal.measureName.trim()}${bits.length ? ` — ${bits.join(" → ")}` : ""}`
    : bits.join(" → ");
}

function writeGoalToDoc(doc: jsPDF, goal: SmartGoal, index: number | undefined) {
  if (index !== undefined) {
    y += 10;
    ensureSpace(doc, 18);
    doc.setDrawColor(200);
    doc.line(PAGE_MARGIN, y, PAGE_MARGIN + CONTENT_WIDTH, y);
    y += 18;
  }

  writeTitle(doc, goal.title.trim() || (index !== undefined ? `Goal ${index + 1}` : "Untitled goal"));

  const meta: string[] = [];
  if (goal.status === "done" && goal.completedAt) {
    meta.push(`Completed ${new Date(goal.completedAt).toLocaleDateString()}`);
  } else if (isValidDateString(goal.deadline)) {
    meta.push(`Deadline ${new Date(`${goal.deadline}T00:00:00`).toLocaleDateString()}`);
  }
  const progress = progressFor(goal);
  if (progress.mode !== "none") meta.push(progress.label);
  meta.push(`Review ${goal.reviewCadence}`);
  meta.push(`Created ${new Date(goal.createdAt).toLocaleDateString()}`);
  writeSubtitle(doc, meta.join("  ·  "));

  // SMART summary row
  const checks = smartChecks(goal);
  writeSubtitle(
    doc,
    `SMART ${checks.filter((c) => c.done).length}/5 — ` +
      checks.map((c) => `${c.key} ${c.done ? "yes" : "no"}`).join(" · ")
  );

  writeSectionTitle(doc, "Specific — what exactly");
  writeKeyValue(doc, "The goal", goal.specific);

  writeSectionTitle(doc, "Measurable");
  writeKeyValue(doc, "How it is measured", measureLine(goal));

  writeSectionTitle(doc, "Achievable");
  writeKeyValue(doc, "Confidence", goal.confidence > 0 ? `${goal.confidence} / 5` : "");
  writeKeyValue(doc, "Obstacles", "");
  writeBullets(doc, goal.obstacles);
  writeKeyValue(doc, "Supports", "");
  writeBullets(doc, goal.supports);

  writeSectionTitle(doc, "Relevant");
  writeKeyValue(doc, "Why this matters", goal.why);
  writeKeyValue(doc, "Value / life area", goal.value);

  writeSectionTitle(doc, "Time-bound");
  writeKeyValue(
    doc,
    "Deadline",
    isValidDateString(goal.deadline)
      ? new Date(`${goal.deadline}T00:00:00`).toLocaleDateString()
      : ""
  );

  writeSectionTitle(doc, "Plan — steps");
  if (goal.steps.length === 0) {
    writeBullets(doc, []);
  } else {
    for (const step of goal.steps) {
      writeBullets(doc, [step.text], step.done ? "[x]  " : "[ ]  ");
    }
  }

  writeSectionTitle(doc, "Record — check-ins");
  if (goal.checkIns.length === 0) {
    writeBullets(doc, []);
  } else {
    for (const c of goal.checkIns) {
      const when = new Date(c.at).toLocaleString();
      const unit = goal.measureUnit.trim() ? ` ${goal.measureUnit.trim()}` : "";
      const reading = c.value !== null ? `${c.value}${unit}` : "";
      const head = [when, reading].filter(Boolean).join("  ·  ");
      const body = c.note ? `${head}\n${c.note}` : head;
      writeBullets(doc, [body], "\u2022  ");
    }
  }

  if (goal.skills.length > 0) {
    writeSectionTitle(doc, "Skills that can help");
    for (const link of goal.skills) {
      const skill = SKILLS.find((s) => s.id === link.skillId);
      if (!skill) continue;
      const mod = MODULES.find((m) => m.id === skill.module);
      const acronym = skill.acronym ? ` (${skill.acronym})` : "";
      const modLabel = mod ? ` [${mod.short}]` : "";
      writeKeyValue(
        doc,
        `${skill.name}${acronym}${modLabel}`,
        link.reason || skill.oneLiner
      );
    }
  }
}

/** Export one goal to its own PDF. */
export function exportSmartGoalToPdf(goal: SmartGoal) {
  const doc = newDoc();
  y = PAGE_MARGIN;
  writeGoalToDoc(doc, goal, undefined);
  writeFooter(doc, "SMART Goals");
  saveDoc(doc, sanitizeFilename(goal.title, "smart-goal"));
}

/** Export every goal (active + archive) in one PDF. */
export function exportAllSmartGoalsToPdf(goals: SmartGoal[]) {
  const usable = goals.filter(
    (g) => g.title.trim() || g.specific.trim() || g.measureName.trim() || g.steps.length > 0
  );
  if (usable.length === 0) return;

  const doc = newDoc();
  y = PAGE_MARGIN;
  writeTitle(doc, "SMART Goals");
  writeSubtitle(
    doc,
    `${usable.length} goal${usable.length === 1 ? "" : "s"} · Generated ${new Date().toLocaleString()}`
  );
  y += 10;

  usable.forEach((goal, i) => writeGoalToDoc(doc, goal, i));

  writeFooter(doc, "SMART Goals");
  saveDoc(doc, "smart-goals");
}
