import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentDto, userId: string) {
    // Verificar projeto
    const project = await this.prisma.project.findFirst({
      where: { id: dto.project_id, user_id: userId },
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    const data: any = {
      ...dto,
      due_date: new Date(dto.due_date),
      payment_date: dto.payment_date ? new Date(dto.payment_date) : undefined,
    };

    // Se criou direto como PAID, precisa do payment_date e atualizar projeto
    if (dto.status === 'PAID') {
      if (!data.payment_date) data.payment_date = new Date();
      await this.updateProjectReceivedAmount(dto.project_id, dto.amount);
    }

    return this.prisma.payment.create({ data });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    project_id?: string;
    status?: string;
  }, userId: string) {
    const { page = 1, limit = 20, project_id, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {
      project: { user_id: userId }
    };
    if (project_id) where.project_id = project_id;
    if (status) where.status = status as any;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { due_date: 'asc' },
        include: {
          project: { select: { id: true, name: true, client_id: true } },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, project: { user_id: userId } },
      include: {
        project: { select: { id: true, name: true } },
      },
    });
    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }
    return payment;
  }

  async update(id: string, dto: UpdatePaymentDto, userId: string) {
    const existing = await this.prisma.payment.findFirst({ where: { id, project: { user_id: userId } } });
    if (!existing) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    // RN-16: Pagamento cancelado não pode ser pago
    if (existing.status === 'CANCELED' && dto.status === 'PAID') {
      throw new BadRequestException('Um pagamento cancelado não pode ser marcado como pago');
    }

    const updateData: any = { ...dto };
    if (dto.due_date) updateData.due_date = new Date(dto.due_date);
    if (dto.payment_date) updateData.payment_date = new Date(dto.payment_date);

    // RN-14: Ao marcar como PAID
    if (dto.status === 'PAID' && existing.status !== 'PAID') {
      if (!updateData.payment_date) updateData.payment_date = new Date();
      
      const amountToSum = dto.amount !== undefined ? dto.amount : Number(existing.amount);
      await this.updateProjectReceivedAmount(existing.project_id, amountToSum);
    } 
    // Se era PAID e mudou para PENDING/CANCELED (reverter valor)
    else if (existing.status === 'PAID' && dto.status && dto.status !== 'PAID') {
      await this.updateProjectReceivedAmount(existing.project_id, -Number(existing.amount));
      updateData.payment_date = null;
    }

    return this.prisma.payment.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    const payment = await this.findOne(id, userId);
    
    // Se excluir um pagamento que estava pago, reverte do projeto
    if (payment.status === 'PAID') {
      await this.updateProjectReceivedAmount(payment.project_id, -Number(payment.amount));
    }
    
    return this.prisma.payment.delete({ where: { id } });
  }

  private async updateProjectReceivedAmount(projectId: string, amountToAdd: number) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return;

    const newReceived = Number(project.amount_received) + amountToAdd;
    const newPending = Number(project.project_value) - newReceived;

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        amount_received: newReceived,
        amount_pending: newPending,
      },
    });
  }
}
