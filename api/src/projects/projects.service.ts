import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectDto, userId: string) {
    // RN-05: Validar se o cliente existe e pertence ao usuário
    const client = await this.prisma.client.findFirst({
      where: { id: dto.client_id, user_id: userId },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // RN-06: Calcular amount_pending
    const projectValue = dto.project_value || 0;
    const amountReceived = dto.amount_received || 0;
    const amountPending = projectValue - amountReceived;

    return this.prisma.project.create({
      data: {
        ...dto,
        user_id: userId,
        start_date: dto.start_date ? new Date(dto.start_date) : undefined,
        expected_delivery_date: dto.expected_delivery_date
          ? new Date(dto.expected_delivery_date)
          : undefined,
        amount_pending: amountPending,
      },
    });
  }

  async createWithTasks(dto: CreateProjectDto, tasks: any[], userId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: dto.client_id, user_id: userId },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const projectValue = dto.project_value || 0;
    const amountReceived = dto.amount_received || 0;
    const amountPending = projectValue - amountReceived;

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          ...dto,
          user_id: userId,
          start_date: dto.start_date ? new Date(dto.start_date) : undefined,
          expected_delivery_date: dto.expected_delivery_date
            ? new Date(dto.expected_delivery_date)
            : undefined,
          amount_pending: amountPending,
        },
      });

      if (tasks && tasks.length > 0) {
        await tx.task.createMany({
          data: tasks.map(t => ({
            project_id: project.id,
            user_id: userId,
            title: t.title,
            description: t.description,
            estimated_hours: t.estimated_hours,
            status: 'PENDING',
            priority: 'MEDIUM',
          })),
        });
      }

      return project;
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    area?: string;
    client_id?: string;
  }, userId: string) {
    const { page = 1, limit = 20, status, priority, area, client_id } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = { user_id: userId };
    if (status) where.status = status as any;
    if (priority) where.priority = priority as any;
    if (area) where.area = area as any;
    if (client_id) where.client_id = client_id;

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          client: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, user_id: userId },
      include: {
        client: { select: { id: true, name: true, email: true } },
        tasks: true,
        payments: true,
        project_expenses: true,
        project_tags: true,
      },
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, userId: string) {
    const existing = await this.prisma.project.findFirst({ where: { id, user_id: userId } });
    if (!existing) {
      throw new NotFoundException('Projeto não encontrado');
    }

    // RN-08: Projeto cancelado não pode mudar de status
    if (existing.status === 'CANCELED' && dto.status && dto.status !== 'CANCELED') {
      throw new BadRequestException(
        'Um projeto cancelado não pode ter seu status alterado',
      );
    }

    // RN-07: Ao completar, preencher delivery_date
    const updateData: any = { ...dto };
    if (dto.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      updateData.delivery_date = new Date();
    }

    if (dto.start_date) {
      updateData.start_date = new Date(dto.start_date);
    }
    if (dto.expected_delivery_date) {
      updateData.expected_delivery_date = new Date(dto.expected_delivery_date);
    }

    // RN-06: Recalcular amount_pending
    const projectValue =
      dto.project_value !== undefined
        ? dto.project_value
        : Number(existing.project_value);
    const amountReceived =
      dto.amount_received !== undefined
        ? dto.amount_received
        : Number(existing.amount_received);
    updateData.amount_pending = projectValue - amountReceived;

    return this.prisma.project.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.project.delete({ where: { id } });
  }
}
