import {
  Controller,
  Get,
  Post,
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
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@ApiTags('assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo arquivo (metadata)' })
  create(@Body() dto: CreateAssetDto, @Req() req: Request) {
    return this.assetsService.create(dto, (req.user as any).id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar arquivos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'project_id', required: false })
  @ApiQuery({ name: 'task_id', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('project_id') project_id?: string,
    @Query('task_id') task_id?: string,
    @Req() req?: Request,
  ) {
    return this.assetsService.findAll(
      { page, limit, project_id, task_id },
      (req?.user as any)?.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir arquivo' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.assetsService.remove(id, (req.user as any).id);
  }
}
