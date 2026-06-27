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
  ) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat com a IA para criar projeto' })
  async chat(@Body() body: { messages: any[], model?: string }, @Req() req: Request) {
    const userId = (req.user as any).id;
    // Buscar clientes do usuário para dar contexto
    const clientsResult = await this.clientsService.findAll({ limit: 100 }, userId);
    const contextClients = clientsResult.data.map(c => ({ id: c.id, name: c.name }));

    return this.aiService.chatWithAI(body.messages, contextClients, body.model || 'gemini-2.5-flash');
  }
}
