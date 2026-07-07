import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI, Type, Schema } from '@google/genai';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async chatWithAI(messages: any[], contextClients: any[], model: string = 'gemini-2.5-flash', currentDate?: string) {
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

Data de referência (hoje): ${currentDate || new Date().toISOString().split('T')[0]}
Use esta data para calcular datas relativas especificadas pelo usuário (por exemplo, "hoje", "amanhã", "fim de semana", "próximo mês", "daqui a duas semanas", etc.). Por exemplo, se hoje é 2026-07-06, "amanhã" é 2026-07-07 e o "próximo mês" inicia em 2026-08-01.

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

      let response;
      let retries = 3;
      let delay = 2000;

      while (retries > 0) {
        try {
          response = await this.ai.models.generateContent({
            model: model,
            contents: messages,
            config: {
              systemInstruction: systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: responseSchema,
              temperature: 0.2,
            }
          });
          break; // Sucesso, sai do loop
        } catch (err: any) {
          if (err.status === 429 && retries > 1) {
            console.warn(`Erro 429 recebido. Tentando novamente em ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            retries--;
          } else {
            throw err; // Outro erro ou sem mais tentativas
          }
        }
      }

      const text = response?.text;
      if (!text) {
        throw new Error('Nenhuma resposta retornada pelo modelo.');
      }

      return JSON.parse(text);
    } catch (error: any) {
      console.error('Erro na chamada da IA:', error);
      if (error.status === 429) {
        throw new InternalServerErrorException('O limite de requisições da IA foi excedido. Por favor, aguarde um momento e tente novamente.');
      }
      throw new InternalServerErrorException('Falha ao processar solicitação de IA');
    }
  }

  async chatWithOpenRouter(messages: any[], contextClients: any[], model: string = 'openai/gpt-oss-20b:free', currentDate?: string) {
    try {
      const systemInstruction = `
Você é um assistente de IA especialista em gerenciamento de projetos para a plataforma Devmark.
Seu objetivo é ajudar o usuário a criar um novo projeto extraindo os dados necessários de forma conversacional.

Contexto dos clientes do usuário:
${JSON.stringify(contextClients, null, 2)}

Data de referência (hoje): ${currentDate || new Date().toISOString().split('T')[0]}
Use esta data para calcular datas relativas especificadas pelo usuário (por exemplo, "hoje", "amanhã", "fim de semana", "próximo mês", "daqui a duas semanas", etc.). Por exemplo, se hoje é 2026-07-06, "amanhã" é 2026-07-07 e o "próximo mês" inicia em 2026-08-01.

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

RESPONDA EXCLUSIVAMENTE NO SEGUINTE FORMATO JSON, SEM NENHUM TEXTO ADICIONAL (Nem mesmo markdown de bloco de código):
{
  "reply": "string",
  "extracted_data": {
    "client_id": "string",
    "name": "string",
    "area": "string",
    "specialty": "string",
    "project_value": 0,
    "start_date": "YYYY-MM-DD",
    "expected_delivery_date": "YYYY-MM-DD",
    "priority": "string",
    "estimated_hours": 0
  },
  "is_complete": boolean,
  "tasks": [
    { "title": "string", "description": "string", "estimated_hours": 0 }
  ]
}
`;

      const formattedMessages = [
        { role: 'system', content: systemInstruction },
        ...messages.map(m => {
          let content = '';
          if (m.parts && Array.isArray(m.parts)) {
            content = m.parts.map((p: any) => p.text || '').join('\n');
          } else if (m.content) {
            content = m.content;
          }

          return {
            role: m.role === 'model' ? 'assistant' : 'user',
            content: content,
            ...(m.reasoning_details ? { reasoning_details: m.reasoning_details } : {})
          };
        })
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: formattedMessages,
          response_format: { type: "json_object" },
          reasoning: { enabled: true }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const result = await response.json();
      const assistantMessage = result.choices[0].message;
      let text = assistantMessage.content || '';

      // Limpeza de possíveis formatações markdown geradas pelo modelo
      text = text.replace(/^```json\n?/, '').replace(/```$/, '').trim();

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(text);
      } catch (e) {
        // Fallback: tenta extrair apenas o objeto JSON no meio do texto
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          parsedResponse = JSON.parse(match[0]);
        } else {
          throw new Error('A IA não retornou um formato JSON válido.');
        }
      }

      // Caso queira retornar os dados de reasoning para o frontend usar na próxima chamada, 
      // podemos acoplar ao objeto de retorno.
      if (assistantMessage.reasoning_details) {
        parsedResponse._reasoning_details = assistantMessage.reasoning_details;
      }

      return parsedResponse;

    } catch (error: any) {
      console.error('Erro na chamada da OpenRouter:', error);
      throw new InternalServerErrorException('Falha ao processar solicitação de IA via OpenRouter');
    }
  }
}
