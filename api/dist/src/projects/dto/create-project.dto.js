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
exports.CreateProjectDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ProjectArea;
(function (ProjectArea) {
    ProjectArea["MARKETING"] = "MARKETING";
    ProjectArea["DEVELOPER"] = "DEVELOPER";
})(ProjectArea || (ProjectArea = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "PLANNING";
    ProjectStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProjectStatus["WAITING_CLIENT"] = "WAITING_CLIENT";
    ProjectStatus["REVIEW"] = "REVIEW";
    ProjectStatus["COMPLETED"] = "COMPLETED";
    ProjectStatus["CANCELED"] = "CANCELED";
})(ProjectStatus || (ProjectStatus = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
    Priority["URGENT"] = "URGENT";
})(Priority || (Priority = {}));
class CreateProjectDto {
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-do-cliente' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "client_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Website Corporativo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Criação de website para a empresa XYZ' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ProjectArea }),
    (0, class_validator_1.IsEnum)(ProjectArea),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Frontend' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "specialty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ProjectStatus, default: 'PLANNING' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ProjectStatus),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: Priority, default: 'MEDIUM' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Priority),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 7500.00 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "project_value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5000.00 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "amount_received", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 120 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "estimated_hours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-06-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-08-30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "expected_delivery_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Notas do projeto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "notes", void 0);
//# sourceMappingURL=create-project.dto.js.map