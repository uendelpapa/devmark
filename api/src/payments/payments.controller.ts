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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar parcela de pagamento' })
  create(@Body() dto: CreatePaymentDto, @Req() req: Request) {
    return this.paymentsService.create(dto, (req.user as any).id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagamentos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'project_id', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('project_id') project_id?: string,
    @Query('status') status?: string,
    @Req() req?: Request,
  ) {
    return this.paymentsService.findAll(
      { page, limit, project_id, status },
      (req?.user as any)?.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.paymentsService.findOne(id, (req.user as any).id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar pagamento' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
    @Req() req: Request,
  ) {
    return this.paymentsService.update(id, dto, (req.user as any).id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir pagamento' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.paymentsService.remove(id, (req.user as any).id);
  }
}
