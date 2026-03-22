/*

import { NextRequest, NextResponse } from "next/server"


import { OpenAI } from "openai";
import { estimateComplexity, fetchChainGasData } from "@/lib/coinstats";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisRequest {
  contractCode: string;
}

interface AnalysisResponse {
  success: boolean;
  contractCode: string;
  gasEstimates: Array<{
    chainId: string;
    chainName: string;
    gasPrice: number;
    estimatedGasCost: number;
    tokenSymbol: string;
  }>;
  optimizationSuggestions: string;
  complexity: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
   
     const body: AnalysisRequest = await request.json();
     console.log("BODY KEYS:", Object.keys(body));
console.log("contractCode value:", body.contractCode);
console.log("contractCode type:", typeof body.contractCode);


    const { contractCode } = body;
    console.log("CONTRACT CODE LENGTH:", contractCode?.length);

    if (!contractCode || contractCode.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Contract code is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Run complexity + gas fetch in parallel, gas failing won't block analysis
    const [complexity, chainGasData] = await Promise.all([
      Promise.resolve(estimateComplexity(contractCode)),
      fetchChainGasData().catch((err) => {
        console.warn("⚠️ Gas data unavailable, skipping:", err);
        return [];
      }),
    ]);

    console.log("✅ Complexity:", complexity);
    console.log("✅ Gas chains returned:", chainGasData.length);

    const systemPrompt = `You are an expert smart contract auditor and gas optimization specialist.
Analyze the provided Solidity smart contract code and provide:
1. An estimate of the contract's gas costs based on the chain data given
2. Specific optimization recommendations to reduce gas costs
3. Security considerations
4. An overall complexity assessment (Low, Medium, High) based on the code structure and patterns used.
Keep your response concise but detailed, focusing on actionable improvements.`;

    const userPrompt = `Please analyze this smart contract and provide optimization suggestions:

\`\`\`solidity
${contractCode}
\`\`\`

Focus on:
- Gas optimization opportunities
- Storage patterns that could be more efficient
- Function call patterns that consume unnecessary gas
- Loop optimizations
- State variable packing opportunities`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const optimizationSuggestions =
      completion.choices[0]?.message?.content ||
      "Unable to generate optimization suggestions";

    console.log("✅ OpenAI response received");

    return NextResponse.json({
      success: true,
      contractCode: contractCode.substring(0, 100) + "...",
      gasEstimates: chainGasData,
      optimizationSuggestions,
      complexity,
    } as AnalysisResponse);
  } catch (error) {
    console.error("❌ Error analyzing contract:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: `Failed to analyze contract: ${errorMessage}` },
      { status: 500 }
    );
  }
}




////GEMINI CALLS



import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { estimateComplexity, fetchChainGasData } from "@/lib/coinstats";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface AnalysisRequest {
  contractCode: string;
}

interface AnalysisResponse {
  success: boolean;
  contractCode: string;
  gasEstimates: Array<{
    chainId: string;
    chainName: string;
    gasPrice: number;
    estimatedGasCost: number;
    tokenSymbol: string;
  }>;
  optimizationSuggestions: string;
  complexity: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AnalysisRequest = await request.json();
    const { contractCode } = body;

    console.log("CONTRACT CODE LENGTH:", contractCode?.length);

    if (!contractCode || contractCode.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Contract code is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Run complexity + gas fetch in parallel, gas failing won't block analysis
    const [complexity, chainGasData] = await Promise.all([
      Promise.resolve(estimateComplexity(contractCode)),
      fetchChainGasData().catch((err) => {
        console.warn("⚠️ Gas data unavailable, skipping:", err);
        return [];
      }),
    ]);

    console.log("✅ Complexity:", complexity);
    console.log("✅ Gas chains returned:", chainGasData.length);

    const systemPrompt = `You are an expert smart contract auditor and gas optimization specialist.
Analyze the provided Solidity smart contract code and provide:
1. An estimate of the contract's gas costs based on the chain data given
2. Specific optimization recommendations to reduce gas costs
3. Security considerations
4. An overall complexity assessment (Low, Medium, High) based on the code structure and patterns used.
Keep your response concise but detailed, focusing on actionable improvements.`;

    const userPrompt = `Please analyze this smart contract and provide optimization suggestions:

\`\`\`solidity
${contractCode}
\`\`\`

Focus on:
- Gas optimization opportunities
- Storage patterns that could be more efficient
- Function call patterns that consume unnecessary gas
- Loop optimizations
- State variable packing opportunities`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
   
    const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
    const optimizationSuggestions = result.response.text() || "Unable to generate suggestions";

    console.log("✅ Gemini response received");

    return NextResponse.json({
      success: true,
      contractCode: contractCode.substring(0, 100) + "...",
      gasEstimates: chainGasData,
      optimizationSuggestions,
      complexity,
    } as AnalysisResponse);
  } catch (error) {
    console.error("❌ Error analyzing contract:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: `Failed to analyze contract: ${errorMessage}` },
      { status: 500 }
    );
  }
}

*/



import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { estimateComplexity, fetchChainGasData } from "@/lib/coinstats";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface AnalysisRequest {
  contractCode: string;
}

interface AnalysisResponse {
  success: boolean;
  contractCode: string;
  gasEstimates: Array<{
    chainId: string;
    chainName: string;
    gasPrice: number;
    estimatedGasCost: number;
    tokenSymbol: string;
  }>;
  optimizationSuggestions: string;
  complexity: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AnalysisRequest = await request.json();
    const { contractCode } = body;

    console.log("CONTRACT CODE LENGTH:", contractCode?.length);

    if (!contractCode || contractCode.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Contract code is required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Groq API key not configured" },
        { status: 500 }
      );
    }

    // Run complexity + gas fetch in parallel, gas failing won't block analysis
    const [complexity, chainGasData] = await Promise.all([
      Promise.resolve(estimateComplexity(contractCode)),
      fetchChainGasData().catch((err) => {
        console.warn("⚠️ Gas data unavailable, skipping:", err);
        return [];
      }),
    ]);

    console.log("✅ Complexity:", complexity);
    console.log("✅ Gas chains returned:", chainGasData.length);

    const systemPrompt = `You are an expert smart contract auditor and gas optimization specialist.
Analyze the provided Solidity smart contract code and provide:
1. An estimate of the contract's gas costs based on the chain data given
2. Specific optimization recommendations to reduce gas costs
3. Security considerations
4. An overall complexity assessment (Low, Medium, High) based on the code structure and patterns used.
Keep your response concise but detailed, focusing on actionable improvements.`;

    const userPrompt = `Please analyze this smart contract and provide optimization suggestions:

\`\`\`solidity
${contractCode}
\`\`\`

Focus on:
- Gas optimization opportunities
- Storage patterns that could be more efficient
- Function call patterns that consume unnecessary gas
- Loop optimizations
- State variable packing opportunities`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const optimizationSuggestions =
      completion.choices[0]?.message?.content ||
      "Unable to generate suggestions";

    console.log("✅ Groq response received");

    return NextResponse.json({
      success: true,
      contractCode: contractCode.substring(0, 100) + "...",
      gasEstimates: chainGasData,
      optimizationSuggestions,
      complexity,
    } as AnalysisResponse);
  } catch (error) {
    console.error("❌ Error analyzing contract:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: `Failed to analyze contract: ${errorMessage}` },
      { status: 500 }
    );
  }
}