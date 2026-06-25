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
exports.CreateAssetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AssetType;
(function (AssetType) {
    AssetType["IMAGE"] = "IMAGE";
    AssetType["VIDEO"] = "VIDEO";
    AssetType["PDF"] = "PDF";
    AssetType["DOCUMENT"] = "DOCUMENT";
    AssetType["SPREADSHEET"] = "SPREADSHEET";
    AssetType["DESIGN"] = "DESIGN";
    AssetType["OTHER"] = "OTHER";
})(AssetType || (AssetType = {}));
class CreateAssetDto {
}
exports.CreateAssetDto = CreateAssetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-do-projeto' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "project_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-da-tarefa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "task_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'layout-final.pdf' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AssetType }),
    (0, class_validator_1.IsEnum)(AssetType),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.com/files/layout-final.pdf' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1024500, description: 'Tamanho em bytes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAssetDto.prototype, "size", void 0);
//# sourceMappingURL=create-asset.dto.js.map