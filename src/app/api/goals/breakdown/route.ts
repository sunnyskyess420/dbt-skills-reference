// POST /api/goals/breakdown
//
// AI-powered goal breakdown for the "My Goals" section. Takes a goal title +
// optional description, returns a DBT-informed plan: small steps, matching
// skills from THIS app's catalog (validated against real skill ids), likely
// obstacles, and progress signals.
//
// z-ai-web-dev-sdk is backend-only — this route is the only place it runs.

import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { SKILLS } from "@/data/skills";

interface PlanStep {
  text: string;
  hint?: string;
}

interface BreakdownPlan {
  summary: string;
  steps: PlanStep[];
  skillIds: string[];
  skillReasons: Record<string, string>;
  obstacles?: string;
  progressSignals?: string[];
}

function extractJson(raw: string): unknown {
  // Models sometimes wrap JSON in ```json ... ``` — strip fences first.
  const cleaned = raw
    .replace(/```json\s*/gi, "```")
    .split("```")
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  const candidates = [raw, ...cleaned];
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // try next candidate
    }
  }
  // Last resort: grab the outermost {...} block.
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(raw.slice(start, end + 1));
    } catch {
      return null;
    }
  }
  return null;
}

function clampStr(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function buildSystemPrompt(catalog: string): string {
  return [
    "You are a compassionate, practical DBT-informed goal coach embedded in a DBT skills reference app used during group therapy.",
    "The user is working on a personal goal, often related to anxiety, avoidance, emotions, relationships, or building daily routines.",
    "Your job: break the goal into small, concrete, doable steps (SMART-ish but human), and recommend which DBT skills from the app's catalog can help.",
    "Rules:",
    "- Write in warm, plain, second-person language. No diagnosis, no medical advice.",
    "- Steps must be small and observable. Prefer 5-7 steps. Each step may have a short hint (one sentence).",
    "- Only recommend skills that exist in the provided catalog, referenced by their exact id. Pick 3-6 skills. Do not invent ids.",
    "- For every recommended skill give a one-sentence reason tied to THIS goal.",
    "- 'obstacles': one short paragraph naming likely obstacles and a cope-ahead style plan.",
    "- 'progressSignals': 3-4 observable signs of progress (practicing counts as progress, not just feeling calm).",
    "- Respond with VALID JSON ONLY, no markdown fences, matching exactly:",
    '{"summary": string, "steps": [{"text": string, "hint": string}], "skillIds": string[], "skillReasons": {"<skillId>": string}, "obstacles": string, "progressSignals": string[]}',
    "",
    "SKILL CATALOG (id | name | module | one-liner):",
    catalog,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  let title = "";
  let description = "";
  try {
    const body = await req.json();
    title = clampStr(body?.title, 200);
    description = clampStr(body?.description, 2000);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!title) {
    return NextResponse.json({ ok: false, error: "A goal title is required." }, { status: 400 });
  }

  const catalog = SKILLS.map(
    (s) => `- ${s.id} | ${s.name} | ${s.module} | ${s.oneLiner}`
  ).join("\n");

  const userPrompt = [
    `My goal: ${title}`,
    description ? `Details: ${description}` : null,
    "Break this down for me and tell me which skills from the catalog can help.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: buildSystemPrompt(catalog) },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
    });

    const content = completion.choices[0]?.message?.content ?? "";
    const parsed = extractJson(content) as Partial<BreakdownPlan> | null;

    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json(
        { ok: false, error: "The AI response could not be parsed." },
        { status: 502 }
      );
    }

    // Validate skill ids against the real catalog; drop anything invented.
    const validIds = new Set(SKILLS.map((s) => s.id));
    const skillIds = Array.isArray(parsed.skillIds)
      ? [...new Set(parsed.skillIds.filter((id): id is string => typeof id === "string" && validIds.has(id)))]
      : [];
    const skillReasons: Record<string, string> = {};
    if (parsed.skillReasons && typeof parsed.skillReasons === "object") {
      for (const [id, reason] of Object.entries(parsed.skillReasons)) {
        if (validIds.has(id) && typeof reason === "string") {
          skillReasons[id] = reason.slice(0, 300);
        }
      }
    }

    const steps: PlanStep[] = Array.isArray(parsed.steps)
      ? parsed.steps
          .slice(0, 8)
          .map((s) => ({ text: clampStr((s as PlanStep)?.text, 400), hint: clampStr((s as PlanStep)?.hint, 300) || undefined }))
          .filter((s) => s.text.length > 0)
      : [];

    const plan: BreakdownPlan = {
      summary: clampStr(parsed.summary, 600),
      steps,
      skillIds,
      skillReasons,
      obstacles: clampStr(parsed.obstacles, 900) || undefined,
      progressSignals: Array.isArray(parsed.progressSignals)
        ? parsed.progressSignals
            .filter((s): s is string => typeof s === "string")
            .slice(0, 5)
            .map((s) => s.slice(0, 200))
        : undefined,
    };

    return NextResponse.json({ ok: true, plan });
  } catch (err) {
    console.error("[goals/breakdown] AI request failed:", err);
    return NextResponse.json(
      { ok: false, error: "The AI service is unavailable right now." },
      { status: 500 }
    );
  }
}
