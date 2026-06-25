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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = class ExpensesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProjectExpense(dto, userId) {
        const project = await this.prisma.project.findFirst({
            where: { id: dto.project_id, user_id: userId },
        });
        if (!project)
            throw new common_1.NotFoundException('Projeto não encontrado');
        return this.prisma.projectExpense.create({ data: dto });
    }
    async findProjectExpenses(project_id, userId) {
        return this.prisma.projectExpense.findMany({
            where: { project: { user_id: userId }, ...(project_id ? { project_id } : {}) },
            orderBy: { created_at: 'desc' },
            include: {
                project: { select: { id: true, name: true } },
            },
        });
    }
    async removeProjectExpense(id, userId) {
        const expense = await this.prisma.projectExpense.findFirst({ where: { id, project: { user_id: userId } } });
        if (!expense)
            throw new common_1.NotFoundException('Custo de projeto não encontrado');
        return this.prisma.projectExpense.delete({ where: { id } });
    }
    async createTaskExpense(dto, userId) {
        const task = await this.prisma.task.findFirst({
            where: { id: dto.task_id, user_id: userId },
        });
        if (!task)
            throw new common_1.NotFoundException('Tarefa não encontrada');
        return this.prisma.taskExpense.create({ data: dto });
    }
    async findTaskExpenses(task_id, userId) {
        return this.prisma.taskExpense.findMany({
            where: { task: { user_id: userId }, ...(task_id ? { task_id } : {}) },
            orderBy: { created_at: 'desc' },
            include: {
                task: { select: { id: true, title: true, project_id: true } },
            },
        });
    }
    async removeTaskExpense(id, userId) {
        const expense = await this.prisma.taskExpense.findFirst({ where: { id, task: { user_id: userId } } });
        if (!expense)
            throw new common_1.NotFoundException('Custo de tarefa não encontrado');
        return this.prisma.taskExpense.delete({ where: { id } });
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map