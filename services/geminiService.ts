import { GoogleGenAI } from "@google/genai";
import { COLLECTIONS } from "../constants";

// Helper to get simple answer
export const askPhyloGuide = async (
  question: string,
  collectionId: string,
  userMatrixState: any
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Clé API manquante. Veuillez configurer l'application correctement.";
  }

  const collection = COLLECTIONS.find(c => c.id === collectionId);
  const context = `
    Tu es un assistant pédagogique pour une application de biologie type "Phylogène".
    Le sujet est : ${collection?.name}.
    Les espèces sont : ${collection?.species.map(s => s.name).join(', ')}.
    Les caractères sont : ${collection?.characters.map(c => c.name).join(', ')}.
    L'élève est en train de remplir une matrice de caractères ou de construire un arbre.
    Il demande : "${question}".
    Réponds de manière pédagogique, courte (max 3 phrases), encourageante, sans donner la réponse directement si possible, mais en guidant l'observation.
    Par exemple, si on demande "Est-ce que le pigeon a des dents ?", dis "Regarde bien l'image du crâne du pigeon. Vois-tu des dents comme chez le crocodile ou un bec ?"
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: [{
        role: 'user',
        parts: [{ text: context }]
      }],
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for chat help
      }
    });
    return response.text || "Je n'ai pas pu trouver de réponse.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, je ne peux pas répondre pour le moment.";
  }
};
