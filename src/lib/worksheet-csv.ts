// CSV export utilities for worksheets.
// Exports diary card data and other worksheets in spreadsheet-friendly format.

import {
  type WorksheetEntry,
  getWorksheetTypeMeta,
} from "./worksheet-storage";

function csvEscape(value: any): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Wrap in quotes if contains comma, quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function row(...cells: any[]): string {
  return cells.map(csvEscape).join(",");
}

/**
 * Export all diary cards as CSV.
 * One row per day, with columns for every tracked metric.
 */
function diaryCardsToCSV(entries: WorksheetEntry[]): string {
  const diaryCards = entries.filter((e) => e.type === "diary-card");
  if (diaryCards.length === 0) return "";

  const headers = [
    "Week Start",
    "Day",
    "Date",
    "Urge: Self-harm",
    "Urge: Suicide",
    "Urge: Substances",
    "Urge: Quit Therapy",
    "Action: Self-harm",
    "Action: Substances",
    "Action: Other",
    "Emotion: Anger",
    "Emotion: Sadness",
    "Emotion: Fear",
    "Emotion: Shame",
    "Emotion: Joy",
    "Skill: Mindfulness",
    "Skill: Distress Tolerance",
    "Skill: Emotion Regulation",
    "Skill: Interpersonal",
    "Notes",
  ];

  const lines = [row(...headers)];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (const card of diaryCards) {
    const weekStart = card.data.weekStartDate || "";
    const days = card.data.days ?? [];
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      if (!d) continue;
      lines.push(
        row(
          weekStart,
          dayLabels[i] || `Day ${i + 1}`,
          d.date || "",
          d.urgeSelfHarm ?? 0,
          d.urgeSuicide ?? 0,
          d.urgeSubstances ?? 0,
          d.urgeQuitTherapy ?? 0,
          d.actSelfHarm ?? 0,
          d.actSubstances ?? 0,
          d.actOther ?? 0,
          d.emoAnger ?? 0,
          d.emoSadness ?? 0,
          d.emoFear ?? 0,
          d.emoShame ?? 0,
          d.emoJoy ?? 0,
          d.skillMindfulness ? "Yes" : "No",
          d.skillDistressTolerance ? "Yes" : "No",
          d.skillEmotionRegulation ? "Yes" : "No",
          d.skillInterpersonal ? "Yes" : "No",
          d.notes || ""
        )
      );
    }
  }

  return lines.join("\n");
}

/**
 * Export all non-diary-card worksheets as CSV.
 * One row per worksheet, with key fields as columns.
 */
function worksheetsToCSV(entries: WorksheetEntry[]): string {
  const nonDiary = entries.filter((e) => e.type !== "diary-card");
  if (nonDiary.length === 0) return "";

  const headers = [
    "Title",
    "Type",
    "Date Created",
    "Last Updated",
    "Key Field 1",
    "Key Field 2",
    "Key Field 3",
    "Key Field 4",
    "Key Field 5",
  ];

  const lines = [row(...headers)];

  for (const ws of nonDiary) {
    const meta = getWorksheetTypeMeta(ws.type);
    const keyFields = getKeyFields(ws);
    lines.push(
      row(
        ws.title,
        meta.shortName,
        new Date(ws.createdAt).toLocaleDateString(),
        new Date(ws.updatedAt).toLocaleDateString(),
        ...keyFields
      )
    );
  }

  return lines.join("\n");
}

/**
 * Extract the 5 most important fields from a worksheet for CSV summary.
 */
function getKeyFields(ws: WorksheetEntry): string[] {
  const d = ws.data;
  switch (ws.type) {
    case "chain-analysis":
      return [d.problemBehavior || "", d.promptingEvent || "", d.behaviorDescription || "", d.skillsNextTime || "", d.consequencesLongTerm || ""];
    case "pros-cons":
      return [d.urgeDescription || "", d.actingProsShort || "", d.actingConsLong || "", d.notActingProsLong || "", d.decision || ""];
    case "walking-middle-path":
      return [d.situation || "", d.positionA || "", d.positionB || "", d.synthesis || "", d.howIWillAct || ""];
    case "missing-links":
      return [d.skillIntended || "", d.situation || "", Array.isArray(d.missingLinkType) ? d.missingLinkType.join("; ") : "", d.planStrategy || "", d.nextTimePlan || ""];
    case "dear-man-script":
      return [d.relationship || "", d.objective || "", d.describe || "", d.assert || "", d.negotiate || ""];
    case "check-the-facts":
      return [d.emotion || "", String(d.intensity ?? 0), d.promptingEvent || "", d.interpretation || "", d.skillToUse || ""];
    case "opposite-action":
      return [d.emotion || "", String(d.intensity ?? 0), d.actionUrge || "", d.oppositeAction || "", d.plan || ""];
    case "radical-acceptance":
      return [d.whatIAmAccepting || "", d.whyHard || "", d.willingness || "", d.whatChanged || "", d.notes || ""];
    case "crisis-survival-tracker":
      return [d.crisisDescription || "", String(d.intensity ?? 0), d.whatHelped || "", d.whatDidntHelp || "", d.whatToTryNextTime || ""];
    case "values-to-actions":
      return [d.chosenValue || "", d.goal || "", d.actionStep1 || "", d.actionStep2 || "", d.when || ""];
    case "dialectics-practice":
      return [d.relationship || "", d.positionA || "", d.positionB || "", d.synthesis || "", d.howIWillAct || ""];
    case "self-validation":
      return [d.situation || "", d.feeling || "", d.level2 || "", d.level4 || "", d.reflection || ""];
    case "dime-game":
      return [d.situation || "", d.mode || "", String(getDimeScore(d)), d.notes || "", ""];
    default:
      return ["", "", "", "", ""];
  }
}

function getDimeScore(data: any): number {
  const factors = data.factors ?? {};
  const factorDefs = [
    { key: "capability", harder: true },
    { key: "right", harder: true },
    { key: "timing", harder: true },
    { key: "priority", harder: true },
    { key: "giveToGet", harder: true },
    { key: "relationship", harder: true },
    { key: "clarity", harder: true },
    { key: "selfRespect", harder: true },
    { key: "reciprocity", harder: true },
    { key: "authority", harder: false },
  ];
  let score = 0;
  for (const f of factorDefs) {
    const answer = factors[f.key];
    if (answer === "yes") score += f.harder ? 1 : -1;
    else if (answer === "no") score += f.harder ? -1 : 1;
  }
  return score;
}

/**
 * Export all worksheets as a single CSV file.
 * Diary cards get their own detailed format; other worksheets get a summary.
 * If both exist, they're separated by a blank line.
 */
export function exportAllToCSV(entries: WorksheetEntry[]): string {
  const parts: string[] = [];

  const diaryCSV = diaryCardsToCSV(entries);
  if (diaryCSV) {
    parts.push(diaryCSV);
  }

  const wsCSV = worksheetsToCSV(entries);
  if (wsCSV) {
    if (parts.length > 0) parts.push(""); // blank line separator
    parts.push(wsCSV);
  }

  return parts.join("\n");
}

/**
 * Trigger a CSV file download in the browser.
 */
export function downloadCSV(entries: WorksheetEntry[]) {
  const csv = exportAllToCSV(entries);
  if (!csv) return;

  // Add BOM for Excel UTF-8 compatibility
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `dbt-worksheets-${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
