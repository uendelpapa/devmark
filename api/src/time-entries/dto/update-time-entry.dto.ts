import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTimeEntryDto {
  @ApiProperty({ example: '2026-06-20T12:00:00.000Z' })
  @IsDateString()
  end_time: string;

  @ApiPropertyOptional({ example: 'Finalizei a refatoração' })
  @IsOptional()
  @IsString()
  description?: string;
}
