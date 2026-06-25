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
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@ApiTags('time-entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('time-entries')
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Post()
  @ApiOperation({ summary: 'Iniciar timer (criar time entry)' })
  create(@Body() dto: CreateTimeEntryDto, @Req() req: Request) {
    return this.timeEntriesService.create(dto, (req.user as any).id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar time entries' })
  @ApiQuery({ name: 'project_id', required: false })
  @ApiQuery({ name: 'task_id', required: false })
  findAll(
    @Query('project_id') project_id?: string,
    @Query('task_id') task_id?: string,
    @Req() req?: Request,
  ) {
    return this.timeEntriesService.findAll(
      { project_id, task_id },
      (req?.user as any)?.id,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Parar timer (preencher end_time)' })
  stopTimer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTimeEntryDto,
    @Req() req: Request,
  ) {
    return this.timeEntriesService.stopTimer(id, dto, (req.user as any).id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir time entry' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.timeEntriesService.remove(id, (req.user as any).id);
  }
}
