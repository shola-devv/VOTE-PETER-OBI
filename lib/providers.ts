import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callOpenAI(messages: any[]) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.2,
  });

  return response.choices?.[0]?.message?.content;
}

export async function callGemini(messages: any[]) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
