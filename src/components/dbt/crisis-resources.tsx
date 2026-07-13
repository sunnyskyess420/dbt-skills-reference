"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  LifeBuoy,
  Phone,
  MessageSquare,
  Wind,
  Eye,
  Droplet,
  Square,
  Activity,
  ShieldPlus,
  Printer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "dbt-skills:safety-plan";

interface SafetyPlan {
  warningSigns: string;
  copingStrategies: string;
  distractions: string;
  socialContacts: string;
  professionalContacts: string;
  whatHelpedBefore: string;
  reasonsToLive: string;
}

function defaultPlan(): SafetyPlan {
  return {
    warningSigns: "",
    copingStrategies: "",
    distractions: "",
    socialContacts: "",
    professionalContacts: "",
    whatHelpedBefore: "",
    reasonsToLive: "",
  };
}

const HOTLINES = [
  {
    name: "9-8-8 Suicide Crisis Helpline",
    number: "Call or text 988",
    detail: "Available 24/7 across Canada. Call or text 988, or chat at 988.ca",
    icon: Phone,
    href: "tel:988",
  },
  {
    name: "Kids Help Phone",
    number: "1-800-668-6868",
    detail: "For youth and young adults. Call or text CONNECT to 686868",
    icon: MessageSquare,
    href: "tel:18006686868",
  },
  {
    name: "Talk Suicide Canada",
    number: "1-833-456-4566",
    detail: "Suicide prevention support. Available 24/7 in English and French",
    icon: Phone,
    href: "tel:18334564566",
  },
  {
    name: "Assaulted Women's Helpline (Ontario)",
    number: "1-866-863-0511",
    detail: "24/7 crisis support for women experiencing violence. TTY 1-866-863-7868",
    icon: Phone,
    href: "tel:18668630511",
  },
  {
    name: "Crisis Services Canada",
    number: "Text 45645",
    detail: "Text CONNECT to 45645 for crisis support via text (charges may apply)",
    icon: MessageSquare,
    href: "sms:45645?body=CONNECT",
  },
];

const GROUNDING_EXERCISES = [
  {
    id: "breathing",
    title: "4-7-8 Breathing",
    icon: Wind,
    description: "Slows your heart rate and calms your nervous system. Can be done anywhere.",
    steps: [
      "Inhale through your nose for 4 seconds",
      "Hold your breath for 7 seconds",
      "Exhale through your mouth for 8 seconds (make a whoosh sound)",
      "Repeat 4 times",
    ],
    tip: "The long exhale is what activates your parasympathetic nervous system. If 7 seconds is too long to hold, start with 4-4-6 and work up.",
  },
  {
    id: "54321",
    title: "5-4-3-2-1 Grounding",
    icon: Eye,
    description: "Pulls your attention out of your thoughts and into your physical surroundings.",
    steps: [
      "Name 5 things you can SEE around you",
      "Name 4 things you can FEEL (your feet on the floor, the chair, your clothes)",
      "Name 3 things you can HEAR",
      "Name 2 things you can SMELL",
      "Name 1 thing you can TASTE",
    ],
    tip: "Don't rush. Actually look around and notice each thing. The point is to be present, not to finish.",
  },
  {
    id: "cold-water",
    title: "Cold Water (TIPP)",
    icon: Droplet,
    description: "Triggers the dive reflex — rapid heart-rate drop. The fastest body-based calming skill.",
    steps: [
      "Get cold water (a bowl, or splash from the tap)",
      "Hold your breath",
      "Splash cold water on your face (forehead to cheeks, around the eyes) for 10-30 seconds",
      "OR press an ice pack against your eyes and cheeks",
      "Breathe normally and notice the shift",
    ],
    tip: "Cardiac caution: if you have a heart condition, check with your doctor before using very cold water. The effect is temporary (60-90 seconds) — use that window to apply another skill.",
  },
  {
    id: "stop",
    title: "STOP Skill",
    icon: Square,
    description: "Interrupts the autopilot of an emotional reaction. Takes 5 seconds.",
    steps: [
      "S — Stop. Freeze. Don't move, don't act, don't speak.",
      "T — Take a step back. Physically if possible. Take a breath.",
      "O — Observe. What am I feeling? What's the situation? What do I actually want?",
      "P — Proceed mindfully. Choose an action that serves your goal, not your impulse.",
    ],
    tip: "STOP buys you time. Even 5 seconds of pause can prevent hours of cleanup. Use it early, before the emotion peaks.",
  },
  {
    id: "body-scan",
    title: "Quick Body Scan",
    icon: Activity,
    description: "Releases physical tension you may not even know you're holding. Takes 2 minutes.",
    steps: [
      "Sit or lie comfortably. Close your eyes if you want.",
      "Notice your feet. Tense them for 3 seconds, then release.",
      "Move up: legs, belly, shoulders, hands, jaw, forehead — tense each for 3 seconds, then release.",
      "Notice the contrast between tension and relaxation.",
      "Take 3 slow breaths. Open your eyes.",
    ],
    tip: "Don't tense so hard you cramp. The goal is to notice the difference between tense and relaxed, so you can catch tension earlier next time.",
  },
];

const SAFETY_PLAN_FIELDS: { key: keyof SafetyPlan; label: string; placeholder: string; hint?: string }[] = [
  {
    key: "warningSigns",
    label: "My warning signs",
    placeholder: "I know I'm heading toward crisis when... (e.g., I stop eating, I isolate, I can't sleep, I start thinking everyone would be better off)",
    hint: "These are the early signs, not the crisis itself. Catching them early is the point.",
  },
  {
    key: "copingStrategies",
    label: "Things I can do to cope",
    placeholder: "e.g., Use TIPP, go for a walk, text a friend, do the 4-7-8 breathing, pet my dog...",
    hint: "List specific skills and actions you can take without anyone else's help.",
  },
  {
    key: "distractions",
    label: "Things that distract me",
    placeholder: "e.g., Watch a specific show, play a game, listen to a playlist, do a puzzle, read...",
    hint: "These don't solve the problem but can buy time until the intensity drops.",
  },
  {
    key: "socialContacts",
    label: "People I can reach out to",
    placeholder: "Name and number — e.g., Sarah (555-0100), Mom (555-0200), my sponsor Joe (555-0300)",
    hint: "Include people who know about your situation. It's okay if the list is short.",
  },
  {
    key: "professionalContacts",
    label: "Professional contacts",
    placeholder: "e.g., My therapist: Dr. Smith (555-0400), my psychiatrist, the crisis line (988)",
  },
  {
    key: "whatHelpedBefore",
    label: "What has helped in the past",
    placeholder: "Think about previous crises. What actually worked? What did you do that helped you get through?",
  },
  {
    key: "reasonsToLive",
    label: "My reasons to keep going",
    placeholder: "e.g., My dog needs me, I want to see my niece grow up, I haven't finished my book, spring is coming...",
    hint: "These don't have to be grand. Small reasons count. Write as many as you can think of.",
  },
];

export function CrisisResources() {
  const [plan, setPlan] = React.useState<SafetyPlan>(defaultPlan);
  const [expandedExercise, setExpandedExercise] = React.useState<string | null>("breathing");
  const [showSafetyPlan, setShowSafetyPlan] = React.useState(false);

  // Load safety plan from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPlan({ ...defaultPlan(), ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  const updatePlan = (key: keyof SafetyPlan, value: string) => {
    const next = { ...plan, [key]: value };
    setPlan(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <LifeBuoy className="h-6 w-6" />
            Crisis Resources
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            If you're in crisis right now, call or text <strong>988</strong>. Below are Canadian
            crisis hotlines, grounding exercises, and your personal safety plan.
          </p>
        </div>

        {/* Hotlines — always visible, prominent */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Canadian crisis hotlines (available 24/7)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {HOTLINES.map((hotline) => {
              const Icon = hotline.icon;
              return (
                <a
                  key={hotline.name}
                  href={hotline.href}
                  className="flex items-start gap-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{hotline.name}</div>
                    <div className="text-lg font-bold text-primary">{hotline.number}</div>
                    <div className="text-[11px] text-muted-foreground">{hotline.detail}</div>
                  </div>
                </a>
              );
            })}
          </CardContent>
        </Card>

        {/* Grounding exercises */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Wind className="h-4 w-4" />
              Grounding exercises you can do right now
            </CardTitle>
            <p className="text-[11px] text-muted-foreground mt-1">
              When you're too overwhelmed to think, pick one and follow the steps. Don't try to do them perfectly — just do them.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {GROUNDING_EXERCISES.map((exercise) => {
              const Icon = exercise.icon;
              const isExpanded = expandedExercise === exercise.id;
              return (
                <div
                  key={exercise.id}
                  className={cn(
                    "rounded-md border transition-colors",
                    isExpanded ? "border-primary/50 bg-primary/5" : "border-border"
                  )}
                >
                  <button
                    onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                    className="w-full flex items-start gap-3 p-3 text-left"
                  >
                    <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{exercise.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{exercise.description}</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 pl-11 space-y-3">
                      <ol className="space-y-1.5">
                        {exercise.steps.map((step, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="font-mono font-semibold text-xs text-primary shrink-0 mt-0.5">
                              {i + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                      {exercise.tip && (
                        <div className="rounded-md bg-muted/50 p-2 text-[11px] text-muted-foreground">
                          <strong>Tip:</strong> {exercise.tip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Safety Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldPlus className="h-4 w-4" />
                My Safety Plan
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.print()}
                  className="print:hidden"
                >
                  <Printer className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSafetyPlan(!showSafetyPlan)}
                  className="print:hidden"
                >
                  {showSafetyPlan ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Fill this in ahead of time, when you're calm. It's saved to your browser.
              Print it and keep it where you can find it. Your therapist can help you complete it.
            </p>
          </CardHeader>
          <CardContent className={cn("space-y-4", !showSafetyPlan && "hidden print:block")}>
            {SAFETY_PLAN_FIELDS.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {field.label}
                </Label>
                <Textarea
                  value={plan[field.key]}
                  onChange={(e) => updatePlan(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="resize-y"
                />
                {field.hint && (
                  <p className="text-[10px] text-muted-foreground">{field.hint}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Print-only safety plan */}
        <div className="hidden print:block space-y-3 mt-6">
          {SAFETY_PLAN_FIELDS.map((field) => (
            <div key={field.key}>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">{field.label}</div>
              <div className="text-sm mt-1 min-h-[1.5rem] whitespace-pre-wrap">
                {plan[field.key] || <span className="text-gray-400 italic">(blank)</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-[11px] text-muted-foreground">
          <p>
            <strong>This app is not a substitute for professional help.</strong> If you are in immediate
            danger, call 911. If you are having thoughts of suicide, call or text 988. The resources on
            this page are for support, not replacement of treatment. All numbers listed are Canadian.
          </p>
        </div>
      </div>
    </div>
  );
}
