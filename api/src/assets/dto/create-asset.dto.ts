import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsInt,
  MaxLength,
  Min,
} from 'class-validator';

enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  DOCUMENT = 'DOCUMENT',
  SPREADSHEET = 'SPREADSHEET',
  DESIGN = 'DESIGN',
  OTHER = 'OTHER',
}

export class CreateAssetDto {
  @ApiProperty({ example: 'uuid-do-projeto' })
  @IsUUID()
  project_id: string;

  @ApiPropertyOptional({ example: 'uuid-da-tarefa' })
  @IsOptional()
  @IsUUID()
  task_id?: string;

  @ApiProperty({ example: 'layout-final.pdf' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ enum: AssetType })
  @IsEnum(AssetType)
  type: AssetType;

  @ApiProperty({ example: 'https://storage.com/files/layout-final.pdf' })
  @IsString()
  @MaxLength(500)
  url: string;

  @ApiPropertyOptional({ example: 1024500, description: 'Tamanho em bytes' })
  @IsOptional()
  @IsInt()
  @Min(0)
  size?: number;
}
