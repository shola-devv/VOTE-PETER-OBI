import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import connect from "@/lib/db";
import Submission from "@/lib/models/Submission";
import { SubmissionSchema } from "@/lib/schema";
import { submitRatelimit } from "@/lib/rate-limit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODERATION_SYSTEM_PROMPT = `You are a strict content moderator for a political campaign website dedicated to Peter Obi's presidential candidacy.

Your job is to evaluate whether a submitted reason is:
1. Genuinely in favour of Peter Obi as a presidential candidate
2. Factual, specific, and constructive — not vague, offensive, or spam
3. Not a attack on other candidates (submissions should be PRO-Obi, not anti-others)
4. Not misinformation, satire, or gibberish
5. Not in support of Bola Ahmed Tinubu

You must respond with ONLY a valid JSON object in this exact shape:
{
  "approved": true or false,
  "reason": "brief explanation of your decision",
  "aiReply": "if approved, write one encouraging sentence acknowledging the submission and why it matters for Nigeria's future. if rejected for the fact taht it was written in support of Bola Tinubu, write a hot roast f the person critiquing his stance in respect of nigerias current chalenges. If it wasnt rejected for the previous reason but was rejected for some other reason, write one polite sentence explaining why it was not accepted."
}

Do not include anything outside the JSON. No markdown, no code fences, no extra text.`;

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

async function moderateWithGroq(
  reason: string,
  category: string
): Promise<{ approved: boolean; reason: string; aiReply: string }> {
  const userMessage = `Category: ${category}\n\nSubmitted reason: "${reason}"`;

  const result = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: MODERATION_SYSTEM_PROMPT },
      { role: "user",   content: userMessage },
    ],
    max_tokens: 300,
    temperature: 0.3, // low temp = more consistent moderation decisions
  });

  const raw = result.choices?.[0]?.message?.content ?? "";

  try {
    // Strip any accidental markdown fences just in case
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      approved: Boolean(parsed.approved),
      reason:   String(parsed.reason  ?? "No reason given."),
      aiReply:  String(parsed.aiReply ?? "Thank you for your submission."),
    };
  } catch {
    // If Groq returns malformed JSON, fail safe by rejecting
    console.error("Groq moderation JSON parse failed:", raw);
    return {
      approved: false,
      reason:   "Moderation service returned an unexpected response.",
      aiReply:  "We were unable to process your submission at this time. Please try again.",
    };
  }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  // ── Rate limit ─────────────────────────────────────────────────────────
  const { success, remaining } = await submitRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { message: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": "3600", "X-RateLimit-Remaining": "0" } }
    );
  }

  // ── Parse body ─────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  // ── Validate schema ────────────────────────────────────────────────────
  const parsed = SubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid submission.";
    return NextResponse.json({ message }, { status: 400 });
  }

  const { reason, category, source } = parsed.data;

  await connect();

  // ── One submission per IP ──────────────────────────────────────────────
  const already = await Submission.exists({ ip });
  if (already) {
    return NextResponse.json(
      { message: "You have already submitted a reason. One submission per person is allowed." },
      { status: 409 }
    );
  }

  // ── Groq moderation ────────────────────────────────────────────────────
  let moderation: { approved: boolean; reason: string; aiReply: string };
  try {
    moderation = await moderateWithGroq(reason, category);
  } catch (err) {
    console.error("Groq moderation failed:", err);
    return NextResponse.json(
      { message: "Moderation service is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  // ── Rejected by AI ─────────────────────────────────────────────────────
  if (!moderation.approved) {
    return NextResponse.json(
      {
        message: "Your submission was not accepted.",
        aiReply: moderation.aiReply,
        aiGenerated: true,
        moderationReason: moderation.reason,
      },
      { status: 422 }
    );
  }

  // ── Randomiser — silently drop 15% ────────────────────────────────────
  if (!shouldSave()) {
    return NextResponse.json(
      {
        message: "Submission received. Thank you!",
        aiReply: moderation.aiReply,
        aiGenerated: true,
      },
      { status: 201, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  // ── Save to MongoDB ────────────────────────────────────────────────────
  const submission = await Submission.create({
    category,
    reason,
    source,
    ip,
    status: "pending",
    submittedAt: new Date(),
  });

  // ── Discord webhook (fire and forget) ─────────────────────────────────
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
            fields: [
              { name: "Source",      value: source },
              { name: "AI verdict",  value: moderation.reason },
            ],
            color: 0x00c853,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    }).catch(() => {});
  }

  return NextResponse.json(
    {
      message: "Submission received. Thank you!",
      id: submission.id,
      aiReply: moderation.aiReply,
      aiGenerated: true,
    },
    { status: 201, headers: { "X-RateLimit-Remaining": String(remaining) } }
  );
}