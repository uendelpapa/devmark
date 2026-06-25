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
exports.CreatePaymentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["PIX"] = "PIX";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["CASH"] = "CASH";
})(PaymentMethod || (PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["OVERDUE"] = "OVERDUE";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["CANCELED"] = "CANCELED";
})(PaymentStatus || (PaymentStatus = {}));
class CreatePaymentDto {
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-do-projeto' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "project_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000.00 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-07-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "due_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-06-30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "payment_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: PaymentMethod }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "payment_method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: PaymentStatus, default: 'PENDING' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PaymentStatus),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1ª Parcela' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "notes", void 0);
//# sourceMappingURL=create-payment.dto.js.map