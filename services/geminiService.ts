
import { GoogleGenAI } from "@google/genai";

export const generateMarketingCopy = async (
  businessType: string,
  description: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Atue como um especialista em marketing digital e copywriting.
      Crie uma copy persuasiva para um negócio local.
      
      Tipo de negócio: ${businessType}
      Descrição básica: ${description}
      
      A copy deve:
      1. Ter um título chamativo (headline).
      2. Destacar os principais benefícios.
      3. Usar tom amigável e profissional.
      4. Incluir uma chamada para ação (Call to Action) clara no final.
      5. Usar emojis apropriados.
      
      Retorne a resposta formatada.
    `;

    // Always use 'gemini-3-flash-preview' for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Directly access .text property
    return response.text || "Não foi possível gerar a copy no momento.";
  } catch (error) {
    console.error("Error generating copy:", error);
    throw error;
  }
};

export const generateMarketingImage = async (
  prompt: string,
  aspectRatio: string = '1:1'
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Use 'gemini-2.5-flash-image' for general image generation tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any, 
        }
      }
    });

    // Iterate through parts to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Nenhuma imagem gerada.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const editMarketingImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Extract base64 data and mime type
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Formato de imagem inválido.");
    }
    const mimeType = matches[1];
    const data = matches[2];

    // Use 'gemini-2.5-flash-image' for image editing tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Nenhuma imagem gerada.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};
