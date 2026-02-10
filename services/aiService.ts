import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface IdentificationResult {
  id?: number; // Pour compatibilité avec la DB existante
  nom: string;
  scientifique: string;
  description: string;
  rarete: string;
  type: 'flore' | 'faune' | 'autre';
  xp: number;
  habitat: string;
  image: string; // Emoji
}

export const identifySpeciesFromImage = async (base64Image: string): Promise<IdentificationResult | null> => {
  try {
    const cleanBase64 = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          {
            text: `Identifie l'animal, la plante ou le sommet présent. Agis comme un guide expert des Pyrénées.
            Retourne un JSON valide. Si incertain ou pas de nature, mets type="autre".`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nom: { type: Type.STRING },
            scientifique: { type: Type.STRING },
            description: { type: Type.STRING },
            rarete: { type: Type.STRING, enum: ["commun", "rare", "très rare"] },
            type: { type: Type.STRING, enum: ["flore", "faune", "autre"] },
            xp: { type: Type.INTEGER },
            habitat: { type: Type.STRING },
            image: { type: Type.STRING, description: "Un emoji correspondant" }
          },
          required: ["nom", "scientifique", "description", "rarete", "type", "xp", "image"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as IdentificationResult;
    }
    return null;

  } catch (error) {
    console.error("Erreur identification Gemini:", error);
    return null;
  }
};