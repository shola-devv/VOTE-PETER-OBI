// /app/api/submit/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Handles reason submissions with 1-per-IP enforcement.
//
// For production you need a real database. This uses an in-memory Map as a
// placeholder. Replace the `submissions` Map with a DB call (Postgres, Mongo,
// Supabase, Upstash, etc.) and the `pending` array with an insert.
//
// Optional: set DISCORD_WEBHOOK_URL or TELEGRAM_BOT_TOKEN env vars to receive
// new submission alerts.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

// ── In-memory store (replace with a real DB in production) ──────────────────
// Key: IP address, Value: submission timestamp
const submissions = new Map<string, Date>();

// Simulated pending review queue
const pending: {
  ip: string;
  reason: string;
  category: string;
  source: string;
  submittedAt: Date;
}[] = [];
// ────────────────────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { reason, category, source } = await req.json();
    const ip = getClientIp(req);

    // ── Validation ──────────────────────────────────────────────────────────
    if (!reason || typeof reason !== "string" || reason.trim().length < 30) {
      return NextResponse.json(
        { message: "Reason must be at least 30 characters." },
        { status: 400 }
      );
    }

    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { message: "Please select a category." },
        { status: 400 }
      );
    }

    if (!source || !isValidUrl(source)) {
      return NextResponse.json(
        { message: "Please provide a valid source URL." },
        { status: 400 }
      );
    }

    // ── Duplicate IP check ──────────────────────────────────────────────────
    if (submissions.has(ip)) {
      return NextResponse.json(
        {
          message:
            "You have already submitted a reason. Only one submission per person is allowed.",
        },
        { status: 409 }
      );
    }

    // ── Store (replace with real DB insert) ─────────────────────────────────
    submissions.set(ip, new Date());
    pending.push({
      ip,
      reason: reason.trim(),
      category,
      source: source.trim(),
      submittedAt: new Date(),
    });

    // ── Optional: Discord webhook notification ───────────────────────────────
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `**New submission** [${category}]\n> ${reason.trim().slice(0, 300)}\nSource: ${source}`,
          }),
        });
      } catch {
        // Non-critical — don't fail the response
      }
    }

    return NextResponse.json(
      { message: "Submission received. Thank you!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }
}

// ── Admin peek endpoint (remove or protect in production) ───────────────────
export async function GET(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }
  return NextResponse.json({ count: pending.length, submissions: pending });
}
