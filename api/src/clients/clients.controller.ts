import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo cliente' })
  create(@Body() dto: CreateClientDto, @Req() req: Request) {
    return this.clientsService.create(dto, (req as any).user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['LEAD', 'NEGOTIATING', 'ACTIVE', 'INACTIVE', 'LOST'] })
  @ApiQuery({ name: 'hasPendingPayment', required: false, enum: ['true', 'false'] })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('hasPendingPayment') hasPendingPayment?: string,
    @Req() req?: Request,
  ) {
    return this.clientsService.findAll(
      { page, limit, status, hasPendingPayment },
      (req as any)?.user?.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.clientsService.findOne(id, (req as any).user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClientDto,
    @Req() req: Request,
  ) {
    return this.clientsService.update(id, dto, (req as any).user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir cliente' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.clientsService.remove(id, (req as any).user.id);
  }
}
