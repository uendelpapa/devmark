import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TimeEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTimeEntryDto, userId: string) {
    // Verificar se projeto e tarefa existem
    const task = await this.prisma.task.findFirst({
      where: { id: dto.task_id, project: { user_id: userId } },
      include: { project: true },
    });

    if (!task) throw new NotFoundException('Tarefa não encontrada');
    if (task.project_id !== dto.project_id) {
      throw new BadRequestException('Tarefa não pertence ao projeto informado');
    }

    return this.prisma.timeEntry.create({
      data: {
        ...dto,
        start_time: new Date(dto.start_time),
      },
    });
  }

  async findAll(params: { project_id?: string; task_id?: string }, userId: string) {
    const { project_id, task_id } = params;
    
    const where: Prisma.TimeEntryWhereInput = { project: { user_id: userId } };
    if (project_id) where.project_id = project_id;
    if (task_id) where.task_id = task_id;

    return this.prisma.timeEntry.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        task: { select: { id: true, title: true } },
      },
    });
  }

  async stopTimer(id: string, dto: UpdateTimeEntryDto, userId: string) {
    const entry = await this.prisma.timeEntry.findFirst({ where: { id, project: { user_id: userId } } });
    if (!entry) throw new NotFoundException('Entrada de tempo não encontrada');
    if (entry.end_time) throw new BadRequestException('Timer já foi finalizado');

    const endTime = new Date(dto.end_time);
    if (endTime < entry.start_time) {
      throw new BadRequestException('A data/hora de fim não pode ser anterior à data/hora de início');
    }

    // Calcular duração em minutos
    const diffMs = endTime.getTime() - entry.start_time.getTime();
    const durationMinutes = Math.floor(diffMs / (1000 * 60));

    // Atualiza a entry
    const updated = await this.prisma.timeEntry.update({
      where: { id },
      data: {
        end_time: endTime,
        duration: durationMinutes,
        description: dto.description || entry.description,
      },
    });

    // Converter minutos para horas arredondadas para atualizar worked_hours
    const hoursToAdd = Math.ceil(durationMinutes / 60);

    // Atualiza worked_hours da tarefa e do projeto
    if (hoursToAdd > 0) {
      const task = await this.prisma.task.findUnique({ where: { id: entry.task_id }});
      await this.prisma.task.update({
        where: { id: entry.task_id },
        data: { worked_hours: (task?.worked_hours || 0) + hoursToAdd },
      });

      const project = await this.prisma.project.findUnique({ where: { id: entry.project_id }});
      await this.prisma.project.update({
        where: { id: entry.project_id },
        data: { worked_hours: (project?.worked_hours || 0) + hoursToAdd },
      });
    }

    return updated;
  }

  async remove(id: string, userId: string) {
    const entry = await this.prisma.timeEntry.findFirst({ where: { id, project: { user_id: userId } } });
    if (!entry) throw new NotFoundException('Entrada de tempo não encontrada');
    
    // Se a entry foi completada, seria ideal subtrair as worked_hours,
    // mas por simplicidade e integridade apenas removemos o log.
    
    return this.prisma.timeEntry.delete({ where: { id } });
  }
}
