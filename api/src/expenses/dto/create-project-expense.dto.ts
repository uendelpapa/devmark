import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  MaxLength,
  Min,
} from 'class-validator';

enum ExpenseCategory {
  AI = 'AI',
  SOFTWARE = 'SOFTWARE',
  DOMAIN = 'DOMAIN',
  HOSTING = 'HOSTING',
  DESIGN = 'DESIGN',
  ADS = 'ADS',
  FREELANCER = 'FREELANCER',
  OTHER = 'OTHER',
}

export class CreateProjectExpenseDto {
  @ApiProperty({ example: 'uuid-do-projeto' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ example: 'Licença GitHub Copilot' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Pagamento mensal' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ example: 100.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  value: number;
}
