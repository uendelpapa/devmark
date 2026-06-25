import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.project_id },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');

    const existingTag = await this.prisma.projectTag.findUnique({
      where: {
        project_id_name: {
          project_id: dto.project_id,
          name: dto.name,
        },
      },
    });

    if (existingTag) {
      throw new ConflictException('Tag já existe neste projeto');
    }

    return this.prisma.projectTag.create({ data: dto });
  }

  async findAll(project_id?: string) {
    return this.prisma.projectTag.findMany({
      where: project_id ? { project_id } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async remove(id: string) {
    const tag = await this.prisma.projectTag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('Tag não encontrada');
    return this.prisma.projectTag.delete({ where: { id } });
  }
}
