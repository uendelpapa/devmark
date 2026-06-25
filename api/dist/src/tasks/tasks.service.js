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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = class TasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const project = await this.prisma.project.findFirst({
            where: { id: dto.project_id, user_id: userId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Projeto não encontrado');
        }
        const { subtasks, due_date, tags, ...rest } = dto;
        const data = {
            ...rest,
            user_id: userId,
            tags: tags || [],
        };
        if (due_date) {
            data.due_date = new Date(due_date);
        }
        if (dto.status === 'IN_PROGRESS') {
            data.started_at = new Date();
        }
        else if (dto.status === 'COMPLETED') {
            data.finished_at = new Date();
        }
        if (subtasks && subtasks.length > 0) {
            data.subtasks = {
                create: subtasks.map(s => ({
                    text: s.text,
                    completed: s.completed ?? false,
                })),
            };
        }
        return this.prisma.task.create({
            data,
            include: {
                subtasks: true,
            },
        });
    }
    async findAll(params, userId) {
        const { page = 1, limit = 20, project_id, status } = params;
        const skip = (page - 1) * limit;
        const where = { user_id: userId };
        if (project_id)
            where.project_id = project_id;
        if (status)
            where.status = status;
        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    subtasks: true,
                },
            }),
            this.prisma.task.count({ where }),
        ]);
        return {
            data: tasks,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId) {
        const task = await this.prisma.task.findFirst({
            where: { id, user_id: userId },
            include: {
                project: { select: { id: true, name: true } },
                task_expenses: true,
                time_entries: true,
                subtasks: true,
            },
        });
        if (!task) {
            throw new common_1.NotFoundException('Tarefa não encontrada');
        }
        return task;
    }
    async update(id, dto, userId) {
        const existing = await this.prisma.task.findFirst({ where: { id, user_id: userId } });
        if (!existing) {
            throw new common_1.NotFoundException('Tarefa não encontrada');
        }
        if (existing.status === 'CANCELED' && dto.status && dto.status !== 'CANCELED') {
            throw new common_1.BadRequestException('Uma tarefa cancelada não pode ter seu status alterado');
        }
        const { subtasks, due_date, tags, ...rest } = dto;
        const updateData = {
            ...rest,
        };
        if (tags) {
            updateData.tags = tags;
        }
        if (due_date !== undefined) {
            updateData.due_date = due_date ? new Date(due_date) : null;
        }
        if (dto.status === 'IN_PROGRESS' &&
            existing.status !== 'IN_PROGRESS' &&
            !existing.started_at) {
            updateData.started_at = new Date();
        }
        if (dto.status === 'COMPLETED' &&
            existing.status !== 'COMPLETED' &&
            !existing.finished_at) {
            updateData.finished_at = new Date();
        }
        if (subtasks) {
            return this.prisma.$transaction(async (tx) => {
                await tx.subtask.deleteMany({
                    where: { task_id: id },
                });
                return tx.task.update({
                    where: { id },
                    data: {
                        ...updateData,
                        subtasks: {
                            create: subtasks.map(s => ({
                                text: s.text,
                                completed: s.completed ?? false,
                            })),
                        },
                    },
                    include: {
                        subtasks: true,
                    },
                });
            });
        }
        return this.prisma.task.update({
            where: { id },
            data: updateData,
            include: {
                subtasks: true,
            },
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.task.delete({ where: { id } });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map