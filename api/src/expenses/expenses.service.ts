import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectExpenseDto } from './dto/create-project-expense.dto';
import { CreateTaskExpenseDto } from './dto/create-task-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Project Expenses ---

  async createProjectExpense(dto: CreateProjectExpenseDto, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: dto.project_id, user_id: userId },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');

    return this.prisma.projectExpense.create({ data: dto });
  }

  async findProjectExpenses(project_id: string | undefined, userId: string) {
    return this.prisma.projectExpense.findMany({
      where: { project: { user_id: userId }, ...(project_id ? { project_id } : {}) },
      orderBy: { created_at: 'desc' },
      include: {
        project: { select: { id: true, name: true } },
      },
    });
  }

  async removeProjectExpense(id: string, userId: string) {
    const expense = await this.prisma.projectExpense.findFirst({ where: { id, project: { user_id: userId } } });
    if (!expense) throw new NotFoundException('Custo de projeto não encontrado');
    return this.prisma.projectExpense.delete({ where: { id } });
  }

  // --- Task Expenses ---

  async createTaskExpense(dto: CreateTaskExpenseDto, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: dto.task_id, user_id: userId },
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');

    return this.prisma.taskExpense.create({ data: dto });
  }

  async findTaskExpenses(task_id: string | undefined, userId: string) {
    return this.prisma.taskExpense.findMany({
      where: { task: { user_id: userId }, ...(task_id ? { task_id } : {}) },
      orderBy: { created_at: 'desc' },
      include: {
        task: { select: { id: true, title: true, project_id: true } },
      },
    });
  }

  async removeTaskExpense(id: string, userId: string) {
    const expense = await this.prisma.taskExpense.findFirst({ where: { id, task: { user_id: userId } } });
    if (!expense) throw new NotFoundException('Custo de tarefa não encontrado');
    return this.prisma.taskExpense.delete({ where: { id } });
  }
}
