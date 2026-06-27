import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI, Type, Schema } from '@google/genai';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async chatWithAI(messages: any[], contextClients: any[], model: string = 'gemini-2.5-flash') {
    try {
      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          reply: { 
            type: Type.STRING, 
            description: "Sua resposta conversacional para o usuário, perguntando informações faltantes ou confirmando os dados." 
          },
          extracted_data: {
            type: Type.OBJECT,
            description: "Os dados do projeto extraídos até o momento a partir de toda a conversa.",
            properties: {
              client_id: { type: Type.STRING, description: "ID do cliente. Utilize o contexto de clientes fornecido para mapear o nome digitado para o ID correspondente." },
              name: { type: Type.STRING, description: "Nome do projeto" },
              area: { type: Type.STRING, description: "Obrigatório. Valores: MARKETING ou DEVELOPER" },
              specialty: { type: Type.STRING, description: "Ex: Frontend, Backend, SEO" },
              project_value: { type: Type.NUMBER, description: "Valor total do projeto" },
              start_date: { type: Type.STRING, description: "Data de início em formato YYYY-MM-DD" },
              expected_delivery_date: { type: Type.STRING, description: "Data de entrega em formato YYYY-MM-DD" },
              priority: { type: Type.STRING, description: "Valores: LOW, MEDIUM, HIGH, URGENT" },
              estimated_hours: { type: Type.NUMBER, description: "Estimativa de horas" },
            },
          },
          is_complete: { 
            type: Type.BOOLEAN, 
            description: "True apenas se todos os dados obrigatórios foram fornecidos (client_id, name, area, project_value, start_date, expected_delivery_date)" 
          },
          tasks: {
            type: Type.ARRAY,
            description: "Lista de tarefas sugeridas para o projeto. Gere apenas se is_complete for true.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                estimated_hours: { type: Type.NUMBER },
              }
            }
          }
        }
      };

      const systemInstruction = `
Você é um assistente de IA especialista em gerenciamento de projetos para a plataforma Devmark.
Seu objetivo é ajudar o usuário a criar um novo projeto extraindo os dados necessários de forma conversacional.

Contexto dos clientes do usuário:
${JSON.stringify(contextClients, null, 2)}

Você PRECISA preencher:
- client_id (descubra pelo nome do cliente fornecido pelo usuário e mapêie para o ID do contexto)
- name (nome do projeto)
- area (MARKETING ou DEVELOPER)
- project_value (valor do projeto em números)
- start_date (data de início)
- expected_delivery_date (data de entrega prevista)

Campos opcionais: specialty, priority, estimated_hours.

Instruções da conversa:
1. Se faltar algum campo obrigatório, pergunte de forma natural e amigável na sua 'reply'.
2. Mantenha os dados já extraídos no objeto 'extracted_data' e atualize conforme o usuário fornece mais detalhes.
3. Se o usuário fornecer tudo que é necessário, mude 'is_complete' para true e preencha as 'tasks' com sugestões de tarefas (dividindo o projeto em 3 a 5 tarefas lógicas).
`;

      const response = await this.ai.models.generateContent({
        model: model,
        contents: messages,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.2,
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('Nenhuma resposta retornada pelo modelo.');
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('Erro na chamada da IA:', error);
      throw new InternalServerErrorException('Falha ao processar solicitação de IA');
    }
  }
}
