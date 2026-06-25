import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('project-tags')
@Controller('project-tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar tag para projeto' })
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tags' })
  @ApiQuery({ name: 'project_id', required: false })
  findAll(@Query('project_id') project_id?: string) {
    return this.tagsService.findAll(project_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tag' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagsService.remove(id);
  }
}
