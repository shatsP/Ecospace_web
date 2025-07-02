// src/llm/fallbackLLM.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const MODEL = "gemma-3n-e2b-it";

export async function getLLMFallbackResponse(prompt: string): Promise<string | null> {
  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.error("LLM fallback error:", err);
    return null;
  }
}
