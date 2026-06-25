import {
  Controller,
  Get,
  Post,
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
import { ExpensesService } from './expenses.service';
import { CreateProjectExpenseDto } from './dto/create-project-expense.dto';
import { CreateTaskExpenseDto } from './dto/create-task-expense.dto';

@ApiTags('project-expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('project-expenses')
export class ProjectExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar custo do projeto' })
  create(@Body() dto: CreateProjectExpenseDto, @Req() req: Request) {
    return this.expensesService.createProjectExpense(dto, (req.user as any).id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar custos de projetos' })
  @ApiQuery({ name: 'project_id', required: false })
  findAll(@Query('project_id') project_id: string | undefined, @Req() req: Request) {
    return this.expensesService.findProjectExpenses(project_id, (req.user as any).id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir custo do projeto' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.expensesService.removeProjectExpense(id, (req.user as any).id);
  }
}

@ApiTags('task-expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('task-expenses')
export class TaskExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar custo da tarefa' })
  create(@Body() dto: CreateTaskExpenseDto, @Req() req: Request) {
    return this.expensesService.createTaskExpense(dto, (req.user as any).id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar custos de tarefas' })
  @ApiQuery({ name: 'task_id', required: false })
  findAll(@Query('task_id') task_id: string | undefined, @Req() req: Request) {
    return this.expensesService.findTaskExpenses(task_id, (req.user as any).id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir custo da tarefa' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.expensesService.removeTaskExpense(id, (req.user as any).id);
  }
}
