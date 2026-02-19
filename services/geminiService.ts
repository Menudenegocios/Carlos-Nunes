
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o 'Menu Flow', o assistente virtual oficial da plataforma MENU DE NEGÓCIOS.
Sua missão é ajudar empreendedores locais, freelancers e profissionais a entenderem como usar a plataforma para crescer.

REGRAS DE OURO:
1. Seja sempre amigável, motivador e use emojis estrategicamente.
2. A MENU DE NEGÓCIOS NÃO cobra comissões sobre vendas. O lucro é 100% do usuário.
3. PLANOS: 
   - Profissionais: Grátis (Bio Digital, IA para bio).
   - Freelancers: R$ 29,90/mês (Anúncios no feed, Catálogo & Lojas).
   - Negócios Locais: R$ 59,90/mês (Catálogo completo, Pagamentos Pix/Cartão, Destaque Regional).
4. FUNCIONALIDADES: Bio Digital (link no Instagram), Menu Pages (Catálogo WhatsApp), Menu CRM (Gestão de Leads), Academy (Treinamentos), Menu Club (Pontos por engajamento).
5. Se o usuário perguntar sobre suporte humano, direcione-o para a página de "Suporte" ou WhatsApp oficial.
6. Mantenha as respostas concisas e formatadas com tópicos quando necessário.
`;

export const getAIAssistantResponse = async (
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    // Sempre criar uma nova instância antes da chamada conforme as regras
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Filtramos o histórico para garantir que ele comece com uma mensagem de 'user'
    // A API do Gemini prefere que a conversa comece com o usuário.
    let cleanHistory = [...history];
    while (cleanHistory.length > 0 && cleanHistory[0].role !== 'user') {
      cleanHistory.shift();
    }

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: cleanHistory,
    });

    const response = await chat.sendMessage({ message });
    return response.text || "Desculpe, tive um problema ao processar sua resposta. Pode repetir?";
  } catch (error: any) {
    console.error("Error in AI Assistant:", error);
    
    // Tratamento específico para o erro de sinal abortado ou erro de entidade não encontrada (chave inválida/expirada)
    if (error.message?.includes("Requested entity was not found")) {
      return "Sua sessão de IA expirou ou a chave de acesso é inválida. Por favor, recarregue a página.";
    }
    
    return "Estou com dificuldade de conexão no momento. Por favor, tente novamente em alguns segundos.";
  }
};

export const generateMarketingCopy = async (
  businessType: string,
  description: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Atue como um especialista em marketing digital e copywriter.
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

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

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
    
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Formato de imagem inválido.");
    }
    const mimeType = matches[1];
    const data = matches[2];

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
