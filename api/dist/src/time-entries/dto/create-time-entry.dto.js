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
exports.CreateTimeEntryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTimeEntryDto {
}
exports.CreateTimeEntryDto = CreateTimeEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-do-projeto' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTimeEntryDto.prototype, "project_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-da-tarefa' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTimeEntryDto.prototype, "task_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Trabalhando no componente X' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTimeEntryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-20T10:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTimeEntryDto.prototype, "start_time", void 0);
//# sourceMappingURL=create-time-entry.dto.js.map