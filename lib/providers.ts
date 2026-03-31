import OpenAI from "openai";

export async function callOpenAI(messages: any[], apiKey?: string) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OpenAI API key not configured");

  const openai = new OpenAI({ apiKey: key });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.2,
  });

  return response.choices?.[0]?.message?.content;
}

export async function callGemini(messages: any[], apiKey?: string) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini API key not configured");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: messages.map((m) => ({
          role: m.role === "system" ? "user" : m.role,
          parts: [{ text: m.content }],
        })),
      }),
    }
  );

  const data = await res.json();

  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}
