import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @ApiPropertyOptional({ example: 'uuid-do-projeto' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiProperty({ example: 'Reunião de Kickoff' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Apresentação do time e alinhamento' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-06-20T10:00:00.000Z' })
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2026-06-20T11:00:00.000Z' })
  @IsDateString()
  end_date: string;
}
