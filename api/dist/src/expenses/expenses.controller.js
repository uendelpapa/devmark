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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskExpensesController = exports.ProjectExpensesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const expenses_service_1 = require("./expenses.service");
const create_project_expense_dto_1 = require("./dto/create-project-expense.dto");
const create_task_expense_dto_1 = require("./dto/create-task-expense.dto");
let ProjectExpensesController = class ProjectExpensesController {
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    create(dto, req) {
        return this.expensesService.createProjectExpense(dto, req.user.id);
    }
    findAll(project_id, req) {
        return this.expensesService.findProjectExpenses(project_id, req.user.id);
    }
    remove(id, req) {
        return this.expensesService.removeProjectExpense(id, req.user.id);
    }
};
exports.ProjectExpensesController = ProjectExpensesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar custo do projeto' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_expense_dto_1.CreateProjectExpenseDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar custos de projetos' }),
    (0, swagger_1.ApiQuery)({ name: 'project_id', required: false }),
    __param(0, (0, common_1.Query)('project_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir custo do projeto' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectExpensesController.prototype, "remove", null);
exports.ProjectExpensesController = ProjectExpensesController = __decorate([
    (0, swagger_1.ApiTags)('project-expenses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('project-expenses'),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService])
], ProjectExpensesController);
let TaskExpensesController = class TaskExpensesController {
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    create(dto, req) {
        return this.expensesService.createTaskExpense(dto, req.user.id);
    }
    findAll(task_id, req) {
        return this.expensesService.findTaskExpenses(task_id, req.user.id);
    }
    remove(id, req) {
        return this.expensesService.removeTaskExpense(id, req.user.id);
    }
};
exports.TaskExpensesController = TaskExpensesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar custo da tarefa' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_expense_dto_1.CreateTaskExpenseDto, Object]),
    __metadata("design:returntype", void 0)
], TaskExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar custos de tarefas' }),
    (0, swagger_1.ApiQuery)({ name: 'task_id', required: false }),
    __param(0, (0, common_1.Query)('task_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TaskExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir custo da tarefa' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TaskExpensesController.prototype, "remove", null);
exports.TaskExpensesController = TaskExpensesController = __decorate([
    (0, swagger_1.ApiTags)('task-expenses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('task-expenses'),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService])
], TaskExpensesController);
//# sourceMappingURL=expenses.controller.js.map