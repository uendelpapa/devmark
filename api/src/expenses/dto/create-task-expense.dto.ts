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

export class CreateTaskExpenseDto {
  @ApiProperty({ example: 'uuid-da-tarefa' })
  @IsUUID()
  task_id: string;

  @ApiProperty({ example: 'Plugin premium' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Compra de plugin para a tarefa' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ example: 50.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  value: number;
}
