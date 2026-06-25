import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo projeto' })
  create(@Body() dto: CreateProjectDto, @Req() req: Request) {
    return this.projectsService.create(dto, (req.user as any).id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar projetos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'area', required: false })
  @ApiQuery({ name: 'client_id', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('area') area?: string,
    @Query('client_id') client_id?: string,
    @Req() req?: Request,
  ) {
    return this.projectsService.findAll({
      page,
      limit,
      status,
      priority,
      area,
      client_id,
    }, (req?.user as any)?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar projeto por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.projectsService.findOne(id, (req.user as any).id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar projeto' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    return this.projectsService.update(id, dto, (req.user as any).id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir projeto' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.projectsService.remove(id, (req.user as any).id);
  }
}
