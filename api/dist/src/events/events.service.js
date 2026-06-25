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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        if (dto.project_id) {
            const project = await this.prisma.project.findFirst({
                where: { id: dto.project_id, user_id: userId },
            });
            if (!project)
                throw new common_1.NotFoundException('Projeto não encontrado');
        }
        const startDate = new Date(dto.start_date);
        const endDate = new Date(dto.end_date);
        if (endDate < startDate) {
            throw new common_1.BadRequestException('A data de fim deve ser posterior à data de início');
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
    async findAll(params, userId) {
        const { project_id, start, end } = params;
        const where = { user_id: userId };
        if (project_id)
            where.project_id = project_id;
        if (start)
            where.start_date = { gte: new Date(start) };
        if (end)
            where.end_date = { lte: new Date(end) };
        return this.prisma.event.findMany({
            where,
            orderBy: { start_date: 'asc' },
            include: {
                project: { select: { id: true, name: true } },
            },
        });
    }
    async findOne(id, userId) {
        const event = await this.prisma.event.findFirst({
            where: { id, user_id: userId },
            include: {
                project: { select: { id: true, name: true } },
            },
        });
        if (!event)
            throw new common_1.NotFoundException('Evento não encontrado');
        return event;
    }
    async update(id, dto, userId) {
        const event = await this.prisma.event.findFirst({ where: { id, user_id: userId } });
        if (!event)
            throw new common_1.NotFoundException('Evento não encontrado');
        const updateData = { ...dto };
        const currentStartDate = dto.start_date ? new Date(dto.start_date) : event.start_date;
        const currentEndDate = dto.end_date ? new Date(dto.end_date) : event.end_date;
        if (currentEndDate < currentStartDate) {
            throw new common_1.BadRequestException('A data de fim deve ser posterior à data de início');
        }
        if (dto.start_date)
            updateData.start_date = new Date(dto.start_date);
        if (dto.end_date)
            updateData.end_date = new Date(dto.end_date);
        return this.prisma.event.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.event.delete({ where: { id } });
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map