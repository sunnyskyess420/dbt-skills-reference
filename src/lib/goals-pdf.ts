// PDF generation for My Goals using jsPDF.
// Mirrors the worksheet-pdf.ts pattern: client-side, A4, helper-driven layout.
// Two entry points:
//   - exportGoalToPdf(goal)   — single goal to its own PDF
//   - exportAllGoalsToPdf(goals) — every goal in one PDF (one section per goal)

import { jsPDF } from "jspdf";
import { SKILLS, MODULES } from "@/data/skills";
import { type Goal } from "./goals-storage";

// ============ Helpers ============

const PAGE_MARGIN = 50; // points (0.7 inch)
const CONTENT_WIDTH = 595.28 - PAGE_MARGIN * 2; // A4 width in points
const PAGE_HEIGHT = 842; // A4 height in points
let y = 0; // current y position, reset per export

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

function writeSectionTitle(doc: jsPDF, num: number | undefined, text: string) {
  y += 14;
  ensureSpace(doc, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20);
  const prefix = num !== undefined ? `${num}. ` : "";
  const lines = doc.splitTextToSize(`${prefix}${text}`, CONTENT_WIDTH);
  ensureSpace(doc, lines.length * 16 + 4);
  doc.text(lines, PAGE_MARGIN, y);
  y += lines.length * 16 + 4;
}

function writeLabel(doc: jsPDF, label: string) {
  ensureSpace(doc, 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(label.toUpperCase(), PAGE_MARGIN, y);
  y += 12;
}

function writeValue(doc: jsPDF, value: string | undefined, opts?: { italic?: boolean }) {
  const text = (value ?? "").trim();
  doc.setFont("helvetica", opts?.italic ? "italic" : "normal");
  doc.setFontSize(11);
  doc.setTextColor(30);
  if (!text) {
    ensureSpace(doc, 16);
    doc.setTextColor(180);
    doc.text("(blank)", PAGE_MARGIN, y);
    y += 16;
    return;
  }
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  ensureSpace(doc, lines.length * 14 + 4);
  doc.text(lines, PAGE_MARGIN, y);
  y += lines.length * 14 + 4;
}

function writeKeyValue(doc: jsPDF, label: string, value: string | undefined) {
  writeLabel(doc, label);
  writeValue(doc, value);
  y += 6;
}

function writeBullet(doc: jsPDF, text: string, opts?: { done?: boolean; indent?: number }) {
  const indent = opts?.indent ?? 0;
  const prefix = opts?.done ? "[x]  " : "[ ]  ";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(30);
  const lines = doc.splitTextToSize(`${prefix}${text}`, CONTENT_WIDTH - indent);
  ensureSpace(doc, lines.length * 14 + 4);
  doc.text(lines, PAGE_MARGIN + indent, y);
  y += lines.length * 14 + 4;
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

// ============ Per-goal generator ============

function moduleMeta(moduleId: string) {
  return MODULES.find((m) => m.id === moduleId);
}

/**
 * Render a single goal into the current doc at the current y position.
 * Used by both exportGoalToPdf (single-goal PDF) and exportAllGoalsToPdf
 * (multi-goal PDF — adds a divider between goals).
 */
function writeGoalToDoc(doc: jsPDF, goal: Goal, index: number | undefined) {
  // Divider when rendering multiple goals
  if (index !== undefined) {
    y += 10;
    ensureSpace(doc, 20);
    doc.setDrawColor(200);
    doc.line(PAGE_MARGIN, y, PAGE_MARGIN + CONTENT_WIDTH, y);
    y += 20;
  }

  const title = goal.title.trim() || (index !== undefined ? `Goal ${index + 1}` : "Untitled goal");
  writeTitle(doc, title);

  const metaBits: string[] = [];
  if (goal.targetDate.trim()) metaBits.push(`Target: ${goal.targetDate.trim()}`);
  metaBits.push(
    `Created ${new Date(goal.createdAt).toLocaleDateString()} · Last edited ${new Date(
      goal.updatedAt
    ).toLocaleString()}`
  );
  writeSubtitle(doc, metaBits.join("  ·  "));

  if (goal.description.trim()) {
    writeSectionTitle(doc, undefined, "What this goal is about");
    writeValue(doc, goal.description, { italic: true });
  }

  if (goal.groupSupport.trim()) {
    writeSectionTitle(doc, undefined, "How my group / therapist can support me");
    writeValue(doc, goal.groupSupport);
  }

  // ----- AI / offline breakdown -----
  const g = goal.guidance;
  if (g) {
    writeSectionTitle(doc, undefined, "Breakdown");
    writeLabel(doc, `Source: ${g.source === "ai" ? "AI" : "Offline template"} · Generated ${new Date(g.generatedAt).toLocaleString()}`);
    if (g.summary.trim()) writeValue(doc, g.summary, { italic: true });
    if (g.obstacles?.trim()) {
      writeLabel(doc, "Watch out for");
      writeValue(doc, g.obstacles);
    }
    if (g.progressSignals && g.progressSignals.length > 0) {
      writeLabel(doc, "Signs of progress");
      g.progressSignals.forEach((sig) => writeBullet(doc, sig, { done: false }));
    }
    if (g.steps.length > 0) {
      writeLabel(doc, "Suggested steps (not yet added)");
      g.steps.forEach((s) => {
        writeBullet(doc, s.text);
        if (s.hint) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          doc.setTextColor(120);
          const lines = doc.splitTextToSize(s.hint, CONTENT_WIDTH - 24);
          ensureSpace(doc, lines.length * 11 + 2);
          doc.text(lines, PAGE_MARGIN + 24, y);
          y += lines.length * 11 + 2;
        }
      });
    }
  }

  // ----- Checklist (current steps) -----
  writeSectionTitle(doc, undefined, "My steps");
  if (goal.steps.length === 0) {
    writeValue(doc, "No steps yet.");
  } else {
    const doneCount = goal.steps.filter((s) => s.done).length;
    writeSubtitle(doc, `${doneCount} of ${goal.steps.length} done`);
    goal.steps.forEach((s) => writeBullet(doc, s.text, { done: s.done }));
  }

  // ----- Suggested skills -----
  writeSectionTitle(doc, undefined, "Skills that can help");
  if (goal.skills.length === 0) {
    writeValue(doc, "No skill suggestions yet.");
  } else {
    goal.skills.forEach((link) => {
      const skill = SKILLS.find((s) => s.id === link.skillId);
      if (!skill) return;
      const mod = moduleMeta(skill.module);
      const modLabel = mod ? ` [${mod.short}]` : "";
      const acronym = skill.acronym ? ` (${skill.acronym})` : "";
      writeLabel(doc, `${skill.name}${acronym}${modLabel}`);
      writeValue(doc, link.reason || skill.oneLiner);
    });
  }
}

// ============ Public entry points ============

/**
 * Export a single goal as a PDF.
 */
export function exportGoalToPdf(goal: Goal) {
  const doc = newDoc();
  y = PAGE_MARGIN;
  writeGoalToDoc(doc, goal, undefined);
  writeFooter(doc, "My Goals");
  saveDoc(doc, sanitizeFilename(goal.title, "goal"));
}

/**
 * Export every goal as a single combined PDF. Goals with no title and no
 * description are skipped so the file isn't padded with empty slots.
 */
export function exportAllGoalsToPdf(goals: Goal[]) {
  const usable = goals.filter(
    (g) => g.title.trim() || g.description.trim() || g.steps.length > 0
  );
  if (usable.length === 0) return;

  const doc = newDoc();
  y = PAGE_MARGIN;

  // Cover-style header
  writeTitle(doc, "My Goals");
  writeSubtitle(
    doc,
    `${usable.length} goal${usable.length === 1 ? "" : "s"} · Generated ${new Date().toLocaleString()}`
  );
  y += 12;

  usable.forEach((goal, i) => {
    writeGoalToDoc(doc, goal, i);
  });

  writeFooter(doc, "My Goals");
  saveDoc(doc, "my-goals");
}
