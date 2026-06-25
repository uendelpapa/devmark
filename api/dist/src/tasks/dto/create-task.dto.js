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
exports.CreateTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const subtask_dto_1 = require("./subtask.dto");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "PENDING";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["REVIEW"] = "REVIEW";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["CANCELED"] = "CANCELED";
})(TaskStatus || (TaskStatus = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
    Priority["URGENT"] = "URGENT";
})(Priority || (Priority = {}));
class CreateTaskDto {
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-do-projeto' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "project_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Desenvolver página de login' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Criar o componente de formulário com validação' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TaskStatus, default: 'PENDING' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TaskStatus),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: Priority, default: 'MEDIUM' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Priority),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 8 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "estimated_hours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1500.00 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "expected_value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1500.00 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "received_value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "due_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['frontend', 'urgente'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [subtask_dto_1.SubtaskDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => subtask_dto_1.SubtaskDto),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "subtasks", void 0);
//# sourceMappingURL=create-task.dto.js.map