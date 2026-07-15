import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) { }

  async getAnalyticsData(userId: string, monthsCount: number) {
    const now = new Date();
    // Período Atual: de [startDate] até hoje
    const startDate = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1), 1);
    startDate.setHours(0, 0, 0, 0);

    // Período Anterior: de [prevStartDate] até antes de [startDate]
    const prevStartDate = new Date(now.getFullYear(), now.getMonth() - (2 * monthsCount - 1), 1);
    prevStartDate.setHours(0, 0, 0, 0);
    const prevEndDate = new Date(startDate.getTime() - 1);

    // 1. Buscar todos os projetos
    const projects = await this.prisma.project.findMany({
      where: { user_id: userId },
      include: {
        payments: true,
        project_expenses: true,
        tasks: {
          include: {
            task_expenses: true,
          },
        },
        time_entries: true,
        client: {
          select: {
            id: true,
            name: true,
            company_name: true,
            industry: true,
            status: true,
          },
        },
      },
    });

    // 2. Buscar serviços avulsos
    const services = await this.prisma.service.findMany({
      where: { user_id: userId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 3. Buscar todos os clientes para métricas de conversão e funil
    const clients = await this.prisma.client.findMany({
      where: { user_id: userId },
    });

    // 4. Montar a lista de meses do período atual
    const monthsList: {
      key: string;
      name: string;
      start: Date;
      end: Date;
    }[] = [];

    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const key = `${year}-${String(month + 1).padStart(2, '0')}`;
      const monthNames = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      const name = `${monthNames[month]} ${String(year).slice(-2)}`;

      monthsList.push({ key, name, start, end });
    }

    // 5. Agregar dados mensais do período atual
    const monthlyData = monthsList.map((m) => {
      let revenue = 0;
      let pending = 0;
      let expenses = 0;
      let demandsCreated = 0;
      let demandsCompleted = 0;

      projects.forEach((p) => {
        p.payments.forEach((pay) => {
          if (
            pay.status === 'PAID' &&
            pay.payment_date &&
            pay.payment_date >= m.start &&
            pay.payment_date <= m.end
          ) {
            revenue += Number(pay.amount);
          }
        });

        p.payments.forEach((pay) => {
          if (
            (pay.status === 'PENDING' || pay.status === 'OVERDUE') &&
            pay.due_date >= m.start &&
            pay.due_date <= m.end
          ) {
            pending += Number(pay.amount);
          }
        });

        p.project_expenses.forEach((e) => {
          if (e.created_at >= m.start && e.created_at <= m.end) {
            expenses += Number(e.value);
          }
        });

        p.tasks.forEach((t) => {
          t.task_expenses.forEach((e) => {
            if (e.created_at >= m.start && e.created_at <= m.end) {
              expenses += Number(e.value);
            }
          });
        });

        if (p.created_at >= m.start && p.created_at <= m.end) {
          demandsCreated += 1;
        }

        const compDate = p.delivery_date ? new Date(p.delivery_date) : p.updated_at;
        if (p.status === 'COMPLETED' && compDate >= m.start && compDate <= m.end) {
          demandsCompleted += 1;
        }
      });

      services.forEach((s) => {
        if (
          s.status === 'COMPLETED' &&
          s.finished_at &&
          s.finished_at >= m.start &&
          s.finished_at <= m.end
        ) {
          revenue += Number(s.amount_received);
        }

        if (
          s.status !== 'COMPLETED' &&
          s.status !== 'CANCELED' &&
          s.due_date &&
          s.due_date >= m.start &&
          s.due_date <= m.end
        ) {
          pending += Number(s.amount_pending);
        }

        if (s.created_at >= m.start && s.created_at <= m.end) {
          demandsCreated += 1;
        }

        if (
          s.status === 'COMPLETED' &&
          s.finished_at &&
          s.finished_at >= m.start &&
          s.finished_at <= m.end
        ) {
          demandsCompleted += 1;
        }
      });

      return {
        month: m.name,
        receita: Number(revenue.toFixed(2)),
        aReceber: Number(pending.toFixed(2)),
        despesas: Number(expenses.toFixed(2)),
        demandasCriadas: demandsCreated,
        demandasConcluidas: demandsCompleted,
      };
    });

    // 6. Calcular métricas do período atual vs anterior para os 4 cards KPI

    // KPI 1: Faturamento (Receita)
    let currRevenue = 0;
    let prevRevenue = 0;

    projects.forEach((p) => {
      p.payments.forEach((pay) => {
        if (pay.status === 'PAID' && pay.payment_date) {
          if (pay.payment_date >= startDate) {
            currRevenue += Number(pay.amount);
          } else if (pay.payment_date >= prevStartDate && pay.payment_date <= prevEndDate) {
            prevRevenue += Number(pay.amount);
          }
        }
      });
    });
    services.forEach((s) => {
      if (s.status === 'COMPLETED' && s.finished_at) {
        if (s.finished_at >= startDate) {
          currRevenue += Number(s.amount_received);
        } else if (s.finished_at >= prevStartDate && s.finished_at <= prevEndDate) {
          prevRevenue += Number(s.amount_received);
        }
      }
    });

    const revenueDiff = prevRevenue > 0 ? ((currRevenue - prevRevenue) / prevRevenue) * 100 : currRevenue > 0 ? 100 : 0;

    // KPI 2: Taxa de Conversão de CRM
    // Atual
    const activeClients = clients.filter((c) => c.status === 'ACTIVE').length;
    const totalClients = clients.length;
    const conversionRate = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;
    // Anterior (no final do período anterior)
    const prevActiveClients = clients.filter((c) => c.status === 'ACTIVE' && c.created_at <= prevEndDate).length;
    const prevTotalClients = clients.filter((c) => c.created_at <= prevEndDate).length;
    const prevConversionRate = prevTotalClients > 0 ? (prevActiveClients / prevTotalClients) * 100 : 0;

    const conversionDiff = conversionRate - prevConversionRate;

    // KPI 3: Projetos Ativos
    // Projetos ativos são aqueles criados até hoje que não foram finalizados ou cancelados
    const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'REVIEW').length;
    // Projetos ativos no fim do período anterior
    const prevActiveProjects = projects.filter(
      (p) =>
        p.created_at <= prevEndDate &&
        (p.status === 'IN_PROGRESS' || p.status === 'REVIEW' || (p.status === 'COMPLETED' && p.delivery_date && new Date(p.delivery_date) > prevEndDate)),
    ).length;

    const projectsDiff = prevActiveProjects > 0 ? ((activeProjects - prevActiveProjects) / prevActiveProjects) * 100 : activeProjects > 0 ? 100 : 0;

    // KPI 4: Horas Trabalhadas
    let currHours = 0;
    let prevHours = 0;
    projects.forEach((p) => {
      p.time_entries.forEach((entry) => {
        if (entry.start_time && entry.duration) {
          if (entry.start_time >= startDate) {
            currHours += entry.duration;
          } else if (entry.start_time >= prevStartDate && entry.start_time <= prevEndDate) {
            prevHours += entry.duration;
          }
        }
      });
    });

    const currHoursVal = Number((currHours / 60).toFixed(1));
    const prevHoursVal = Number((prevHours / 60).toFixed(1));
    const hoursDiff = prevHoursVal > 0 ? ((currHoursVal - prevHoursVal) / prevHoursVal) * 100 : currHoursVal > 0 ? 100 : 0;

    const kpis = {
      revenue: {
        value: Number(currRevenue.toFixed(2)),
        diff: Number(revenueDiff.toFixed(1)),
        isPositive: revenueDiff >= 0,
      },
      conversion: {
        value: Number(conversionRate.toFixed(1)),
        diff: Number(conversionDiff.toFixed(1)),
        isPositive: conversionDiff >= 0,
      },
      activeProjects: {
        value: activeProjects,
        diff: Number(projectsDiff.toFixed(1)),
        isPositive: projectsDiff >= 0,
      },
      hours: {
        value: currHoursVal,
        diff: Number(hoursDiff.toFixed(1)),
        isPositive: hoursDiff >= 0,
      },
    };

    // 7. Totais Rápidos do Período
    let totalDespesas = 0;
    projects.forEach((p) => {
      p.project_expenses.forEach((e) => {
        if (e.created_at >= startDate) totalDespesas += Number(e.value);
      });
      p.tasks.forEach((t) => {
        t.task_expenses.forEach((e) => {
          if (e.created_at >= startDate) totalDespesas += Number(e.value);
        });
      });
    });

    const quickStats = {
      totalRecebido: Number(currRevenue.toFixed(2)),
      totalDespesas: Number(totalDespesas.toFixed(2)),
      saldoLiquido: Number((currRevenue - totalDespesas).toFixed(2)),
    };

    // 8. Funil do CRM Pipeline (semelhante ao Lead Sources da imagem)
    const funnelLeads = clients.filter((c) => c.status === 'LEAD').length;
    const funnelNegotiating = clients.filter((c) => c.status === 'NEGOTIATING').length;
    const funnelActive = clients.filter((c) => c.status === 'ACTIVE').length;
    const funnelTotal = clients.length;

    const crmFunnel = [
      { stage: 'Leads', count: funnelLeads, percentage: funnelTotal > 0 ? Math.round((funnelLeads / funnelTotal) * 100) : 0, color: '#38BDF8' },
      { stage: 'Em Negociação', count: funnelNegotiating, percentage: funnelTotal > 0 ? Math.round((funnelNegotiating / funnelTotal) * 100) : 0, color: '#C084FC' },
      { stage: 'Clientes Ativos', count: funnelActive, percentage: funnelTotal > 0 ? Math.round((funnelActive / funnelTotal) * 100) : 0, color: '#011D00' },
    ];

    // 9. Distribuição de Custos por Categoria
    const expensesByCategory: Record<string, number> = {};
    const categoriesList = ['AI', 'SOFTWARE', 'DOMAIN', 'HOSTING', 'DESIGN', 'ADS', 'FREELANCER', 'OTHER'];
    categoriesList.forEach((c) => (expensesByCategory[c] = 0));

    projects.forEach((p) => {
      p.project_expenses.forEach((e) => {
        if (e.created_at >= startDate) {
          expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + Number(e.value);
        }
      });
      p.tasks.forEach((t) => {
        t.task_expenses.forEach((e) => {
          if (e.created_at >= startDate) {
            expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + Number(e.value);
          }
        });
      });
    });

    const totalPeriodExpenses = Object.values(expensesByCategory).reduce((acc, val) => acc + val, 0);

    const costDistribution = Object.entries(expensesByCategory)
      .map(([category, value]) => ({
        category,
        value: Number(value.toFixed(2)),
        percentage: totalPeriodExpenses > 0 ? Number(((value / totalPeriodExpenses) * 100).toFixed(2)) : 0,
      }))
      .filter((item) => item.value > 0);

    // 10. Desempenho por Cliente (Tabela de clientes mais valiosos)
    const clientBilling: Record<
      string,
      { id: string; name: string; companyName: string; status: string; billed: number; projectsCount: number }
    > = {};

    projects.forEach((p) => {
      let billedForProject = 0;
      p.payments.forEach((pay) => {
        if (pay.status === 'PAID' && pay.payment_date && pay.payment_date >= startDate) {
          billedForProject += Number(pay.amount);
        }
      });

      if (billedForProject > 0) {
        if (!clientBilling[p.client_id]) {
          clientBilling[p.client_id] = {
            id: p.client_id,
            name: p.client.name,
            companyName: p.client.company_name || 'Autônomo',
            status: p.client.status,
            billed: 0,
            projectsCount: 0,
          };
        }
        clientBilling[p.client_id].billed += billedForProject;
        clientBilling[p.client_id].projectsCount += 1;
      }
    });

    services.forEach((s) => {
      let billedForService = 0;
      if (s.status === 'COMPLETED' && s.finished_at && s.finished_at >= startDate) {
        billedForService += Number(s.amount_received);
      }

      if (billedForService > 0) {
        if (!clientBilling[s.client_id]) {
          clientBilling[s.client_id] = {
            id: s.client_id,
            name: s.client.name,
            companyName: 'Serviço Avulso',
            status: 'ACTIVE',
            billed: 0,
            projectsCount: 0,
          };
        }
        clientBilling[s.client_id].billed += billedForService;
        clientBilling[s.client_id].projectsCount += 1;
      }
    });

    const topClients = Object.values(clientBilling)
      .sort((a, b) => b.billed - a.billed)
      .map((c) => ({
        ...c,
        billed: Number(c.billed.toFixed(2)),
        percentage: currRevenue > 0 ? Number(((c.billed / currRevenue) * 100).toFixed(1)) : 0,
      }));

    // 11. Eficiência de Horas Trabalhadas por Projeto
    const projectHours: Record<string, { id: string; name: string; hours: number }> = {};

    projects.forEach((p) => {
      let durationMinutes = 0;
      p.time_entries.forEach((entry) => {
        if (entry.start_time && entry.start_time >= startDate && entry.duration) {
          durationMinutes += entry.duration;
        }
      });

      const hours = Number((durationMinutes / 60).toFixed(2));
      if (hours > 0) {
        projectHours[p.id] = {
          id: p.id,
          name: p.name,
          hours: hours,
        };
      }
    });

    const workedHoursByProject = Object.values(projectHours)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 7); // Limitar a 7 projetos semelhantes aos 7 agentes da imagem

    return {
      kpis,
      quickStats,
      monthlyData,
      crmFunnel,
      costDistribution,
      topClients,
      workedHoursByProject,
    };
  }
}
