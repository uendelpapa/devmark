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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const client = await this.prisma.client.findFirst({
            where: { id: dto.client_id, user_id: userId },
        });
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado');
        }
        const projectValue = dto.project_value || 0;
        const amountReceived = dto.amount_received || 0;
        const amountPending = projectValue - amountReceived;
        return this.prisma.project.create({
            data: {
                ...dto,
                user_id: userId,
                start_date: dto.start_date ? new Date(dto.start_date) : undefined,
                expected_delivery_date: dto.expected_delivery_date
                    ? new Date(dto.expected_delivery_date)
                    : undefined,
                amount_pending: amountPending,
            },
        });
    }
    async findAll(params, userId) {
        const { page = 1, limit = 20, status, priority, area, client_id } = params;
        const skip = (page - 1) * limit;
        const where = { user_id: userId };
        if (status)
            where.status = status;
        if (priority)
            where.priority = priority;
        if (area)
            where.area = area;
        if (client_id)
            where.client_id = client_id;
        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    client: { select: { id: true, name: true, email: true } },
                },
            }),
            this.prisma.project.count({ where }),
        ]);
        return {
            data: projects,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId) {
        const project = await this.prisma.project.findFirst({
            where: { id, user_id: userId },
            include: {
                client: { select: { id: true, name: true, email: true } },
                tasks: true,
                payments: true,
                project_expenses: true,
                project_tags: true,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Projeto não encontrado');
        }
        return project;
    }
    async update(id, dto, userId) {
        const existing = await this.prisma.project.findFirst({ where: { id, user_id: userId } });
        if (!existing) {
            throw new common_1.NotFoundException('Projeto não encontrado');
        }
        if (existing.status === 'CANCELED' && dto.status && dto.status !== 'CANCELED') {
            throw new common_1.BadRequestException('Um projeto cancelado não pode ter seu status alterado');
        }
        const updateData = { ...dto };
        if (dto.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
            updateData.delivery_date = new Date();
        }
        if (dto.start_date) {
            updateData.start_date = new Date(dto.start_date);
        }
        if (dto.expected_delivery_date) {
            updateData.expected_delivery_date = new Date(dto.expected_delivery_date);
        }
        const projectValue = dto.project_value !== undefined
            ? dto.project_value
            : Number(existing.project_value);
        const amountReceived = dto.amount_received !== undefined
            ? dto.amount_received
            : Number(existing.amount_received);
        updateData.amount_pending = projectValue - amountReceived;
        return this.prisma.project.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.project.delete({ where: { id } });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map