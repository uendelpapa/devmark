import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class SubtaskDto {
  @ApiProperty({ example: 'Criar validações front-end' })
  @IsString()
  @MaxLength(255)
  text: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
