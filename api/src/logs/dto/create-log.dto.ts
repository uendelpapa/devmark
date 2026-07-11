import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { LogLevel } from '@prisma/client';

export class CreateLogDto {
  @ApiProperty({ example: 'Something went wrong' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: 'Error: Something went wrong\n    at Object.foo...' })
  @IsOptional()
  @IsString()
  stack?: string;

  @ApiPropertyOptional({ example: 'http://localhost:3000/clientes' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0...' })
  @IsOptional()
  @IsString()
  user_agent?: string;

  @ApiPropertyOptional({ enum: LogLevel, default: LogLevel.ERROR })
  @IsOptional()
  @IsEnum(LogLevel)
  level?: LogLevel;

  @ApiPropertyOptional({ example: { status: 500 } })
  @IsOptional()
  metadata?: any;
}
