import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLogDto, userId?: string) {
    return this.prisma.errorLog.create({
      data: {
        message: dto.message,
        stack: dto.stack,
        url: dto.url,
        user_agent: dto.user_agent,
        level: dto.level || 'ERROR',
        metadata: dto.metadata || undefined,
        user_id: userId || null,
      },
    });
  }

  async findAll() {
    return this.prisma.errorLog.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}
