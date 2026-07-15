import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto, userId: string) {
    // RN-01: Email único (por usuário ou global? No momento o email é @unique no banco)
    // Se o email for único na tabela toda, podemos só buscar por email. Mas o certo seria email por tenant.
    // Como o schema tem @unique puro, é global.
    const existing = await this.prisma.client.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Um cliente com este e-mail já existe');
    }

    // RN-02: Document único (quando informado)
    if (dto.document) {
      const existingDoc = await this.prisma.client.findFirst({
        where: { document: dto.document, user_id: userId },
      });
      if (existingDoc) {
        throw new ConflictException('Um cliente com este documento já existe');
      }
    }

    return this.prisma.client.create({ data: { ...dto, user_id: userId } });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    hasPendingPayment?: string;
  }, userId: string) {
    const { page = 1, limit = 20, status, hasPendingPayment } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = { user_id: userId };

    if (status) {
      where.status = status as any;
    }

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          projects: {
            select: {
              id: true,
              payments: {
                where: { status: { in: ['PENDING', 'OVERDUE'] } },
                select: { id: true },
              },
            },
          },
          services: {
            where: {
              OR: [
                { status: { in: ['PENDING', 'IN_PROGRESS', 'REVIEW'] } },
                { amount_pending: { gt: 0 } },
              ],
            },
            select: { id: true },
          },
        },
      }),
      this.prisma.client.count({ where }),
    ]);

    // RF-05: Calcular dinamicamente se tem pagamentos pendentes
    let result = clients.map((client) => {
      const hasPending =
        client.projects.some((p) => p.payments.length > 0) ||
        client.services.length > 0;
      const { projects, services, ...clientData } = client;
      return { ...clientData, hasPendingPayment: hasPending };
    });

    // Filtrar por pagamento pendente se solicitado
    if (hasPendingPayment === 'true') {
      result = result.filter((c) => c.hasPendingPayment);
    } else if (hasPendingPayment === 'false') {
      result = result.filter((c) => !c.hasPendingPayment);
    }

    return {
      data: result,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, user_id: userId },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            project_value: true,
            amount_received: true,
          },
        },
        services: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            value: true,
            amount_received: true,
            amount_pending: true,
            due_date: true,
            finished_at: true,
            created_at: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return client;
  }

  async update(id: string, dto: UpdateClientDto, userId: string) {
    await this.findOne(id, userId);

    // RN-01: Verificar email único ao atualizar
    if (dto.email) {
      const existing = await this.prisma.client.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('Um cliente com este e-mail já existe');
      }
    }

    // RN-02: Verificar document único ao atualizar
    if (dto.document) {
      const existingDoc = await this.prisma.client.findFirst({
        where: { document: dto.document, user_id: userId, NOT: { id } },
      });
      if (existingDoc) {
        throw new ConflictException('Um cliente com este documento já existe');
      }
    }

    return this.prisma.client.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const client = await this.findOne(id, userId);

    // RN-03: Não pode excluir cliente com projetos ou serviços ativos
    const activeStatuses = ['IN_PROGRESS', 'PLANNING', 'WAITING_CLIENT', 'REVIEW'];
    const hasActiveProjects = (client as any).projects?.some(
      (p: any) => activeStatuses.includes(p.status),
    );
    const hasActiveServices = (client as any).services?.some(
      (s: any) => activeStatuses.includes(s.status),
    );

    if (hasActiveProjects || hasActiveServices) {
      throw new BadRequestException(
        'Não é possível excluir um cliente com projetos ou serviços ativos',
      );
    }

    return this.prisma.client.delete({ where: { id } });
  }
}
