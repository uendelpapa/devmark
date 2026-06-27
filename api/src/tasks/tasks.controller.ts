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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova tarefa' })
  create(@Body() dto: CreateTaskDto, @Req() req: Request) {
    return this.tasksService.create(dto, (req as any).user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarefas' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'project_id', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('project_id') project_id?: string,
    @Query('status') status?: string,
    @Req() req?: Request,
  ) {
    return this.tasksService.findAll(
      { page, limit, project_id, status },
      (req as any)?.user?.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.tasksService.findOne(id, (req as any).user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tarefa' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    return this.tasksService.update(id, dto, (req as any).user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tarefa' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.tasksService.remove(id, (req as any).user.id);
  }
}
