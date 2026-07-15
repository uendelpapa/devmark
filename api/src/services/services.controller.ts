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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiTags('services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo serviço avulso' })
  create(@Body() dto: CreateServiceDto, @Req() req: Request) {
    return this.servicesService.create(dto, (req as any).user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar serviços avulsos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'client_id', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('client_id') client_id?: string,
    @Req() req?: Request,
  ) {
    return this.servicesService.findAll(
      {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        status,
        client_id,
      },
      (req as any).user.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar serviço avulso por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.servicesService.findOne(id, (req as any).user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar serviço avulso' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
    @Req() req: Request,
  ) {
    return this.servicesService.update(id, dto, (req as any).user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir serviço avulso' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.servicesService.remove(id, (req as any).user.id);
  }
}
