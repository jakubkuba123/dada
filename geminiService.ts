
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getChickenTips(): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Provide 3 short, practical tips for a hobby chicken farmer in Czech language. Focus on winter care, egg quality, and flock health. Return them as a simple list.",
      config: {
        systemInstruction: "You are an expert veterinarian specializing in poultry and a veteran organic chicken farmer. Your tips are concise, accurate, and written in friendly Czech.",
      },
    });

    const text = response.text || "";
    return text.split('\n').filter(line => line.trim().length > 5).slice(0, 3);
  } catch (error) {
    console.error("Error fetching chicken tips:", error);
    return [
      "Zajistěte, aby voda v napáječkách v zimě nezamrzala.",
      "Čerstvé bylinky v podestýlce pomáhají odpuzovat parazity.",
      "Vápenný grit je klíčový pro pevnou skořápku vajíček."
    ];
  }
}
