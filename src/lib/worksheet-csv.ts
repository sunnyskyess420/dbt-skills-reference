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
    case "being-effective":
      return [d.situation || "", d.objective || "", d.fair || "", d.values || "", d.script || ""];
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
    case "wise-mind":
      return [d.situation || "", d.emotionMind || "", d.wiseMindAnswer || "", String(d.confidence ?? 0), d.reflection || ""];
    case "what-skills":
      return [d.situation || "", d.skill || "", d.observe || "", d.describe || "", d.reflection || ""];
    case "how-skills":
      return [d.situation || "", d.whatSkill || "", d.nonjudgmental || "", d.oneMindful || "", d.reflection || ""];
    case "loving-kindness":
      return [d.setting || "", d.self || "", d.lovedOne || "", d.difficultPerson || "", d.reflection || ""];
    case "balancing-doing-being":
      return [d.currentMode || "", d.doingDescription || "", d.beingDescription || "", d.shift || "", d.reflection || ""];
    case "stop-skill":
      return [d.situation || "", d.aboutToDo || "", d.stop || "", d.proceed || "", d.reflection || ""];
    case "tipp":
      return [d.situation || "", d.temperature || "", d.intenseExercise || "", d.pacedBreathing || "", d.reflection || ""];
    case "accepts":
      return [d.situation || "", d.activities || "", d.contributing || "", d.comparisons || "", d.whatHappened || ""];
    case "self-soothing":
      return [d.situation || "", d.vision || "", d.hearing || "", d.smell || "", d.kitPlan || ""];
    case "improve":
      return [d.situation || "", d.imagery || "", d.meaning || "", d.relaxation || "", d.reflection || ""];
    case "half-smiling":
      return [d.situation || "", d.practicingWith || "", d.halfSmile || "", d.willingHands || "", d.reflection || ""];
    case "emotion-model":
      return [d.emotion || "", String(d.intensity ?? 0), d.promptingEvent || "", d.interpretation || "", d.reflection || ""];
    case "problem-solving":
      return [d.problem || "", d.emotion || "", d.brainstorm || "", d.chosen || "", d.whatHappened || ""];
    case "positives-short":
      return [d.weekStartDate || "", d.activitiesList || "", d.monday || "", d.wednesday || "", d.reflection || ""];
    case "positives-long":
      return [d.chosenValue || "", d.whyImportant || "", d.goal || "", d.thisWeekAction || "", d.reflection || ""];
    case "sleep-hygiene":
      return [d.weekStartDate || "", d.monday || "", d.wednesday || "", d.hygienePractices || "", d.reflection || ""];
    case "extreme-emotions":
      return [d.commonEmotions || "", d.warningSigns || "", d.dtSkills || "", d.erSkills || "", d.reflection || ""];
    case "clear-mind":
      return [d.currentstate || "", d.triggers || "", d.complacencySigns || "", d.recoveryPractices || "", d.reflection || ""];
    case "finding-people":
      return [d.interests || "", d.whereToLook || "", d.conversationStarters || "", d.thisWeekStep || "", d.reflection || ""];
    case "mindfulness-others":
      return [d.person || "", d.observations || "", d.whatHappened || "", d.beyondWords || "", d.reflection || ""];
    case "ending-relationships":
      return [d.relationship || "", d.whyEnd || "", d.howToEnd || "", d.whatHappened || "", d.reflection || ""];
    case "options-problems":
      return [d.problem || "", d.optionSolve || "", d.optionFeelBetter || "", d.optionAccept || "", d.myChoice || ""];
    case "dialectical-abstinence":
      return [d.substance || "", d.commitment || "", d.slipPlan || "", d.relapsePreventionPlan || "", d.reflection || ""];
    case "behavior-change":
      return [d.targetBehavior || "", d.target || "", d.reinforcement || "", d.extinctionPlan || "", d.reflection || ""];
    case "pleasant-events-diary":
      return [d.entryDate || "", d.activity || "", d.emotionsBefore || "", d.emotionsAfter || "", d.reflection || ""];
    case "emotion-diary":
      return [d.entryDate || "", d.event || "", d.primaryEmotion || "", d.secondaryEmotions || "", d.copingskills || ""];
    case "cope-ahead":
      return [d.situation || "", d.emotion || "", d.copeAction || "", d.selfTalk || "", d.outcome || ""];
    case "build-mastery":
      return [d.activity || "", d.difficulty || "", d.completed || "", d.nextStep || "", d.reflection || ""];
    case "please-tracker":
      return [d.situation || "", d.gentle || "", d.interested || "", d.validate || "", d.easyManner || ""];
    case "nightmare-protocol":
      return [d.nightmare || "", d.emotion || "", d.rescripting || "", d.newEnding || "", d.reflection || ""];
    case "mindfulness-emotions":
      return [d.emotion || "", d.whereInBody || "", d.intensity || "", d.urge || "", d.reflection || ""];
    case "mindfulness-thoughts":
      return [d.thought || "", d.feeling || "", d.letGo || "", d.cameBack || "", d.reflection || ""];
    case "turning-mind-willingness":
      return [d.situation || "", d.willing || "", d.willful || "", d.whatHappened || "", d.reflection || ""];
    case "clarifying-priorities":
      return [d.situation || "", d.priority || "", d.goal || "", d.bothResponse || "", d.reflection || ""];
    case "troubleshooting-ie":
      return [d.situation || "", d.thoughts || "", d.actions || "", d.whatHelped || "", d.nextSteps || ""];
    case "validating-others":
      return [d.situation || "", d.whatHappened || "", d.validationLevel || "", d.response || "", d.reflection || ""];
    case "myths-emotions":
      return [d.myth || "", d.truth || "", d.beliefBefore || "", d.beliefAfter || "", d.reflection || ""];
    default: {
      const d = ws.data;
      const stringFields = Object.entries(d)
        .filter(([k, v]) => typeof v === "string" && v.trim() !== "")
        .map(([k, v]) => [k, v as string]);
      return stringFields.slice(0, 5).map(([, v]) => v);
    }
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
function genericCsvRow(d: Record<string, any>): string[] {
  return Object.values(d).map(v => String(v ?? ""));
}

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
