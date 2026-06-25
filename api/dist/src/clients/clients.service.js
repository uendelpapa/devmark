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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClientsService = class ClientsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const existing = await this.prisma.client.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Um cliente com este e-mail já existe');
        }
        if (dto.document) {
            const existingDoc = await this.prisma.client.findFirst({
                where: { document: dto.document, user_id: userId },
            });
            if (existingDoc) {
                throw new common_1.ConflictException('Um cliente com este documento já existe');
            }
        }
        return this.prisma.client.create({ data: { ...dto, user_id: userId } });
    }
    async findAll(params, userId) {
        const { page = 1, limit = 20, status, hasPendingPayment } = params;
        const skip = (page - 1) * limit;
        const where = { user_id: userId };
        if (status) {
            where.status = status;
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
                },
            }),
            this.prisma.client.count({ where }),
        ]);
        let result = clients.map((client) => {
            const hasPending = client.projects.some((p) => p.payments.length > 0);
            const { projects, ...clientData } = client;
            return { ...clientData, hasPendingPayment: hasPending };
        });
        if (hasPendingPayment === 'true') {
            result = result.filter((c) => c.hasPendingPayment);
        }
        else if (hasPendingPayment === 'false') {
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
    async findOne(id, userId) {
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
            },
        });
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado');
        }
        return client;
    }
    async update(id, dto, userId) {
        await this.findOne(id, userId);
        if (dto.email) {
            const existing = await this.prisma.client.findFirst({
                where: { email: dto.email, NOT: { id } },
            });
            if (existing) {
                throw new common_1.ConflictException('Um cliente com este e-mail já existe');
            }
        }
        if (dto.document) {
            const existingDoc = await this.prisma.client.findFirst({
                where: { document: dto.document, user_id: userId, NOT: { id } },
            });
            if (existingDoc) {
                throw new common_1.ConflictException('Um cliente com este documento já existe');
            }
        }
        return this.prisma.client.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id, userId) {
        const client = await this.findOne(id, userId);
        const activeStatuses = ['IN_PROGRESS', 'PLANNING', 'WAITING_CLIENT', 'REVIEW'];
        const hasActiveProjects = client.projects?.some((p) => activeStatuses.includes(p.status));
        if (hasActiveProjects) {
            throw new common_1.BadRequestException('Não é possível excluir um cliente com projetos ativos');
        }
        return this.prisma.client.delete({ where: { id } });
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map