// TEMPORARY one-off admin route for password recovery.
// DELETE THIS FILE (and the ADMIN_RESET_TOKEN env var) after use.
//
// POST /api/admin-reset
// Body: { "token": "<ADMIN_RESET_TOKEN>", "email": "...", "password": "..." }

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const expected = process.env.ADMIN_RESET_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  let body: { token?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.token || body.token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || password.length < 6) {
    return NextResponse.json(
      { error: "email and password (min 6 chars) are required" },
      { status: 400 },
    );
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "No account found" }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.update({ where: { id: user.id }, data: { passwordHash } });
  return NextResponse.json({ ok: true });
}
