// Sync API for DBT Skills Reference.
//
// Stores the user's full app state (worksheets, bookmarks, settings, etc.)
// as a single JSON blob keyed by user ID. Last-write-wins — each push
// overwrites whatever was on the server.
//
// Both endpoints require an authenticated session.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Force dynamic evaluation — this route must never be cached because the
// response depends on the authenticated user and their latest data.
export const dynamic = "force-dynamic";

// Maximum payload size: 5 MB of JSON. Worksheet data is small (a few KB each),
// so this is generous but still protects the server from runaway payloads.
const MAX_PAYLOAD_BYTES = 5 * 1024 * 1024;

// All client-side localStorage keys for the DBT app start with this prefix.
// We accept any key that matches it, which keeps the sync layer future-proof
// as new features add their own keys.
const KEY_PREFIX = "dbt-skills:";

// Keys that should never be stored on the server (device-specific).
const EXCLUDE_KEYS = new Set<string>([
  "dbt-skills:pwa-install-dismissed",
  "dbt-skills:welcome-seen",
]);

function sanitizePayload(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const obj = input as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    if (!key.startsWith(KEY_PREFIX)) continue;
    if (EXCLUDE_KEYS.has(key)) continue;
    out[key] = obj[key];
  }
  return out;
}

// Resolve the authenticated user's id from the NextAuth session.
// Returns null if not signed in. Used by both GET and POST.
async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return (session.user as { id?: string }).id ?? null;
}

// GET /api/sync — fetch the user's stored payload.
// Returns 200 with `{ payload: null, updatedAt: null }` if the user has never
// pushed data (e.g. first sign-in on a new device).
export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await db.userData.findUnique({ where: { userId } });
  if (!row) {
    return NextResponse.json(
      { payload: null, updatedAt: null },
      { headers: { "cache-control": "no-store, max-age=0" } }
    );
  }
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(row.payload);
  } catch {
    parsed = null;
  }
  return NextResponse.json(
    { payload: parsed, updatedAt: row.updatedAt },
    { headers: { "cache-control": "no-store, max-age=0" } }
  );
}

// POST /api/sync — replace the user's stored payload with the one sent.
// Body: `{ payload: { ... } }` where the payload contains any subset of the
// allowed keys (worksheets, bookmarks, etc.).
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = (body as { payload?: unknown })?.payload;
  const sanitized = sanitizePayload(raw);
  if (!sanitized) {
    return NextResponse.json(
      { error: "Payload must be an object." },
      { status: 400 }
    );
  }

  // Rough size guard before we touch the DB.
  const serialized = JSON.stringify(sanitized);
  if (serialized.length > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: "Payload too large. Reduce your data and try again." },
      { status: 413 }
    );
  }

  const row = await db.userData.upsert({
    where: { userId },
    create: { userId, payload: serialized },
    update: { payload: serialized },
  });

  return NextResponse.json({ ok: true, updatedAt: row.updatedAt });
}
