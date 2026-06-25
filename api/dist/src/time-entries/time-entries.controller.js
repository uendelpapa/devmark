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
exports.TimeEntriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const time_entries_service_1 = require("./time-entries.service");
const create_time_entry_dto_1 = require("./dto/create-time-entry.dto");
const update_time_entry_dto_1 = require("./dto/update-time-entry.dto");
let TimeEntriesController = class TimeEntriesController {
    constructor(timeEntriesService) {
        this.timeEntriesService = timeEntriesService;
    }
    create(dto, req) {
        return this.timeEntriesService.create(dto, req.user.id);
    }
    findAll(project_id, task_id, req) {
        return this.timeEntriesService.findAll({ project_id, task_id }, req?.user?.id);
    }
    stopTimer(id, dto, req) {
        return this.timeEntriesService.stopTimer(id, dto, req.user.id);
    }
    remove(id, req) {
        return this.timeEntriesService.remove(id, req.user.id);
    }
};
exports.TimeEntriesController = TimeEntriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar timer (criar time entry)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_time_entry_dto_1.CreateTimeEntryDto, Object]),
    __metadata("design:returntype", void 0)
], TimeEntriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar time entries' }),
    (0, swagger_1.ApiQuery)({ name: 'project_id', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'task_id', required: false }),
    __param(0, (0, common_1.Query)('project_id')),
    __param(1, (0, common_1.Query)('task_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TimeEntriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Parar timer (preencher end_time)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_time_entry_dto_1.UpdateTimeEntryDto, Object]),
    __metadata("design:returntype", void 0)
], TimeEntriesController.prototype, "stopTimer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir time entry' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TimeEntriesController.prototype, "remove", null);
exports.TimeEntriesController = TimeEntriesController = __decorate([
    (0, swagger_1.ApiTags)('time-entries'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('time-entries'),
    __metadata("design:paramtypes", [time_entries_service_1.TimeEntriesService])
], TimeEntriesController);
//# sourceMappingURL=time-entries.controller.js.map