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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar evento' })
  create(@Body() dto: CreateEventDto, @Req() req: Request) {
    return this.eventsService.create(dto, (req.user as any).id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar eventos' })
  @ApiQuery({ name: 'project_id', required: false })
  @ApiQuery({ name: 'start', required: false, description: 'Data de início (ISO 8601)' })
  @ApiQuery({ name: 'end', required: false, description: 'Data de fim (ISO 8601)' })
  findAll(
    @Query('project_id') project_id?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Req() req?: Request,
  ) {
    return this.eventsService.findAll(
      { project_id, start, end },
      (req?.user as any)?.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar evento por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.eventsService.findOne(id, (req.user as any).id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar evento' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: Request,
  ) {
    return this.eventsService.update(id, dto, (req.user as any).id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir evento' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.eventsService.remove(id, (req.user as any).id);
  }
}
