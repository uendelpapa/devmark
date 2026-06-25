import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsInt,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

enum ProjectArea {
  MARKETING = 'MARKETING',
  DEVELOPER = 'DEVELOPER',
}

enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_CLIENT = 'WAITING_CLIENT',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateProjectDto {
  @ApiProperty({ example: 'uuid-do-cliente' })
  @IsUUID()
  client_id: string;

  @ApiProperty({ example: 'Website Corporativo' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Criação de website para a empresa XYZ' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ProjectArea })
  @IsEnum(ProjectArea)
  area: ProjectArea;

  @ApiPropertyOptional({ example: 'Frontend' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, default: 'PLANNING' })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ enum: Priority, default: 'MEDIUM' })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ example: 7500.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  project_value?: number;

  @ApiPropertyOptional({ example: 5000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount_received?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimated_hours?: number;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ example: '2026-08-30' })
  @IsOptional()
  @IsDateString()
  expected_delivery_date?: string;

  @ApiPropertyOptional({ example: 'Notas do projeto' })
  @IsOptional()
  @IsString()
  notes?: string;
}
