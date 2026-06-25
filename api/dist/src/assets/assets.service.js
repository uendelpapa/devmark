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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssetsService = class AssetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const project = await this.prisma.project.findFirst({
            where: { id: dto.project_id, user_id: userId },
        });
        if (!project)
            throw new common_1.NotFoundException('Projeto não encontrado');
        if (dto.task_id) {
            const task = await this.prisma.task.findFirst({
                where: { id: dto.task_id, user_id: userId },
            });
            if (!task)
                throw new common_1.NotFoundException('Tarefa não encontrada');
        }
        return this.prisma.asset.create({ data: dto });
    }
    async findAll(params, userId) {
        const { page = 1, limit = 20, project_id, task_id } = params;
        const skip = (page - 1) * limit;
        const where = { project: { user_id: userId } };
        if (project_id)
            where.project_id = project_id;
        if (task_id)
            where.task_id = task_id;
        const [assets, total] = await Promise.all([
            this.prisma.asset.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.asset.count({ where }),
        ]);
        return {
            data: assets,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async remove(id, userId) {
        const asset = await this.prisma.asset.findFirst({ where: { id, project: { user_id: userId } } });
        if (!asset)
            throw new common_1.NotFoundException('Arquivo não encontrado');
        return this.prisma.asset.delete({ where: { id } });
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map