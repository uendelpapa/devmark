import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { AiService } from './ai.service';
import { ClientsService } from '../clients/clients.service';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly clientsService: ClientsService
  ) { }

  @Post('chat')
  @ApiOperation({ summary: 'Chat com a IA para criar projeto' })
  async chat(@Body() body: { messages: any[], model?: string, currentDate?: string }, @Req() req: Request) {
    const userId = (req as any).user.id;
    // Buscar clientes do usuário para dar contexto
    const clientsResult = await this.clientsService.findAll({ limit: 100 }, userId);
    const contextClients = clientsResult.data.map(c => ({ id: c.id, name: c.name }));

    const model = body.model || 'gemini-2.5-flash';
    
    // Modelos do OpenRouter sempre tem '/' no nome (ex: nvidia/nemotron...)
    if (model.includes('/')) {
      return this.aiService.chatWithOpenRouter(body.messages, contextClients, model, body.currentDate);
    } else {
      // Modelos nativos do Gemini
      return this.aiService.chatWithAI(body.messages, contextClients, model, body.currentDate);
    }
  }
}
