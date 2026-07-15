import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get()
  @ApiOperation({ summary: 'Obter dados de análise estatística consolidada' })
  @ApiQuery({ name: 'months', required: false, description: 'Número de meses para análise', type: Number })
  getAnalytics(
    @Req() req: Request,
    @Query('months') months?: string,
  ) {
    const userId = (req as any).user.id;
    const monthsCount = months ? parseInt(months, 10) : 6;
    return this.analyticsService.getAnalyticsData(userId, isNaN(monthsCount) ? 6 : monthsCount);
  }
}
