
import { GoogleGenAI, Type } from "@google/genai";
import { Suggestion, VibeAnalysis, IcebreakerParams } from "../types";

// Properly initialized GoogleGenAI instance following guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getResponseSuggestions = async (incomingMessage: string, context: string = ""): Promise<Suggestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Incoming message: "${incomingMessage}". Context: "${context}". As a social coach for an introvert, suggest 3 diverse ways to respond in English. Provide output as a JSON array of objects with "vibe" (e.g., Casual, Deep, Witty), "content" (the actual text), and "explanation" (why this works).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            vibe: { type: Type.STRING },
            content: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["vibe", "content", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};

export const analyzeVibe = async (message: string): Promise<VibeAnalysis | null> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the vibe of this message: "${message}". Is it sarcastic? Friendly? Passive-aggressive? Neutral? Provide analysis in English including tone analysis, hidden meaning, suggested action, and intensity (1-10).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tone: { type: Type.STRING },
          hiddenMeaning: { type: Type.STRING },
          suggestedAction: { type: Type.STRING },
          intensity: { type: Type.NUMBER }
        },
        required: ["tone", "hiddenMeaning", "suggestedAction", "intensity"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "null");
  } catch (e) {
    return null;
  }
};

export const generateIcebreakers = async (params: IcebreakerParams): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 ${params.intensity} icebreakers in English for this context: "${params.context}" and relationship: "${params.relationship}". Return as a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};

export const getSandboxFeedback = async (history: {role: string, text: string}[]): Promise<{reply: string, feedback: string}> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a character the user is practicing talking to. History: ${JSON.stringify(history)}. Reply in English naturally. Also, provide "feedback" as a social coach on their communication style in English.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: { type: Type.STRING },
          feedback: { type: Type.STRING }
        },
        required: ["reply", "feedback"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{"reply": "...", "feedback": "..."}');
  } catch (e) {
    return { reply: "I didn't quite catch that.", feedback: "Try to be a bit clearer in your intent." };
  }
};
