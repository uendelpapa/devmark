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
exports.CreateClientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ClientStatus;
(function (ClientStatus) {
    ClientStatus["LEAD"] = "LEAD";
    ClientStatus["NEGOTIATING"] = "NEGOTIATING";
    ClientStatus["ACTIVE"] = "ACTIVE";
    ClientStatus["INACTIVE"] = "INACTIVE";
    ClientStatus["LOST"] = "LOST";
})(ClientStatus || (ClientStatus = {}));
var CommunicationType;
(function (CommunicationType) {
    CommunicationType["WHATSAPP"] = "WHATSAPP";
    CommunicationType["EMAIL"] = "EMAIL";
    CommunicationType["PHONE"] = "PHONE";
    CommunicationType["MEETING"] = "MEETING";
})(CommunicationType || (CommunicationType = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["PIX"] = "PIX";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["CASH"] = "CASH";
})(PaymentMethod || (PaymentMethod = {}));
class CreateClientDto {
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'João Silva' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'joao@empresa.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Empresa LTDA' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateClientDto.prototype, "company_name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12.345.678/0001-90' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreateClientDto.prototype, "document", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '(11) 99999-9999' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://empresa.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateClientDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '@empresa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateClientDto.prototype, "instagram", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://linkedin.com/in/joao' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateClientDto.prototype, "linkedin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Tecnologia' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateClientDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Indicação' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateClientDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ClientStatus, default: 'LEAD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ClientStatus),
    __metadata("design:type", String)
], CreateClientDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: CommunicationType, default: 'WHATSAPP' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CommunicationType),
    __metadata("design:type", String)
], CreateClientDto.prototype, "preferred_communication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: PaymentMethod, default: 'PIX' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], CreateClientDto.prototype, "preferred_payment_method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Cliente indicado pelo Bob' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "notes", void 0);
//# sourceMappingURL=create-client.dto.js.map