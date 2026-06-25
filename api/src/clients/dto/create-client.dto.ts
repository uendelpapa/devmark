import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';

enum ClientStatus {
  LEAD = 'LEAD',
  NEGOTIATING = 'NEGOTIATING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOST = 'LOST',
}

enum CommunicationType {
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  MEETING = 'MEETING',
}

enum PaymentMethod {
  PIX = 'PIX',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
}

export class CreateClientDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'joao@empresa.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'Empresa LTDA' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  company_name?: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  document?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'https://empresa.com' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({ example: '@empresa' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/joao' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  linkedin?: string;

  @ApiPropertyOptional({ example: 'Tecnologia' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({ example: 'Indicação' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @ApiPropertyOptional({ enum: ClientStatus, default: 'LEAD' })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiPropertyOptional({ enum: CommunicationType, default: 'WHATSAPP' })
  @IsOptional()
  @IsEnum(CommunicationType)
  preferred_communication?: CommunicationType;

  @ApiPropertyOptional({ enum: PaymentMethod, default: 'PIX' })
  @IsOptional()
  @IsEnum(PaymentMethod)
  preferred_payment_method?: PaymentMethod;

  @ApiPropertyOptional({ example: 'Cliente indicado pelo Bob' })
  @IsOptional()
  @IsString()
  notes?: string;
}
