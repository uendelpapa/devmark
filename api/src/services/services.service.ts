import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto, userId: string) {
    // Validar se o cliente existe e pertence ao usuário
    const client = await this.prisma.client.findFirst({
      where: { id: dto.client_id, user_id: userId },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Calcular valores financeiros
    const value = dto.value || 0;
    const amountReceived = dto.amount_received || 0;
    const amountPending = value - amountReceived;

    const finishedAt = dto.status === 'COMPLETED' ? new Date() : undefined;

    return this.prisma.service.create({
      data: {
        ...dto,
        user_id: userId,
        amount_pending: amountPending,
        finished_at: finishedAt,
        due_date: dto.due_date ? new Date(dto.due_date) : undefined,
      },
    });
  }

  async findAll(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      client_id?: string;
    },
    userId: string,
  ) {
    const { page = 1, limit = 20, status, client_id } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ServiceWhereInput = { user_id: userId };
    if (status) where.status = status as any;
    if (client_id) where.client_id = client_id;

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          client: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: services,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, user_id: userId },
      include: {
        client: { select: { id: true, name: true, email: true } },
      },
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto, userId: string) {
    const existing = await this.findOne(id, userId);

    const updateData: any = { ...dto };

    // Ao completar, preencher finished_at se não estava completo antes
    if (dto.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      updateData.finished_at = new Date();
    } else if (dto.status && dto.status !== 'COMPLETED') {
      updateData.finished_at = null;
    }

    if (dto.due_date) {
      updateData.due_date = new Date(dto.due_date);
    }

    // Recalcular amount_pending
    const value = dto.value !== undefined ? dto.value : Number(existing.value);
    const amountReceived =
      dto.amount_received !== undefined
        ? dto.amount_received
        : Number(existing.amount_received);
    updateData.amount_pending = value - amountReceived;

    return this.prisma.service.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.service.delete({ where: { id } });
  }
}
