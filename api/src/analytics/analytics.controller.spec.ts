import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  const mockAnalyticsService = {
    getAnalyticsData: jest.fn().mockResolvedValue({
      quickStats: {
        totalRecebido: 1000,
        totalDespesas: 200,
        saldoLiquido: 800,
      },
      kpis: {
        revenue: { value: 1000, diff: 10, isPositive: true },
        conversion: { value: 20, diff: 2, isPositive: true },
        activeProjects: { value: 3, diff: 0, isPositive: true },
        hours: { value: 10, diff: -5, isPositive: false },
      },
      monthlyData: [],
      crmFunnel: [],
      costDistribution: [],
      topClients: [],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fetch analytics data with correct user id and defaults to 6 months', async () => {
    const req = { user: { id: 'user-uuid-123' } } as any;
    const result = await controller.getAnalytics(req, undefined);

    expect(service.getAnalyticsData).toHaveBeenCalledWith('user-uuid-123', 6);
    expect(result).toHaveProperty('quickStats');
    expect(result.quickStats.totalRecebido).toBe(1000);
  });

  it('should parse query months correctly', async () => {
    const req = { user: { id: 'user-uuid-123' } } as any;
    await controller.getAnalytics(req, '12');

    expect(service.getAnalyticsData).toHaveBeenCalledWith('user-uuid-123', 12);
  });
});
