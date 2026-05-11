/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  getDailyQuote: async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Berikan satu kutipan motivasi singkat dalam Bahasa Indonesia untuk meningkatkan produktivitas belajar atau bekerja. Hanya berikan kutipan dan penulisnya saja.",
      });
      return response.text?.trim() || "Fokuslah pada kemajuan, bukan kesempurnaan.";
    } catch (error) {
      console.error("AI Error:", error);
      return "Fokuslah pada kemajuan, bukan kesempurnaan.";
    }
  },

  parseVoiceTask: async (voiceText: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Ekstrak informasi tugas dari teks berikut: "${voiceText}". Berikan output dalam format JSON dengan field: title, description, category (salah satu dari: school, personal, org, work, project, exam), priority (low, medium, high), deadline (format YYYY-MM-DD). Gunakan intuisi jika data tidak lengkap.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              priority: { type: Type.STRING },
              deadline: { type: Type.STRING },
            },
            required: ["title"],
          },
        },
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("AI Parsing Error:", error);
      return { title: voiceText };
    }
  }
};
