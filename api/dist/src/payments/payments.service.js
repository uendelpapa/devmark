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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
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
        const data = {
            ...dto,
            due_date: new Date(dto.due_date),
            payment_date: dto.payment_date ? new Date(dto.payment_date) : undefined,
        };
        if (dto.status === 'PAID') {
            if (!data.payment_date)
                data.payment_date = new Date();
            await this.updateProjectReceivedAmount(dto.project_id, dto.amount);
        }
        return this.prisma.payment.create({ data });
    }
    async findAll(params, userId) {
        const { page = 1, limit = 20, project_id, status } = params;
        const skip = (page - 1) * limit;
        const where = {
            project: { user_id: userId }
        };
        if (project_id)
            where.project_id = project_id;
        if (status)
            where.status = status;
        const [payments, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { due_date: 'asc' },
                include: {
                    project: { select: { id: true, name: true, client_id: true } },
                },
            }),
            this.prisma.payment.count({ where }),
        ]);
        return {
            data: payments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId) {
        const payment = await this.prisma.payment.findFirst({
            where: { id, project: { user_id: userId } },
            include: {
                project: { select: { id: true, name: true } },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Pagamento não encontrado');
        }
        return payment;
    }
    async update(id, dto, userId) {
        const existing = await this.prisma.payment.findFirst({ where: { id, project: { user_id: userId } } });
        if (!existing) {
            throw new common_1.NotFoundException('Pagamento não encontrado');
        }
        if (existing.status === 'CANCELED' && dto.status === 'PAID') {
            throw new common_1.BadRequestException('Um pagamento cancelado não pode ser marcado como pago');
        }
        const updateData = { ...dto };
        if (dto.due_date)
            updateData.due_date = new Date(dto.due_date);
        if (dto.payment_date)
            updateData.payment_date = new Date(dto.payment_date);
        if (dto.status === 'PAID' && existing.status !== 'PAID') {
            if (!updateData.payment_date)
                updateData.payment_date = new Date();
            const amountToSum = dto.amount !== undefined ? dto.amount : Number(existing.amount);
            await this.updateProjectReceivedAmount(existing.project_id, amountToSum);
        }
        else if (existing.status === 'PAID' && dto.status && dto.status !== 'PAID') {
            await this.updateProjectReceivedAmount(existing.project_id, -Number(existing.amount));
            updateData.payment_date = null;
        }
        return this.prisma.payment.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id, userId) {
        const payment = await this.findOne(id, userId);
        if (payment.status === 'PAID') {
            await this.updateProjectReceivedAmount(payment.project_id, -Number(payment.amount));
        }
        return this.prisma.payment.delete({ where: { id } });
    }
    async updateProjectReceivedAmount(projectId, amountToAdd) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project)
            return;
        const newReceived = Number(project.amount_received) + amountToAdd;
        const newPending = Number(project.project_value) - newReceived;
        await this.prisma.project.update({
            where: { id: projectId },
            data: {
                amount_received: newReceived,
                amount_pending: newPending,
            },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map