"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeEntriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TimeEntriesService = class TimeEntriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const task = await this.prisma.task.findFirst({
            where: { id: dto.task_id, project: { user_id: userId } },
            include: { project: true },
        });
        if (!task)
            throw new common_1.NotFoundException('Tarefa não encontrada');
        if (task.project_id !== dto.project_id) {
            throw new common_1.BadRequestException('Tarefa não pertence ao projeto informado');
        }
        return this.prisma.timeEntry.create({
            data: {
                ...dto,
                start_time: new Date(dto.start_time),
            },
        });
    }
    async findAll(params, userId) {
        const { project_id, task_id } = params;
        const where = { project: { user_id: userId } };
        if (project_id)
            where.project_id = project_id;
        if (task_id)
            where.task_id = task_id;
        return this.prisma.timeEntry.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                task: { select: { id: true, title: true } },
            },
        });
    }
    async stopTimer(id, dto, userId) {
        const entry = await this.prisma.timeEntry.findFirst({ where: { id, project: { user_id: userId } } });
        if (!entry)
            throw new common_1.NotFoundException('Entrada de tempo não encontrada');
        if (entry.end_time)
            throw new common_1.BadRequestException('Timer já foi finalizado');
        const endTime = new Date(dto.end_time);
        if (endTime < entry.start_time) {
            throw new common_1.BadRequestException('A data/hora de fim não pode ser anterior à data/hora de início');
        }
        const diffMs = endTime.getTime() - entry.start_time.getTime();
        const durationMinutes = Math.floor(diffMs / (1000 * 60));
        const updated = await this.prisma.timeEntry.update({
            where: { id },
            data: {
                end_time: endTime,
                duration: durationMinutes,
                description: dto.description || entry.description,
            },
        });
        const hoursToAdd = Math.ceil(durationMinutes / 60);
        if (hoursToAdd > 0) {
            const task = await this.prisma.task.findUnique({ where: { id: entry.task_id } });
            await this.prisma.task.update({
                where: { id: entry.task_id },
                data: { worked_hours: (task?.worked_hours || 0) + hoursToAdd },
            });
            const project = await this.prisma.project.findUnique({ where: { id: entry.project_id } });
            await this.prisma.project.update({
                where: { id: entry.project_id },
                data: { worked_hours: (project?.worked_hours || 0) + hoursToAdd },
            });
        }
        return updated;
    }
    async remove(id, userId) {
        const entry = await this.prisma.timeEntry.findFirst({ where: { id, project: { user_id: userId } } });
        if (!entry)
            throw new common_1.NotFoundException('Entrada de tempo não encontrada');
        return this.prisma.timeEntry.delete({ where: { id } });
    }
};
exports.TimeEntriesService = TimeEntriesService;
exports.TimeEntriesService = TimeEntriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TimeEntriesService);
//# sourceMappingURL=time-entries.service.js.map