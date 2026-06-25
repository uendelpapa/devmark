import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto, userId: string) {
    if (dto.project_id) {
      const project = await this.prisma.project.findFirst({
        where: { id: dto.project_id, user_id: userId },
      });
      if (!project) throw new NotFoundException('Projeto não encontrado');
    }

    const startDate = new Date(dto.start_date);
    const endDate = new Date(dto.end_date);

    if (endDate < startDate) {
      throw new BadRequestException('A data de fim deve ser posterior à data de início');
    }

    return this.prisma.event.create({
      data: {
        ...dto,
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      },
    });
  }

  async findAll(params: {
    project_id?: string;
    start?: string;
    end?: string;
  }, userId: string) {
    const { project_id, start, end } = params;

    const where: Prisma.EventWhereInput = { user_id: userId };
    if (project_id) where.project_id = project_id;
    if (start) where.start_date = { gte: new Date(start) };
    if (end) where.end_date = { lte: new Date(end) };

    return this.prisma.event.findMany({
      where,
      orderBy: { start_date: 'asc' },
      include: {
        project: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, user_id: userId },
      include: {
        project: { select: { id: true, name: true } },
      },
    });
    if (!event) throw new NotFoundException('Evento não encontrado');
    return event;
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findFirst({ where: { id, user_id: userId } });
    if (!event) throw new NotFoundException('Evento não encontrado');

    const updateData: any = { ...dto };
    const currentStartDate = dto.start_date ? new Date(dto.start_date) : event.start_date;
    const currentEndDate = dto.end_date ? new Date(dto.end_date) : event.end_date;

    if (currentEndDate < currentStartDate) {
      throw new BadRequestException('A data de fim deve ser posterior à data de início');
    }

    if (dto.start_date) updateData.start_date = new Date(dto.start_date);
    if (dto.end_date) updateData.end_date = new Date(dto.end_date);

    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.event.delete({ where: { id } });
  }
}
