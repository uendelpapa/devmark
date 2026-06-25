import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto, userId: string) {
    // RN-10: Validar se o projeto existe e pertence ao usuário
    const project = await this.prisma.project.findFirst({
      where: { id: dto.project_id, user_id: userId },
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    const { subtasks, due_date, tags, ...rest } = dto;

    const data: any = {
      ...rest,
      user_id: userId,
      tags: tags || [],
    };

    if (due_date) {
      data.due_date = new Date(due_date);
    }
    
    // RN-11 e RN-12: Atualizar timestamps se vier com status específico
    if (dto.status === 'IN_PROGRESS') {
      data.started_at = new Date();
    } else if (dto.status === 'COMPLETED') {
      data.finished_at = new Date();
    }

    if (subtasks && subtasks.length > 0) {
      data.subtasks = {
        create: subtasks.map(s => ({
          text: s.text,
          completed: s.completed ?? false,
        })),
      };
    }

    return this.prisma.task.create({
      data,
      include: {
        subtasks: true,
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    project_id?: string;
    status?: string;
  }, userId: string) {
    const { page = 1, limit = 20, project_id, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = { user_id: userId };
    if (project_id) where.project_id = project_id;
    if (status) where.status = status as any;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          subtasks: true,
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, user_id: userId },
      include: {
        project: { select: { id: true, name: true } },
        task_expenses: true,
        time_entries: true,
        subtasks: true,
      },
    });
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const existing = await this.prisma.task.findFirst({ where: { id, user_id: userId } });
    if (!existing) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    // RN-13: Tarefa cancelada não pode ter seu status alterado
    if (existing.status === 'CANCELED' && dto.status && dto.status !== 'CANCELED') {
      throw new BadRequestException(
        'Uma tarefa cancelada não pode ter seu status alterado',
      );
    }

    const { subtasks, due_date, tags, ...rest } = dto;

    const updateData: any = {
      ...rest,
    };

    if (tags) {
      updateData.tags = tags;
    }

    if (due_date !== undefined) {
      updateData.due_date = due_date ? new Date(due_date) : null;
    }

    // RN-11: Preencher started_at ao mover para IN_PROGRESS (se não tiver)
    if (
      dto.status === 'IN_PROGRESS' &&
      existing.status !== 'IN_PROGRESS' &&
      !existing.started_at
    ) {
      updateData.started_at = new Date();
    }

    // RN-12: Preencher finished_at ao mover para COMPLETED (se não tiver)
    if (
      dto.status === 'COMPLETED' &&
      existing.status !== 'COMPLETED' &&
      !existing.finished_at
    ) {
      updateData.finished_at = new Date();
    }

    if (subtasks) {
      return this.prisma.$transaction(async (tx) => {
        // Delete all existing subtasks
        await tx.subtask.deleteMany({
          where: { task_id: id },
        });

        // Update task and create new subtasks
        return tx.task.update({
          where: { id },
          data: {
            ...updateData,
            subtasks: {
              create: subtasks.map(s => ({
                text: s.text,
                completed: s.completed ?? false,
              })),
            },
          },
          include: {
            subtasks: true,
          },
        });
      });
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        subtasks: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.delete({ where: { id } });
  }
}
