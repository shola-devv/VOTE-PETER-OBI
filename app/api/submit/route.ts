import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { SubmissionSchema } from "@/lib/schema";
import { submitRatelimit } from "@/lib/rate-limit";

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function shouldSave(): boolean {
  return Math.random() < 0.85;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  const { success, remaining } = await submitRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { message: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": "3600", "X-RateLimit-Remaining": "0" } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  const parsed = SubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid submission.";
    return NextResponse.json({ message }, { status: 400 });
  }

  const { reason, category, source } = parsed.data;

  await connect();

  const already = await Submission.exists({ ip });
  if (already) {
    return NextResponse.json(
      { message: "You have already submitted a reason. One submission per person is allowed." },
      { status: 409 }
    );
  }

  if (!shouldSave()) {
    return NextResponse.json(
      { message: "Submission received. Thank you!" },
      { status: 201, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  const submission = await Submission.create({
    category,
    reason,
    source,
    ip,
    status: "pending",
    submittedAt: new Date(),
  });

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: `New submission #${submission.id} — ${category}`,
            description: `> ${reason.slice(0, 300)}`,
            fields: [{ name: "Source", value: source }],
            color: 0x00c853,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    }).catch(() => {});
  }

  return NextResponse.json(
    { message: "Submission received. Thank you!", id: submission.id },
    { status: 201, headers: { "X-RateLimit-Remaining": String(remaining) } }
  );
}