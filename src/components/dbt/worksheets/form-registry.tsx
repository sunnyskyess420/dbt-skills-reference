"use client";

// Code-splitting registry: every worksheet form is loaded on demand via
// next/dynamic, so phones download only the form they actually open
// instead of all 52 forms up front. The Record<WorksheetType, ...> type
// makes the compiler enforce that every worksheet type has a form.

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { Loader2 } from "lucide-react";
import type { WorksheetEntry, WorksheetType } from "@/lib/worksheet-storage";

export interface WorksheetFormProps {
  entry: WorksheetEntry;
  onChange: (data: Record<string, any>) => void;
}

export function WorksheetFormLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading worksheet...
    </div>
  );
}

function loadForm(
  loader: () => Promise<
    ComponentType<WorksheetFormProps> | { default: ComponentType<WorksheetFormProps> }
  >
) {
  return dynamic(loader, { loading: WorksheetFormLoading, ssr: false });
}

export const WORKSHEET_FORMS: Record<WorksheetType, ComponentType<WorksheetFormProps>> = {
  "chain-analysis": loadForm(() => import("./chain-analysis-form").then((m) => m.ChainAnalysisForm)),
  "pros-cons": loadForm(() => import("./pros-cons-form").then((m) => m.ProsConsForm)),
  "diary-card": loadForm(() => import("./diary-card-form").then((m) => m.DiaryCardForm)),
  "walking-middle-path": loadForm(() => import("./walking-middle-path-form").then((m) => m.WalkingMiddlePathForm)),
  "missing-links": loadForm(() => import("./missing-links-form").then((m) => m.MissingLinksForm)),
  "dear-man-script": loadForm(() => import("./dear-man-script-form").then((m) => m.DearManScriptForm)),
  "check-the-facts": loadForm(() => import("./check-the-facts-form").then((m) => m.CheckTheFactsForm)),
  "opposite-action": loadForm(() => import("./opposite-action-form").then((m) => m.OppositeActionForm)),
  "radical-acceptance": loadForm(() => import("./radical-acceptance-form").then((m) => m.RadicalAcceptanceForm)),
  "crisis-survival-tracker": loadForm(() => import("./crisis-survival-tracker-form").then((m) => m.CrisisSurvivalTrackerForm)),
  "values-to-actions": loadForm(() => import("./values-to-actions-form").then((m) => m.ValuesToActionsForm)),
  "pleasant-events-diary": loadForm(() => import("./pleasant-events-diary-form").then((m) => m.PleasantEventsDiaryForm)),
  "emotion-diary": loadForm(() => import("./emotion-diary-form").then((m) => m.EmotionDiaryForm)),
  "dialectics-practice": loadForm(() => import("./dialectics-practice-form").then((m) => m.DialecticsPracticeForm)),
  "self-validation": loadForm(() => import("./self-validation-form").then((m) => m.SelfValidationForm)),
  "dime-game": loadForm(() => import("./dime-game-form").then((m) => m.DimeGameForm)),
  "cope-ahead": loadForm(() => import("./cope-ahead-form").then((m) => m.CopeAheadForm)),
  "build-mastery": loadForm(() => import("./build-mastery-form").then((m) => m.BuildMasteryForm)),
  "please-tracker": loadForm(() => import("./please-tracker-form").then((m) => m.PleaseTrackerForm)),
  "nightmare-protocol": loadForm(() => import("./nightmare-protocol-form").then((m) => m.NightmareProtocolForm)),
  "mindfulness-emotions": loadForm(() => import("./mindfulness-emotions-form").then((m) => m.MindfulnessEmotionsForm)),
  "mindfulness-thoughts": loadForm(() => import("./mindfulness-thoughts-form").then((m) => m.MindfulnessThoughtsForm)),
  "turning-mind-willingness": loadForm(() => import("./turning-mind-willingness-form").then((m) => m.TurningMindWillingnessForm)),
  "clarifying-priorities": loadForm(() => import("./clarifying-priorities-form").then((m) => m.ClarifyingPrioritiesForm)),
  "troubleshooting-ie": loadForm(() => import("./troubleshooting-ie-form").then((m) => m.TroubleshootingIeForm)),
  "validating-others": loadForm(() => import("./validating-others-form").then((m) => m.ValidatingOthersForm)),
  "myths-emotions": loadForm(() => import("./myths-emotions-form").then((m) => m.MythsEmotionsForm)),
  "being-effective": loadForm(() => import("./being-effective-form").then((m) => m.BeingEffectiveForm)),
  "wise-mind": loadForm(() => import("./wise-mind-form").then((m) => m.WiseMindForm)),
  "what-skills": loadForm(() => import("./what-skills-form").then((m) => m.WhatSkillsForm)),
  "how-skills": loadForm(() => import("./how-skills-form").then((m) => m.HowSkillsForm)),
  "loving-kindness": loadForm(() => import("./loving-kindness-form").then((m) => m.LovingKindnessForm)),
  "balancing-doing-being": loadForm(() => import("./balancing-doing-being-form").then((m) => m.BalancingDoingBeingForm)),
  "stop-skill": loadForm(() => import("./stop-skill-form").then((m) => m.StopSkillForm)),
  "tipp": loadForm(() => import("./tipp-form").then((m) => m.TippForm)),
  "accepts": loadForm(() => import("./accepts-form").then((m) => m.AcceptsForm)),
  "self-soothing": loadForm(() => import("./self-soothing-form").then((m) => m.SelfSoothingForm)),
  "improve": loadForm(() => import("./improve-form").then((m) => m.ImproveForm)),
  "half-smiling": loadForm(() => import("./half-smiling-form").then((m) => m.HalfSmilingForm)),
  "emotion-model": loadForm(() => import("./emotion-model-form").then((m) => m.EmotionModelForm)),
  "problem-solving": loadForm(() => import("./problem-solving-form").then((m) => m.ProblemSolvingForm)),
  "positives-short": loadForm(() => import("./positives-short-form").then((m) => m.PositivesShortForm)),
  "positives-long": loadForm(() => import("./positives-long-form").then((m) => m.PositivesLongForm)),
  "sleep-hygiene": loadForm(() => import("./sleep-hygiene-form").then((m) => m.SleepHygieneForm)),
  "extreme-emotions": loadForm(() => import("./extreme-emotions-form").then((m) => m.ExtremeEmotionsForm)),
  "clear-mind": loadForm(() => import("./clear-mind-form").then((m) => m.ClearMindForm)),
  "finding-people": loadForm(() => import("./finding-people-form").then((m) => m.FindingPeopleForm)),
  "mindfulness-others": loadForm(() => import("./mindfulness-others-form").then((m) => m.MindfulnessOthersForm)),
  "ending-relationships": loadForm(() => import("./ending-relationships-form").then((m) => m.EndingRelationshipsForm)),
  "options-problems": loadForm(() => import("./options-problems-form").then((m) => m.OptionsProblemsForm)),
  "dialectical-abstinence": loadForm(() => import("./dialectical-abstinence-form").then((m) => m.DialecticalAbstinenceForm)),
  "behavior-change": loadForm(() => import("./behavior-change-form").then((m) => m.BehaviorChangeForm)),
};