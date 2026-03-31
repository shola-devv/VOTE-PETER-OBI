export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { buildSystemPrompt } from "@/lib/ai";
import { callOpenAI, callGemini } from "@/lib/providers";
import { freeContractRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const { sourceCode, provider = "openai" } = await req.json();

    if (!sourceCode) {
      return NextResponse.json({ error: "No Solidity source provided" }, { status: 400 });
    }

    // Free-tier rate limit: 10 requests per 24 hours for anonymous / unpaid usage
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
    const authToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = authToken?.id as string | undefined;
    const limitResult = await freeContractRateLimit.limit(`analyze-free:${userId ?? ip}`);

    if (!limitResult.success) {
      return new NextResponse(JSON.stringify({ error: "Free plan rate limit reached. Try again in 24h." }), {
        status: 429,
        headers: {
          "Retry-After": "86400",
          "Content-Type": "application/json",
        },
      });
    }

    // 1️⃣ Fetch live gas data
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: "BASE_URL not configured" }, { status: 500 });
    }

    const gasRes = await fetch(`${baseUrl}/api/market-data`);
    const gasJson = await gasRes.json();
    const gasData = gasJson.data || gasJson;

    // 2️⃣ Build system prompt with gas data
    const systemPrompt = buildSystemPrompt(gasData);

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: sourceCode },
    ];

    // 3️⃣ Call OpenAI by default, fallback to Gemini
    let aiResponse: any;

    try {
      if (provider === "gemini") {
        aiResponse = await callGemini(messages);
      } else {
        aiResponse = await callOpenAI(messages);
      }
    } catch (err) {
      console.warn("Primary provider failed, falling back to Gemini");
      aiResponse = await callGemini(messages);
    }

    let parsedResult: unknown;
    try {
      parsedResult = JSON.parse(aiResponse);
    } catch {
      parsedResult = aiResponse;
    }

    return NextResponse.json({ success: true, providerUsed: provider, result: parsedResult });
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
