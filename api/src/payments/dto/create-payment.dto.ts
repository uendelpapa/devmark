import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

enum PaymentMethod {
  PIX = 'PIX',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
}

enum PaymentStatus {
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
}

export class CreatePaymentDto {
  @ApiProperty({ example: 'uuid-do-projeto' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ example: 1000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  due_date: string;

  @ApiPropertyOptional({ example: '2026-06-30' })
  @IsOptional()
  @IsDateString()
  payment_date?: string;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  payment_method?: PaymentMethod;

  @ApiPropertyOptional({ enum: PaymentStatus, default: 'PENDING' })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ example: '1ª Parcela' })
  @IsOptional()
  @IsString()
  notes?: string;
}
