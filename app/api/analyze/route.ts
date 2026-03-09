export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai";
import { callOpenAI, callGemini } from "@/lib/providers";

export async function POST(req: Request) {
  try {
    const { sourceCode, provider = "openai" } = await req.json();

    if (!sourceCode) {
      return NextResponse.json({ error: "No Solidity source provided" }, { status: 400 });
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

    return NextResponse.json({ success: true, providerUsed: provider, result: JSON.parse(aiResponse) });
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
