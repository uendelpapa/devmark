import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssetDto, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: dto.project_id, user_id: userId },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');

    if (dto.task_id) {
      const task = await this.prisma.task.findFirst({
        where: { id: dto.task_id, user_id: userId },
      });
      if (!task) throw new NotFoundException('Tarefa não encontrada');
    }

    return this.prisma.asset.create({ data: dto });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    project_id?: string;
    task_id?: string;
  }, userId: string) {
    const { page = 1, limit = 20, project_id, task_id } = params;
    const skip = (page - 1) * limit;

    const where: any = { project: { user_id: userId } };
    if (project_id) where.project_id = project_id;
    if (task_id) where.task_id = task_id;

    const [assets, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.asset.count({ where }),
    ]);

    return {
      data: assets,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async remove(id: string, userId: string) {
    const asset = await this.prisma.asset.findFirst({ where: { id, project: { user_id: userId } } });
    if (!asset) throw new NotFoundException('Arquivo não encontrado');
    return this.prisma.asset.delete({ where: { id } });
  }
}
