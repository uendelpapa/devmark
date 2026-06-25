import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    const now = new Date();
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // 1. Agregar totalizadores de projetos
    const projects = await this.prisma.project.findMany({
      where: { user_id: userId },
      select: { status: true, created_at: true, updated_at: true, delivery_date: true },
    });

    const project_summary = {
      total: projects.length,
      completed: projects.filter((p) => p.status === 'COMPLETED').length,
      in_progress: projects.filter((p) => p.status === 'IN_PROGRESS').length,
      planning: projects.filter((p) => p.status === 'PLANNING').length,
    };

    const prevProjects = projects.filter((p) => p.created_at <= endOfPreviousMonth);
    const prev_project_summary = {
      total: prevProjects.length,
      completed: prevProjects.filter((p) => 
        p.status === 'COMPLETED' && 
        (p.delivery_date ? new Date(p.delivery_date) <= endOfPreviousMonth : p.updated_at <= endOfPreviousMonth)
      ).length,
      in_progress: prevProjects.filter((p) => 
        p.status === 'IN_PROGRESS' && p.updated_at <= endOfPreviousMonth
      ).length,
      planning: prevProjects.filter((p) => 
        p.status === 'PLANNING' && p.updated_at <= endOfPreviousMonth
      ).length,
    };

    // 2. Agregar dados financeiros (relacionados diretamente aos projetos)
    const projectsFinance = await this.prisma.project.aggregate({
      where: { user_id: userId },
      _sum: {
        amount_received: true,
        amount_pending: true,
      },
    });

    const total_paid = Number(projectsFinance._sum.amount_received || 0);
    const total_pending = Number(projectsFinance._sum.amount_pending || 0);

    const projectExpenses = await this.prisma.projectExpense.aggregate({
      where: { project: { user_id: userId } },
      _sum: { value: true },
    });
    
    const taskExpenses = await this.prisma.taskExpense.aggregate({
      where: { task: { user_id: userId } },
      _sum: { value: true },
    });

    const total_expenses = 
      Number(projectExpenses._sum.value || 0) + 
      Number(taskExpenses._sum.value || 0);

    const finance_summary = {
      total_paid,
      total_pending,
      total_expenses,
    };

    // Agregar dados financeiros do mês anterior
    const prevPaidPayments = await this.prisma.payment.aggregate({
      where: {
        project: { user_id: userId },
        status: 'PAID',
        payment_date: { lte: endOfPreviousMonth }
      },
      _sum: { amount: true }
    });
    const prev_total_paid = Number(prevPaidPayments._sum.amount || 0);

    const prevPendingPayments = await this.prisma.payment.aggregate({
      where: {
        project: { user_id: userId },
        due_date: { lte: endOfPreviousMonth },
        OR: [
          { status: { in: ['PENDING', 'OVERDUE'] } },
          { 
            status: 'PAID',
            payment_date: { gt: endOfPreviousMonth }
          }
        ]
      },
      _sum: { amount: true }
    });
    const prev_total_pending = Number(prevPendingPayments._sum.amount || 0);

    const prevProjectExpensesAgg = await this.prisma.projectExpense.aggregate({
      where: { project: { user_id: userId }, created_at: { lte: endOfPreviousMonth } },
      _sum: { value: true }
    });
    const prevTaskExpensesAgg = await this.prisma.taskExpense.aggregate({
      where: { task: { user_id: userId }, created_at: { lte: endOfPreviousMonth } },
      _sum: { value: true }
    });
    const prev_total_expenses = 
      Number(prevProjectExpensesAgg._sum.value || 0) + 
      Number(prevTaskExpensesAgg._sum.value || 0);

    const prev_finance_summary = {
      total_paid: prev_total_paid,
      total_pending: prev_total_pending,
      total_expenses: prev_total_expenses,
    };


    // 3. Listar últimos projetos (limit 9)
    const recent_projects = await this.prisma.project.findMany({
      where: { user_id: userId },
      take: 9,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        expected_delivery_date: true,
      },
    });

    // 4. Listar pagamentos pendentes
    const pendingPaymentsRaw = await this.prisma.payment.findMany({
      where: { project: { user_id: userId }, status: { in: ['PENDING', 'OVERDUE'] } },
      orderBy: { due_date: 'asc' },
      include: {
        project: {
          include: {
            client: { select: { name: true, email: true } },
          },
        },
      },
    });

    const pending_payments = pendingPaymentsRaw.map((p) => ({
      payment_id: p.id,
      amount: Number(p.amount),
      due_date: p.due_date,
      client_name: p.project.client.name,
      client_email: p.project.client.email,
    }));

    // 5. Calcular nível de trabalho semanal (horas por dia de segunda a domingo)
    const currentDay = now.getDay();
    const daysToSub = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToSub);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const timeEntries = await this.prisma.timeEntry.findMany({
      where: {
        project: { user_id: userId },
        start_time: {
          gte: monday,
          lte: sunday,
        },
        duration: { not: null },
      },
      select: {
        start_time: true,
        duration: true,
      },
    });

    const dailyMinutes = [0, 0, 0, 0, 0, 0, 0];
    timeEntries.forEach((entry) => {
      const entryDay = entry.start_time.getDay();
      const index = entryDay === 0 ? 6 : entryDay - 1;
      dailyMinutes[index] += entry.duration || 0;
    });

    const weekly_work_level = dailyMinutes.map((mins) =>
      Number((mins / 60).toFixed(2)),
    );

    return {
      project_summary,
      prev_project_summary,
      finance_summary,
      prev_finance_summary,
      projects: recent_projects,
      pending_payments,
      weekly_work_level,
    };
  }
}
