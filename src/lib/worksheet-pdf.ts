// PDF generation for worksheets using jsPDF.
// Each worksheet type has a dedicated generator function.
// All generation is client-side.

import { jsPDF } from "jspdf";
import {
  type WorksheetEntry,
  getWorksheetTypeMeta,
} from "./worksheet-storage";

// ============ Helpers ============

const PAGE_MARGIN = 50; // points (0.7 inch)
const CONTENT_WIDTH = 595.28 - PAGE_MARGIN * 2; // A4 width in points
let y = 0; // current y position

function newDoc(): jsPDF {
  return new jsPDF({ unit: "pt", format: "a4" });
}

function ensureSpace(doc: jsPDF, needed: number) {
  if (y + needed > 842 - PAGE_MARGIN) {
    // A4 height 842pt
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
  ensureSpace(doc, 16);
  doc.text(text, PAGE_MARGIN, y);
  y += 16;
}

function writeSectionTitle(doc: jsPDF, num: number | undefined, text: string) {
  y += 14;
  ensureSpace(doc, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20);
  const prefix = num !== undefined ? `${num}. ` : "";
  doc.text(`${prefix}${text}`, PAGE_MARGIN, y);
  y += 16;
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

function writeFooter(doc: jsPDF, entry: WorksheetEntry) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(
      `DBT Skills Reference · ${getWorksheetTypeMeta(entry.type).name} · Created ${new Date(
        entry.createdAt
      ).toLocaleDateString()}`,
      PAGE_MARGIN,
      820
    );
    doc.text(`Page ${i} of ${pageCount}`, 595.28 - PAGE_MARGIN, 820, {
      align: "right",
    });
  }
}

function save(doc: jsPDF, entry: WorksheetEntry) {
  const safeTitle = (entry.title || getWorksheetTypeMeta(entry.type).shortName)
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`${safeTitle || "worksheet"}-${dateStr}.pdf`);
}

// ============ Per-type generators ============

function generateChainAnalysis(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(
    doc,
    `${getWorksheetTypeMeta(entry.type).name} — ${getWorksheetTypeMeta(entry.type).reference}`
  );
  if (data.behaviorDate) {
    writeSubtitle(doc, `Date of behavior: ${data.behaviorDate}`);
  }
  y += 8;

  writeSectionTitle(doc, 1, "The problem behavior");
  writeKeyValue(doc, "Specific problem behavior", data.problemBehavior);
  writeKeyValue(doc, "What, when, where, how", data.whatWhenWhere);

  writeSectionTitle(doc, 2, "Prompting event");
  writeKeyValue(doc, "Prompting event", data.promptingEvent);

  writeSectionTitle(doc, 3, "Vulnerability factors");
  const vuln = data.vulnerabilities ?? {};
  const vulnLabels: Record<string, string> = {
    tired: "Tired", hungry: "Hungry", sick: "Sick", pain: "In pain",
    substances: "Alcohol/drugs", stressfulEnv: "Stressful environment",
    recentLoss: "Recent loss", conflict: "Interpersonal conflict",
    poorSleep: "Poor sleep", other: "Other",
  };
  const checked = Object.keys(vulnLabels).filter((k) => vuln[k]);
  let vulnText = checked.map((k) => vulnLabels[k]).join(", ");
  if (vuln.other && vuln.otherText) vulnText += ` (${vuln.otherText})`;
  writeValue(doc, vulnText || "None checked");
  writeKeyValue(doc, "Vulnerability notes", data.vulnerabilityNotes);

  writeSectionTitle(doc, 4, "The chain of events");
  const links = data.chainLinks ?? [];
  links.forEach((link: any, idx: number) => {
    writeLabel(doc, `Link ${String(idx + 1).padStart(2, "0")}`);
    writeValue(
      doc,
      [
        link.situation && `Situation: ${link.situation}`,
        link.thought && `Thought: ${link.thought}`,
        link.feeling && `Feeling: ${link.feeling}`,
        link.body && `Body: ${link.body}`,
        link.action && `Action: ${link.action}`,
      ]
        .filter(Boolean)
        .join("\n")
    );
    y += 4;
  });

  writeSectionTitle(doc, 5, "The behavior itself");
  writeKeyValue(doc, "Behavior description", data.behaviorDescription);

  writeSectionTitle(doc, 6, "Consequences");
  writeKeyValue(doc, "Immediate consequences", data.consequencesImmediate);
  writeKeyValue(doc, "Longer-term consequences", data.consequencesLongTerm);

  writeSectionTitle(doc, 7, "Skills analysis");
  writeKeyValue(doc, "Links where a different skill could have been used", data.skillsCouldHaveUsed);
  writeKeyValue(doc, "Skills I will use next time", data.skillsNextTime);
}

function generateProsCons(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(
    doc,
    `${getWorksheetTypeMeta(entry.type).name} — ${getWorksheetTypeMeta(entry.type).reference}`
  );
  if (data.entryDate) {
    writeSubtitle(doc, `Date: ${data.entryDate}`);
  }
  y += 8;

  writeSectionTitle(doc, 1, "The urge");
  writeKeyValue(doc, "The urge I'm considering acting on", data.urgeDescription);

  writeSectionTitle(doc, 2, "ACTING on the urge — Pros");
  writeKeyValue(doc, "Short-term", data.actingProsShort);
  writeKeyValue(doc, "Long-term", data.actingProsLong);

  writeSectionTitle(doc, 3, "ACTING on the urge — Cons");
  writeKeyValue(doc, "Short-term", data.actingConsShort);
  writeKeyValue(doc, "Long-term", data.actingConsLong);

  writeSectionTitle(doc, 4, "RESISTING the urge — Pros");
  writeKeyValue(doc, "Short-term", data.notActingProsShort);
  writeKeyValue(doc, "Long-term", data.notActingProsLong);

  writeSectionTitle(doc, 5, "RESISTING the urge — Cons");
  writeKeyValue(doc, "Short-term", data.notActingConsShort);
  writeKeyValue(doc, "Long-term", data.notActingConsLong);

  writeSectionTitle(doc, 6, "My decision");
  writeKeyValue(doc, "My decision", data.decision);
  writeKeyValue(doc, "Skill(s) I will use", data.skillToUse);
}

function generateDiaryCard(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  const days: any[] = data.days ?? [];
  writeTitle(doc, entry.title);
  writeSubtitle(
    doc,
    `${getWorksheetTypeMeta(entry.type).name} — ${getWorksheetTypeMeta(entry.type).reference}`
  );
  if (data.weekStartDate) {
    writeSubtitle(doc, `Week starting: ${data.weekStartDate}`);
  }
  if (data.customTarget) {
    writeSubtitle(doc, `Custom target: ${data.customTarget}`);
  }
  y += 8;

  // Table header
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const colWidth = CONTENT_WIDTH / 8;

  const writeTableHeader = () => {
    ensureSpace(doc, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(80);
    doc.text("Metric", PAGE_MARGIN, y);
    labels.forEach((label, idx) => {
      doc.text(label, PAGE_MARGIN + colWidth * (idx + 1), y);
    });
    y += 4;
    doc.setDrawColor(200);
    doc.line(PAGE_MARGIN, y, PAGE_MARGIN + CONTENT_WIDTH, y);
    y += 12;
  };

  const writeRow = (label: string, values: (number | string)[]) => {
    ensureSpace(doc, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30);
    doc.text(label, PAGE_MARGIN, y);
    values.forEach((v, idx) => {
      const text = v === 0 || v === "" ? "–" : String(v);
      doc.text(text, PAGE_MARGIN + colWidth * (idx + 1), y);
    });
    y += 14;
  };

  writeSectionTitle(doc, undefined, "Urges (0–5)");
  writeTableHeader();
  writeRow("Self-harm urge", days.map((d) => d?.urgeSelfHarm ?? 0));
  writeRow("Suicide urge", days.map((d) => d?.urgeSuicide ?? 0));
  writeRow("Substance urge", days.map((d) => d?.urgeSubstances ?? 0));
  writeRow("Quit therapy urge", days.map((d) => d?.urgeQuitTherapy ?? 0));

  writeSectionTitle(doc, undefined, "Actions (0–5)");
  writeTableHeader();
  writeRow("Self-harm", days.map((d) => d?.actSelfHarm ?? 0));
  writeRow("Substance use", days.map((d) => d?.actSubstances ?? 0));
  writeRow(data.customTarget || "Other target", days.map((d) => d?.actOther ?? 0));

  writeSectionTitle(doc, undefined, "Emotions (0–5)");
  writeTableHeader();
  writeRow("Anger", days.map((d) => d?.emoAnger ?? 0));
  writeRow("Sadness", days.map((d) => d?.emoSadness ?? 0));
  writeRow("Fear", days.map((d) => d?.emoFear ?? 0));
  writeRow("Shame", days.map((d) => d?.emoShame ?? 0));
  writeRow("Joy", days.map((d) => d?.emoJoy ?? 0));

  writeSectionTitle(doc, undefined, "Skills used (✓)");
  writeTableHeader();
  writeRow("Mindfulness", days.map((d) => (d?.skillMindfulness ? "✓" : "")));
  writeRow("Distress Tolerance", days.map((d) => (d?.skillDistressTolerance ? "✓" : "")));
  writeRow("Emotion Regulation", days.map((d) => (d?.skillEmotionRegulation ? "✓" : "")));
  writeRow("Interpersonal", days.map((d) => (d?.skillInterpersonal ? "✓" : "")));

  writeSectionTitle(doc, undefined, "Daily notes");
  days.forEach((d, idx) => {
    if (d?.notes?.trim()) {
      writeKeyValue(doc, `${labels[idx]}${d.date ? ` (${d.date})` : ""}`, d.notes);
    }
  });
}

function generateWalkingMiddlePath(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(
    doc,
    `${getWorksheetTypeMeta(entry.type).name} — ${getWorksheetTypeMeta(entry.type).reference}`
  );
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "The situation");
  writeKeyValue(doc, "Describe the situation", data.situation);

  writeSectionTitle(doc, 2, "The two opposing positions");
  writeKeyValue(doc, "Position A", data.positionA);
  writeKeyValue(doc, "What's true about Position A?", data.trueInA);
  writeKeyValue(doc, "Position B", data.positionB);
  writeKeyValue(doc, "What's true about Position B?", data.trueInB);

  writeSectionTitle(doc, 3, "Old synthesis attempt");
  writeKeyValue(doc, "Previous attempts at resolving this", data.oldSynthesisAttempt);

  writeSectionTitle(doc, 4, "The synthesis");
  writeKeyValue(doc, "My synthesis statement", data.synthesis);

  writeSectionTitle(doc, 5, "How I'll act on the synthesis");
  writeKeyValue(doc, "Concrete actions", data.howIWillAct);

  writeSectionTitle(doc, 6, "Practice: noticing when you collapse back");
  writeKeyValue(doc, "When did I notice myself collapsing back into one side?", data.practiceNotes);

  writeSectionTitle(doc, 7, "Awareness practice: opposites that can both be true");
  writeKeyValue(doc, "Examples of opposites that can both be true", data.oppositesBothTrue);
}

function generateMissingLinks(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(
    doc,
    `${getWorksheetTypeMeta(entry.type).name} — ${getWorksheetTypeMeta(entry.type).reference}`
  );
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "The skill and the situation");
  writeKeyValue(doc, "The skill I intended to use", data.skillIntended);
  writeKeyValue(doc, "The situation where I should have used it", data.situation);

  writeSectionTitle(doc, 2, "What actually happened");
  writeKeyValue(doc, "What I actually did instead", data.whatHappened);

  writeSectionTitle(doc, 3, "The missing link");
  const linkTypeLabels: Record<string, string> = {
    forgetting: "Forgetting",
    "not-noticing": "Not noticing the cue",
    "not-believing": "Not believing it would work",
    "fear-skill-works": "Fear it would work",
    "not-knowing-how": "Not knowing how to start",
    overwhelm: "Too overwhelmed",
    "no-time": "Felt I didn't have time",
    "didnt-want": "Didn't want to use it",
    shame: "Shame about needing the skill",
    other: "Other",
  };
  const selected = (Array.isArray(data.missingLinkType) ? data.missingLinkType : [])
    .map((k: string) => linkTypeLabels[k] ?? k)
    .join(", ");
  writeValue(doc, selected || "None selected");
  writeKeyValue(doc, "Notes on the missing link", data.missingLinkNotes);

  writeSectionTitle(doc, 4, "Barriers and context");
  writeKeyValue(doc, "What else got in the way?", data.barriers);

  writeSectionTitle(doc, 5, "Plan to close the gap");
  writeKeyValue(doc, "Strategy to close this specific gap", data.planStrategy);
  writeKeyValue(doc, "What I'll do next time", data.nextTimePlan);
  writeKeyValue(doc, "Cue / reminder I'll use", data.cueReminder);
}

// ============ Public API ============

export function exportToPdf(entry: WorksheetEntry) {
  const doc = newDoc();
  y = PAGE_MARGIN;

  switch (entry.type) {
    case "chain-analysis":
      generateChainAnalysis(doc, entry);
      break;
    case "pros-cons":
      generateProsCons(doc, entry);
      break;
    case "diary-card":
      generateDiaryCard(doc, entry);
      break;
    case "walking-middle-path":
      generateWalkingMiddlePath(doc, entry);
      break;
    case "missing-links":
      generateMissingLinks(doc, entry);
      break;
  }

  writeFooter(doc, entry);
  save(doc, entry);
}
