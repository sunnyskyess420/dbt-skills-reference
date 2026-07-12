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
    `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`
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
    `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`
  );
  if (data.entryDate) {
    writeSubtitle(doc, `Date: ${data.entryDate}`);
  }
  y += 8;

  writeSectionTitle(doc, 1, "The urge");
  writeKeyValue(doc, "The urge I'm considering acting on", data.urgeDescription);

  writeSectionTitle(doc, 2, "ACTING on the urge - Pros");
  writeKeyValue(doc, "Short-term", data.actingProsShort);
  writeKeyValue(doc, "Long-term", data.actingProsLong);

  writeSectionTitle(doc, 3, "ACTING on the urge - Cons");
  writeKeyValue(doc, "Short-term", data.actingConsShort);
  writeKeyValue(doc, "Long-term", data.actingConsLong);

  writeSectionTitle(doc, 4, "RESISTING the urge - Pros");
  writeKeyValue(doc, "Short-term", data.notActingProsShort);
  writeKeyValue(doc, "Long-term", data.notActingProsLong);

  writeSectionTitle(doc, 5, "RESISTING the urge - Cons");
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
    `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`
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
      const text = v === 0 || v === "" ? "-" : String(v);
      doc.text(text, PAGE_MARGIN + colWidth * (idx + 1), y);
    });
    y += 14;
  };

  writeSectionTitle(doc, undefined, "Urges (0-5)");
  writeTableHeader();
  writeRow("Self-harm urge", days.map((d) => d?.urgeSelfHarm ?? 0));
  writeRow("Suicide urge", days.map((d) => d?.urgeSuicide ?? 0));
  writeRow("Substance urge", days.map((d) => d?.urgeSubstances ?? 0));
  writeRow("Quit therapy urge", days.map((d) => d?.urgeQuitTherapy ?? 0));

  writeSectionTitle(doc, undefined, "Actions (0-5)");
  writeTableHeader();
  writeRow("Self-harm", days.map((d) => d?.actSelfHarm ?? 0));
  writeRow("Substance use", days.map((d) => d?.actSubstances ?? 0));
  writeRow(data.customTarget || "Other target", days.map((d) => d?.actOther ?? 0));

  writeSectionTitle(doc, undefined, "Emotions (0-5)");
  writeTableHeader();
  writeRow("Anger", days.map((d) => d?.emoAnger ?? 0));
  writeRow("Sadness", days.map((d) => d?.emoSadness ?? 0));
  writeRow("Fear", days.map((d) => d?.emoFear ?? 0));
  writeRow("Shame", days.map((d) => d?.emoShame ?? 0));
  writeRow("Joy", days.map((d) => d?.emoJoy ?? 0));

  writeSectionTitle(doc, undefined, "Skills used (Y)");
  writeTableHeader();
  writeRow("Mindfulness", days.map((d) => (d?.skillMindfulness ? "Y" : "")));
  writeRow("Distress Tolerance", days.map((d) => (d?.skillDistressTolerance ? "Y" : "")));
  writeRow("Emotion Regulation", days.map((d) => (d?.skillEmotionRegulation ? "Y" : "")));
  writeRow("Interpersonal", days.map((d) => (d?.skillInterpersonal ? "Y" : "")));

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
    `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`
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
    `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`
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
    case "dear-man-script":
      generateDearManScript(doc, entry);
      break;
    case "check-the-facts":
      generateCheckTheFacts(doc, entry);
      break;
    case "opposite-action":
      generateOppositeAction(doc, entry);
      break;
    case "radical-acceptance":
      generateRadicalAcceptance(doc, entry);
      break;
    case "crisis-survival-tracker":
      generateCrisisSurvivalTracker(doc, entry);
      break;
    case "values-to-actions":
      generateValuesToActions(doc, entry);
      break;
    case "pleasant-events-diary":
      generatePleasantEventsDiary(doc, entry);
      break;
    case "emotion-diary":
      generateEmotionDiary(doc, entry);
      break;
    case "dialectics-practice":
      generateDialecticsPractice(doc, entry);
      break;
    case "self-validation":
      generateSelfValidation(doc, entry);
      break;
    case "dime-game":
      generateDimeGame(doc, entry);
      break;
  }

  writeFooter(doc, entry);
  save(doc, entry);
}

// ============ New worksheet generators ============

function generateDearManScript(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "The situation");
  writeKeyValue(doc, "Relationship", data.relationship);
  writeKeyValue(doc, "Objective", data.objective);
  writeKeyValue(doc, "Priority", data.priority);

  writeSectionTitle(doc, 2, "DEAR MAN script");
  writeKeyValue(doc, "D - Describe", data.describe);
  writeKeyValue(doc, "E - Express", data.express);
  writeKeyValue(doc, "A - Assert", data.assert);
  writeKeyValue(doc, "R - Reinforce", data.reinforce);
  writeKeyValue(doc, "M - stay Mindful", data.mindfulPlan);
  writeKeyValue(doc, "A - Appear confident", data.appearConfident);
  writeKeyValue(doc, "N - Negotiate", data.negotiate);

  writeSectionTitle(doc, 3, "Relationship & self-respect");
  writeKeyValue(doc, "GIVE", data.givePlan);
  writeKeyValue(doc, "FAST", data.fastPlan);

  writeSectionTitle(doc, 4, "Rehearsal");
  writeKeyValue(doc, "Anticipated response", data.anticipatedResponse);
  writeKeyValue(doc, "Response to resistance", data.myResponseToResistance);
}

function generateCheckTheFacts(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "The emotion");
  writeKeyValue(doc, "Emotion", data.emotion);
  writeKeyValue(doc, "Intensity", String(data.intensity ?? 0) + " / 5");

  writeSectionTitle(doc, 2, "What happened");
  writeKeyValue(doc, "Prompting event", data.promptingEvent);

  writeSectionTitle(doc, 3, "Your interpretation");
  writeKeyValue(doc, "My interpretation", data.interpretation);
  writeKeyValue(doc, "Alternative interpretations", data.alternativeInterpretations);

  writeSectionTitle(doc, 4, "Threat assessment");
  writeKeyValue(doc, "Threat I'm assuming", data.threatAssumed);
  writeKeyValue(doc, "Is the threat real?", data.threatReal);

  writeSectionTitle(doc, 5, "Does the emotion fit?");
  writeKeyValue(doc, "Does it fit the facts?", data.intensityFits);

  writeSectionTitle(doc, 6, "What to do");
  writeKeyValue(doc, "If it doesn't fit - skill to use", data.skillToUse);
  writeKeyValue(doc, "If it does fit - problem solving", data.problemSolving);
  writeKeyValue(doc, "Notes", data.notes);
}

function generateOppositeAction(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "The emotion and its urge");
  writeKeyValue(doc, "Emotion", data.emotion);
  writeKeyValue(doc, "Intensity", String(data.intensity ?? 0) + " / 5");
  writeKeyValue(doc, "Action urge", data.actionUrge);

  writeSectionTitle(doc, 2, "Does it fit the facts?");
  writeKeyValue(doc, "Does the emotion fit?", data.fitsFacts);
  writeKeyValue(doc, "Is the intensity appropriate?", data.intensityAppropriate);

  writeSectionTitle(doc, 3, "The opposite action");
  writeKeyValue(doc, "What is the opposite action?", data.oppositeAction);
  writeKeyValue(doc, "Body language", data.bodyLanguage);
  writeKeyValue(doc, "All the way", data.allTheWay);

  writeSectionTitle(doc, 4, "Plan to repeat");
  writeKeyValue(doc, "How many times / how often?", data.timesToRepeat);
  writeKeyValue(doc, "Obstacles", data.obstacles);
  writeKeyValue(doc, "My plan", data.plan);
}

function generateRadicalAcceptance(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "What I am accepting");
  writeKeyValue(doc, "What I am accepting", data.whatIAmAccepting);

  writeSectionTitle(doc, 2, "What makes it hard");
  writeKeyValue(doc, "Why is this hard to accept?", data.whyHard);
  writeKeyValue(doc, "My willfulness", data.willfulness);

  writeSectionTitle(doc, 3, "Practice");
  writeKeyValue(doc, "Half-smile practice", data.halfSmile);
  writeKeyValue(doc, "Willing hands", data.willingHands);
  writeKeyValue(doc, "Turning the mind", data.turningMind);
  writeKeyValue(doc, "Body practice", data.bodyPractice);

  writeSectionTitle(doc, 4, "Reflection");
  writeKeyValue(doc, "What changed?", data.whatChanged);
  writeKeyValue(doc, "Notes", data.notes);
}

function generateCrisisSurvivalTracker(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.crisisDate) writeSubtitle(doc, `Date of crisis: ${data.crisisDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "The crisis");
  writeKeyValue(doc, "What happened?", data.crisisDescription);
  writeKeyValue(doc, "Intensity", String(data.intensity ?? 0) + " / 5");

  writeSectionTitle(doc, 2, "Skills I used");
  const skills = data.skillsUsed ?? {};
  const skillLabels: Record<string, string> = {
    stop: "STOP", tipp: "TIPP", prosCons: "Pros & Cons", distract: "Distract (ACCEPTS)",
    selfSoothe: "Self-Soothe", improve: "IMPROVE", radicalAcceptance: "Radical Acceptance", turningMind: "Turning the Mind",
  };
  const usedSkills = Object.keys(skillLabels).filter((k) => skills[k]).map((k) => skillLabels[k]);
  writeValue(doc, usedSkills.length > 0 ? usedSkills.join(", ") : "None checked");

  writeSectionTitle(doc, 3, "What worked");
  writeKeyValue(doc, "What helped?", data.whatHelped);
  writeKeyValue(doc, "What didn't help?", data.whatDidntHelp);
  writeKeyValue(doc, "What I did instead", data.whatIDidInstead);

  writeSectionTitle(doc, 4, "Next time");
  writeKeyValue(doc, "What to try next time", data.whatToTryNextTime);
  writeKeyValue(doc, "Skills I wish I'd known", data.skillsListMissing);
}

function generateValuesToActions(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "List your values");
  writeKeyValue(doc, "My values", data.valuesList);

  writeSectionTitle(doc, 2, "Pick one value");
  writeKeyValue(doc, "Chosen value", data.chosenValue);
  writeKeyValue(doc, "Why is this important?", data.whyImportant);

  writeSectionTitle(doc, 3, "Set a goal");
  writeKeyValue(doc, "My goal", data.goal);

  writeSectionTitle(doc, 4, "Action steps");
  writeKeyValue(doc, "Action step 1", data.actionStep1);
  writeKeyValue(doc, "Action step 2", data.actionStep2);
  writeKeyValue(doc, "Action step 3", data.actionStep3);

  writeSectionTitle(doc, 5, "When");
  writeKeyValue(doc, "When will I start?", data.when);

  writeSectionTitle(doc, 6, "Track progress");
  writeKeyValue(doc, "Progress notes", data.progressNotes);
}

function generatePleasantEventsDiary(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.weekStartDate) writeSubtitle(doc, `Week starting: ${data.weekStartDate}`);
  y += 8;

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const entries: any[] = data.entries ?? [];
  labels.forEach((label, idx) => {
    const e = entries[idx];
    if (!e) return;
    writeSectionTitle(doc, undefined, label + (e.date ? ` (${e.date})` : ""));
    writeKeyValue(doc, "Activity", e.activity);
    writeKeyValue(doc, "Emotion before", String(e.emotionBefore ?? 0) + " / 5");
    writeKeyValue(doc, "Emotion after", String(e.emotionAfter ?? 0) + " / 5");
    writeKeyValue(doc, "Present?", e.present ? "Yes" : "No");
    if (e.notes) writeKeyValue(doc, "Notes", e.notes);
  });
}

function generateEmotionDiary(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.weekStartDate) writeSubtitle(doc, `Week starting: ${data.weekStartDate}`);
  if (data.targetEmotion) writeSubtitle(doc, `Target emotion: ${data.targetEmotion}`);
  y += 8;

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const entries: any[] = data.entries ?? [];
  labels.forEach((label, idx) => {
    const e = entries[idx];
    if (!e) return;
    writeSectionTitle(doc, undefined, label + (e.date ? ` (${e.date})` : ""));
    writeKeyValue(doc, "Trigger", e.trigger);
    writeKeyValue(doc, "Intensity", String(e.intensity ?? 0) + " / 5");
    writeKeyValue(doc, "Interpretation", e.interpretation);
    writeKeyValue(doc, "What I did", e.whatIDid);
    writeKeyValue(doc, "What worked", e.whatWorked);
    if (e.notes) writeKeyValue(doc, "Notes", e.notes);
  });
}

function generateDialecticsPractice(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "The relationship");
  writeKeyValue(doc, "Relationship", data.relationship);

  writeSectionTitle(doc, 2, "Two opposing positions");
  writeKeyValue(doc, "Position A", data.positionA);
  writeKeyValue(doc, "What's true about A?", data.trueInA);
  writeKeyValue(doc, "Position B", data.positionB);
  writeKeyValue(doc, "What's true about B?", data.trueInB);

  writeSectionTitle(doc, 3, "The synthesis");
  writeKeyValue(doc, "Synthesis statement", data.synthesis);

  writeSectionTitle(doc, 4, "How I'll act on it");
  writeKeyValue(doc, "Concrete actions", data.howIWillAct);

  writeSectionTitle(doc, 5, "Practice");
  writeKeyValue(doc, "When did I slip back?", data.whenSlippedBack);
}

function generateSelfValidation(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  y += 8;

  writeSectionTitle(doc, 1, "The situation and feeling");
  writeKeyValue(doc, "Situation", data.situation);
  writeKeyValue(doc, "The feeling", data.feeling);

  writeSectionTitle(doc, 2, "The 6 levels of self-validation");
  const levels = [
    { num: 1, title: "Be present", key: "level1" },
    { num: 2, title: "Accurate reflection", key: "level2" },
    { num: 3, title: "Articulate the unsaid", key: "level3" },
    { num: 4, title: "Validate based on history", key: "level4" },
    { num: 5, title: "Validate in context", key: "level5" },
    { num: 6, title: "Treat yourself as equal", key: "level6" },
  ];
  levels.forEach((level) => {
    writeSectionTitle(doc, level.num, level.title);
    writeValue(doc, data[level.key]);
  });

  writeSectionTitle(doc, 3, "Reflection");
  writeKeyValue(doc, "Reflection", data.reflection);
}

function generateDimeGame(doc: jsPDF, entry: WorksheetEntry) {
  const data = entry.data;
  writeTitle(doc, entry.title);
  writeSubtitle(doc, `${getWorksheetTypeMeta(entry.type).name} - ${getWorksheetTypeMeta(entry.type).reference}`);
  if (data.entryDate) writeSubtitle(doc, `Date: ${data.entryDate}`);
  const mode = data.mode === "sayno" ? "Saying no" : "Asking";
  writeSubtitle(doc, `Mode: ${mode}`);
  y += 8;

  writeSectionTitle(doc, 1, "The situation");
  writeKeyValue(doc, "What I want to ask for (or say no to)", data.situation);

  writeSectionTitle(doc, 2, "The 10 questions");

  const factorQuestions: Record<string, string> = {
    capability: "Is the person capable?",
    right: "Is it my right?",
    timing: "Is now a good time?",
    priority: "Is it important to me?",
    giveToGet: "Am I willing to give to get?",
    relationship: "Is it appropriate to the relationship?",
    clarity: "Am I clear and specific?",
    selfRespect: "Is it important for my self-respect?",
    reciprocity: "Have they given to me before?",
    authority: "Do they have authority over me?",
  };

  const factors = data.factors ?? {};
  let score = 0;
  Object.keys(factorQuestions).forEach((key, idx) => {
    const answer = factors[key] || "(not answered)";
    writeKeyValue(doc, `${idx + 1}. ${factorQuestions[key]}`, answer);

    // Calculate score
    if (answer === "yes") {
      score += key === "authority" ? -1 : 1;
    } else if (answer === "no") {
      score += key === "authority" ? 1 : -1;
    }
  });

  writeSectionTitle(doc, 3, "Score and recommendation");
  writeKeyValue(doc, "Score", String(score > 0 ? "+" : "") + score);

  const action = mode === "Asking" ? "Ask" : "Say no";
  let recommendation = "";
  if (score <= -7) recommendation = "Don't ask / Let it go";
  else if (score <= -3) recommendation = `${action} lightly`;
  else if (score <= 2) recommendation = `${action} with some hesitation`;
  else if (score <= 6) recommendation = `${action} firmly`;
  else recommendation = `${action} as firmly as you can`;
  writeKeyValue(doc, "Recommendation", recommendation);

  writeKeyValue(doc, "Notes", data.notes);
}

// ============ Comparison PDF ============

const COMPARE_METRIC_GROUPS: {
  title: string;
  metrics: { key: string; label: string }[];
}[] = [
  {
    title: "Urges (0-5)",
    metrics: [
      { key: "urgeSelfHarm", label: "Self-harm urge" },
      { key: "urgeSuicide", label: "Suicide urge" },
      { key: "urgeSubstances", label: "Substance urge" },
      { key: "urgeQuitTherapy", label: "Quit therapy urge" },
    ],
  },
  {
    title: "Actions (0-5)",
    metrics: [
      { key: "actSelfHarm", label: "Self-harm" },
      { key: "actSubstances", label: "Substance use" },
      { key: "actOther", label: "Other target" },
    ],
  },
  {
    title: "Emotions (0-5)",
    metrics: [
      { key: "emoAnger", label: "Anger" },
      { key: "emoSadness", label: "Sadness" },
      { key: "emoFear", label: "Fear" },
      { key: "emoShame", label: "Shame" },
      { key: "emoJoy", label: "Joy" },
    ],
  },
];

const COMPARE_SKILL_KEYS = [
  { key: "skillMindfulness", label: "Mindfulness" },
  { key: "skillDistressTolerance", label: "Distress Tolerance" },
  { key: "skillEmotionRegulation", label: "Emotion Regulation" },
  { key: "skillInterpersonal", label: "Interpersonal" },
];

interface WeekStats {
  sum: (key: string) => number;
  avg: (key: string) => number;
  max: (key: string) => number;
  skillsDays: number;
  actionDays: number;
  days: any[];
}

function computeStats(entry: WorksheetEntry): WeekStats {
  const days: any[] = entry.data.days ?? [];
  const sum = (key: string) =>
    days.reduce((acc, d) => acc + (Number(d?.[key] ?? 0) || 0), 0);
  const avg = (key: string) => sum(key) / (days.length || 1);
  const max = (key: string) =>
    days.reduce((m, d) => Math.max(m, Number(d?.[key] ?? 0) || 0), 0);
  const skillsDays = days.filter(
    (d) =>
      d?.skillMindfulness ||
      d?.skillDistressTolerance ||
      d?.skillEmotionRegulation ||
      d?.skillInterpersonal
  ).length;
  const actionDays = days.filter(
    (d) => (d?.actSelfHarm ?? 0) > 0 || (d?.actSubstances ?? 0) > 0
  ).length;
  return { sum, avg, max, skillsDays, actionDays, days };
}

function trendSymbol(left: number, right: number, higherIsBetter: boolean): string {
  const delta = right - left;
  if (Math.abs(delta) < 0.01) return "--";
  const isUp = delta > 0;
  const isGood = higherIsBetter ? isUp : !isUp;
  // For urges/actions/emotions (higherIsBetter=false): decrease is good -> "DN" (green)
  // For joy/skills (higherIsBetter=true): increase is good -> "UP" (green)
  if (isGood) return "DN"; // favorable direction
  return "UP"; // unfavorable direction
}

function trendColor(left: number, right: number, higherIsBetter: boolean): [number, number, number] {
  const delta = right - left;
  if (Math.abs(delta) < 0.01) return [120, 120, 120]; // gray
  const isUp = delta > 0;
  const isGood = higherIsBetter ? isUp : !isUp;
  return isGood ? [22, 163, 74] : [220, 38, 38]; // green or red
}

export function exportComparisonToPdf(
  leftEntry: WorksheetEntry,
  rightEntry: WorksheetEntry
) {
  const doc = newDoc();
  y = PAGE_MARGIN;

  const left = computeStats(leftEntry);
  const right = computeStats(rightEntry);

  // Title
  writeTitle(doc, "Diary Card Comparison");

  // Subtitle: week dates
  const leftLabel = leftEntry.data.weekStartDate
    ? new Date(leftEntry.data.weekStartDate + "T00:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : leftEntry.title;
  const rightLabel = rightEntry.data.weekStartDate
    ? new Date(rightEntry.data.weekStartDate + "T00:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : rightEntry.title;
  writeSubtitle(doc, `Week 1: ${leftLabel}  ->  Week 2: ${rightLabel}`);
  writeSubtitle(
    doc,
    `Generated ${new Date().toLocaleDateString()} · DBT Skills Reference`
  );
  y += 10;

  // High-level stats row
  writeSectionTitle(doc, undefined, "Week at a glance");
  const colWidth = CONTENT_WIDTH / 3;
  const statRow = (label: string, leftVal: number, rightVal: number, higherIsBetter: boolean) => {
    ensureSpace(doc, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text(label, PAGE_MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30);
    doc.text(String(leftVal), PAGE_MARGIN + colWidth, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("->", PAGE_MARGIN + colWidth * 1.5, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30);
    doc.text(String(rightVal), PAGE_MARGIN + colWidth * 1.7, y);
    const [r, g, b] = trendColor(leftVal, rightVal, higherIsBetter);
    doc.setTextColor(r, g, b);
    doc.setFontSize(10);
    doc.text(trendSymbol(leftVal, rightVal, higherIsBetter), PAGE_MARGIN + colWidth * 1.95, y);
    y += 16;
  };
  statRow("Skills-practice days", left.skillsDays, right.skillsDays, true);
  statRow("Action days", left.actionDays, right.actionDays, false);

  // Metric groups
  for (const group of COMPARE_METRIC_GROUPS) {
    writeSectionTitle(doc, undefined, group.title);
    // Table header
    ensureSpace(doc, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(80);
    doc.text("Metric", PAGE_MARGIN, y);
    doc.text("Week 1 (max / avg)", PAGE_MARGIN + colWidth, y);
    doc.text("Trend", PAGE_MARGIN + colWidth * 1.7, y);
    doc.text("Week 2 (max / avg)", PAGE_MARGIN + colWidth * 1.95, y);
    y += 4;
    doc.setDrawColor(200);
    doc.line(PAGE_MARGIN, y, PAGE_MARGIN + CONTENT_WIDTH, y);
    y += 12;

    for (const metric of group.metrics) {
      ensureSpace(doc, 16);
      const leftAvg = left.avg(metric.key);
      const rightAvg = right.avg(metric.key);
      const leftMax = left.max(metric.key);
      const rightMax = right.max(metric.key);
      const higherIsBetter = metric.key === "emoJoy";

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30);
      doc.text(metric.label, PAGE_MARGIN, y);
      doc.setFont("helvetica", "bold");
      doc.text(`${leftMax} / ${leftAvg.toFixed(1)}`, PAGE_MARGIN + colWidth, y);
      const [r, g, b] = trendColor(leftAvg, rightAvg, higherIsBetter);
      doc.setTextColor(r, g, b);
      doc.setFontSize(11);
      doc.text(trendSymbol(leftAvg, rightAvg, higherIsBetter), PAGE_MARGIN + colWidth * 1.75, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30);
      doc.text(`${rightMax} / ${rightAvg.toFixed(1)}`, PAGE_MARGIN + colWidth * 1.95, y);
      y += 14;
    }
    y += 6;
  }

  // Skills usage
  writeSectionTitle(doc, undefined, "Skills used (days/week)");
  ensureSpace(doc, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("Skill module", PAGE_MARGIN, y);
  doc.text("Week 1", PAGE_MARGIN + colWidth, y);
  doc.text("Trend", PAGE_MARGIN + colWidth * 1.7, y);
  doc.text("Week 2", PAGE_MARGIN + colWidth * 1.95, y);
  y += 4;
  doc.setDrawColor(200);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + CONTENT_WIDTH, y);
  y += 12;

  for (const sk of COMPARE_SKILL_KEYS) {
    ensureSpace(doc, 16);
    const leftCount = left.days.filter((d) => d?.[sk.key]).length;
    const rightCount = right.days.filter((d) => d?.[sk.key]).length;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30);
    doc.text(sk.label, PAGE_MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${leftCount}/7`, PAGE_MARGIN + colWidth, y);
    const [r, g, b] = trendColor(leftCount, rightCount, true);
    doc.setTextColor(r, g, b);
    doc.setFontSize(11);
    doc.text(trendSymbol(leftCount, rightCount, true), PAGE_MARGIN + colWidth * 1.75, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30);
    doc.text(`${rightCount}/7`, PAGE_MARGIN + colWidth * 1.95, y);
    y += 14;
  }
  y += 6;

  // Legend
  ensureSpace(doc, 30);
  y += 8;
  doc.setDrawColor(200);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + CONTENT_WIDTH, y);
  y += 14;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    "Legend:  DN = decreased (green = favorable for urges/actions/emotions; red = unfavorable for joy/skills)",
    PAGE_MARGIN,
    y
  );
  y += 10;
  doc.text(
    "         UP = increased (green = favorable for joy/skills; red = unfavorable for urges/actions/emotions)",
    PAGE_MARGIN,
    y
  );
  y += 10;
  doc.text("         -- = no change", PAGE_MARGIN, y);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(
      `DBT Skills Reference · Diary Card Comparison · Generated ${new Date().toLocaleDateString()}`,
      PAGE_MARGIN,
      820
    );
    doc.text(`Page ${i} of ${pageCount}`, 595.28 - PAGE_MARGIN, 820, {
      align: "right",
    });
  }

  // Save with descriptive filename
  const safeLeft = (leftEntry.title || "week-1")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  const safeRight = (rightEntry.title || "week-2")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`comparison-${safeLeft}-vs-${safeRight}-${dateStr}.pdf`);
}
