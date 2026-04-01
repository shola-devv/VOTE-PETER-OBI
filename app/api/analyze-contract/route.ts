import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuthOptions";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { estimateComplexity, fetchChainGasData } from "@/lib/coinstats";

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

async function analyzeWithOpenAI(contractCode: string, apiKey: string): Promise<string> {
  const openai = new OpenAI({ apiKey });

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

  return completion.choices[0]?.message?.content || "Unable to generate optimization suggestions";
}

async function analyzeWithGemini(contractCode: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are an expert smart contract auditor and gas optimization specialist.
Analyze the provided Solidity smart contract code and provide:
1. An estimate of the contract's gas costs based on the chain data given
2. Specific optimization recommendations to reduce gas costs
3. Security considerations
4. An overall complexity assessment (Low, Medium, High) based on the code structure and patterns used.
Keep your response concise but detailed, focusing on actionable improvements.

Please analyze this smart contract and provide optimization suggestions:

\`\`\`solidity
${contractCode}
\`\`\`

Focus on:
- Gas optimization opportunities
- Storage patterns that could be more efficient
- Function call patterns that consume unnecessary gas
- Loop optimizations
- State variable packing opportunities`;

  const result = await model.generateContent(prompt);
  return result.response.text() || "Unable to generate optimization suggestions";
}

async function analyzeWithGroq(contractCode: string): Promise<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

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
    model: "mixtral-8x7b-32768",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 1500,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || "Unable to generate optimization suggestions";
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions as any);

    const body: AnalysisRequest = await request.json();
    const { contractCode } = body;

    if (!contractCode || contractCode.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Contract code is required" },
        { status: 400 }
      );
    }

    // Determine which API to use
    let apiProvider: 'openai' | 'gemini' | 'groq' = 'groq';
    let apiKey: string | undefined;

    if (session?.user?.apiKey && session.user.apiProvider) {
      apiProvider = session.user.apiProvider as 'openai' | 'gemini' | 'groq';
      apiKey = session.user.apiKey;
    }

    // Validate API key for user-provided keys
    if (apiProvider !== 'groq' && !apiKey) {
      return NextResponse.json(
        { success: false, error: "API key not configured for selected provider" },
        { status: 400 }
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
    console.log("✅ Using API provider:", apiProvider);

    let optimizationSuggestions: string;

    try {
      if (apiProvider === 'openai' && apiKey) {
        optimizationSuggestions = await analyzeWithOpenAI(contractCode, apiKey);
      } else if (apiProvider === 'gemini' && apiKey) {
        optimizationSuggestions = await analyzeWithGemini(contractCode, apiKey);
      } else {
        // Default to Groq
        if (!process.env.GROQ_API_KEY) {
          return NextResponse.json(
            { success: false, error: "Groq API key not configured" },
            { status: 500 }
          );
        }
        optimizationSuggestions = await analyzeWithGroq(contractCode);
      }
    } catch (apiError) {
      console.error("❌ API call failed:", apiError);
      // Fallback to Groq if user API fails
      if (apiProvider !== 'groq' && process.env.GROQ_API_KEY) {
        console.log("🔄 Falling back to Groq");
        optimizationSuggestions = await analyzeWithGroq(contractCode);
      } else {
        throw apiError;
      }
    }

    console.log("✅ Analysis response received");

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
import { getToken } from "next-auth/jwt";
import Groq from "groq-sdk";
import { estimateComplexity, fetchChainGasData } from "@/lib/coinstats";
import { callOpenAI, callGemini } from "@/lib/providers";
import { freeContractRateLimit, mediumRatelimit, burstRatelimit } from "@/lib/rate-limit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface AnalysisRequest {
  contractCode: string;
}

export interface AnalysisResponse {
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
  remainingFreeRequests?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { contractCode, provider = 'openai', apiKey }: { contractCode: string; provider?: string; apiKey?: string } = body;

    console.log('CONTRACT CODE LENGTH:', contractCode?.length);

    if (!contractCode || contractCode.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contract code is required' },
        { status: 400 }
      );
    }

    // ---------------------------
    // Rate limiting: free path is 10 requests per 24h for no apiKey
    // ---------------------------
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const authToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userId = authToken?.id as string | undefined;

    let remainingFreeRequests: number | undefined = undefined;

    if (!apiKey) {
      const limitResult = await freeContractRateLimit.limit(
        `verify-contract-free:${userId ?? ip}`
      );
      if (!limitResult.success) {
        return new NextResponse(JSON.stringify({ error: 'Free plan limit reached. Add your API key for unlimited use.' }), {
          status: 429,
          headers: {
            'Retry-After': '86400',
            'Content-Type': 'application/json',
          },
        });
      }
      remainingFreeRequests = limitResult.remaining;
    } else {
      // user provided own API key -> higher request capacity
      const limitResult = await mediumRatelimit.limit(`verify-contract-key:${userId ?? ip}`);
      if (!limitResult.success) {
        return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
          status: 429,
          headers: {
            'Retry-After': '60',
            'Content-Type': 'application/json',
          },
        });
      }
    }

    // Run complexity + gas fetch in parallel
    const [complexity, chainGasData] = await Promise.all([
      Promise.resolve(estimateComplexity(contractCode)),
      fetchChainGasData().catch((err) => {
        console.warn('⚠️ Gas data unavailable, skipping:', err);
        return [];
      }),
    ]);

    const userPrompt = contractCode;
    const systemPrompt = `You are an expert smart contract auditor and gas optimization specialist.\n\nIMPORTANT: If the input is not valid Solidity code (e.g. random text, gibberish, plain English, or empty content), do NOT attempt to analyze it. Instead, respond ONLY with this exact message and nothing else:\n\n\" No valid Solidity contract detected. Here's a simple example to get you started:\n\n\`\`\`solidity\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract Example {\n    uint256 public value;\n\n    function setValue(uint256 _value) external {\n        value = _value;\n    }\n}\n\`\`\`\n\nPaste a real contract above to get gas estimates and optimization suggestions.\"\n\nIf the input IS valid Solidity,\n\n${chainGasData.map((g) => `- ${g.chainName}: ${g.gasPrice} gwei`).join('\n')}\n\nUsing the gas prices above, estimate the real cost of deploying and interacting with this contract on each chain.\n\nNow analyze this smart contract:\n\n\`\`\`solidity\n${contractCode}\n\`\`\`\n\nFor each chain above:\n- Estimate the gas units this contract would consume for deployment\n- Multiply by the gwei price above to get the total gas cost in gwei\n- Flag which chain is cheapest to deploy on\n provide:\n1. An estimate of the contract's gas costs based on the chain data given\n2. Specific optimization recommendations to reduce gas costs\n3. Security considerations\n4. An overall complexity assessment (Low, Medium, High) based on the code structure.\nKeep your response concise but detailed, focusing on actionable improvements.\n\nFocus on:\n- Gas optimization opportunities\n- Storage patterns that could be more efficient\n- Function call patterns that consume unnecessary gas\n- Loop optimizations\n- State variable packing opportunities`;

    let optimizationSuggestions = 'Unable to generate suggestions';

    try {
      if (provider === 'openai') {
        const keyToUse = apiKey || process.env.OPENAI_API_KEY;
        if (!keyToUse) {
          return NextResponse.json({ success: false, error: 'OpenAI API key not configured' }, { status: 500 });
        }

        const oai = await callOpenAI(
          [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          keyToUse
        );

        optimizationSuggestions = oai || 'Unable to generate suggestions';
      } else if (provider === 'gemini') {
        const keyToUse = apiKey || process.env.GEMINI_API_KEY;
        if (!keyToUse) {
          return NextResponse.json({ success: false, error: 'Gemini API key not configured' }, { status: 500 });
        }

        const gemini = await callGemini(
          [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          keyToUse
        );

        optimizationSuggestions = gemini || 'Unable to generate suggestions';
      } else { // groq fallback
        if (!process.env.GROQ_API_KEY) {
          return NextResponse.json({ success: false, error: 'Groq API key not configured' }, { status: 500 });
        }

        const groqResult = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        });

        optimizationSuggestions = groqResult.choices?.[0]?.message?.content || 'Unable to generate suggestions';
      }
    } catch (err) {
      console.warn('Provider call failed; falling back to groq if available', err);
      if (process.env.GROQ_API_KEY) {
        const groqResult = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        });

        optimizationSuggestions = groqResult.choices?.[0]?.message?.content || 'Unable to generate suggestions';
      } else {
        return NextResponse.json({ success: false, error: 'All providers failed and no fallback keys configured' }, { status: 500 });
      }
    }

    if (optimizationSuggestions.includes('No valid Solidity contract detected')) {
      return NextResponse.json({
        success: true,
        contractCode: '',
        gasEstimates: [],
        optimizationSuggestions,
        complexity: '',
      } as AnalysisResponse);
    }

    return NextResponse.json({
      success: true,
      contractCode: contractCode.substring(0, 100) + '...',
      gasEstimates: chainGasData,
      optimizationSuggestions,
      complexity,
      remainingFreeRequests,
    } as AnalysisResponse);
  } catch (error) {
    console.error('❌ Error analyzing contract:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: `Failed to analyze contract: ${errorMessage}` },
      { status: 500 }
    );
  }
}