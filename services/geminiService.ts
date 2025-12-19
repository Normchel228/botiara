import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiBanResponse } from "../types";

// Safely retrieve API key or default to empty string to prevent "process is not defined" crash in browser
// Note: In a production build, your bundler (Vite/Webpack) will replace process.env.
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
  } catch (e) {
    // Ignore reference errors
  }
  return '';
};

const API_KEY = getApiKey();
const ai = new GoogleGenAI({ apiKey: API_KEY });

const banSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    reason: {
      type: Type.STRING,
      description: "A bureaucratic, absurd, and funny reason for banning the target in Russian.",
    },
    article: {
      type: Type.STRING,
      description: "A fake law article number (e.g., 'Art. 404-FZ', 'GoST-1337').",
    },
  },
  required: ["reason", "article"],
};

export const generateBanReason = async (targetName: string): Promise<GeminiBanResponse> => {
  try {
    if (!API_KEY) {
      console.warn("API Key is missing. Returning mock response.");
      return {
        reason: "Система временно недоступна (отсутствует API ключ). Но мы все равно запрещаем это профилактически.",
        article: "Ст. 404 (Not Found)",
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a strict, bureaucratic, but satirical automated system for the Roskomnadzor (Russian internet censor). 
      
      Generate a funny, absurd, and overly bureaucratic reason to BAN the following target: "${targetName}".
      
      The reason should sound official but rely on ridiculous logic (e.g., harmful to productivity, confusing for grandmothers, promoting laziness, looks suspicious).
      
      Output JSON only. Language: Russian.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: banSchema,
        temperature: 1.2, // High creativity for humor
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeminiBanResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      reason: "Объект вызывает подозрения своей непредсказуемостью. Требуется дополнительная экспертиза.",
      article: "Ст. 42.0",
    };
  }
};