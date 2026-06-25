import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardData(userId: string): Promise<{
        project_summary: {
            total: number;
            completed: number;
            in_progress: number;
            planning: number;
        };
        prev_project_summary: {
            total: number;
            completed: number;
            in_progress: number;
            planning: number;
        };
        finance_summary: {
            total_paid: number;
            total_pending: number;
            total_expenses: number;
        };
        prev_finance_summary: {
            total_paid: number;
            total_pending: number;
            total_expenses: number;
        };
        projects: {
            name: string;
            id: string;
            expected_delivery_date: Date | null;
        }[];
        pending_payments: {
            payment_id: string;
            amount: number;
            due_date: Date;
            client_name: string;
            client_email: string;
        }[];
        weekly_work_level: number[];
    }>;
}
