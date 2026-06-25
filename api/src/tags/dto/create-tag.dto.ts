import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'uuid-do-projeto' })
  @IsUUID()
  project_id: string;

  @ApiProperty({ example: 'React' })
  @IsString()
  @MaxLength(50)
  name: string;
}
