import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateTimeEntryDto {
  @ApiProperty({ example: 'uuid-do-projeto' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ example: 'uuid-da-tarefa' })
  @IsUUID()
  task_id: string;

  @ApiPropertyOptional({ example: 'Trabalhando no componente X' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-06-20T10:00:00.000Z' })
  @IsDateString()
  start_time: string;
}
