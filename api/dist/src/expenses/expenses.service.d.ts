import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectExpenseDto } from './dto/create-project-expense.dto';
import { CreateTaskExpenseDto } from './dto/create-task-expense.dto';
export declare class ExpensesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createProjectExpense(dto: CreateProjectExpenseDto, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        project_id: string;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
    }>;
    findProjectExpenses(project_id: string | undefined, userId: string): Promise<({
        project: {
            name: string;
            id: string;
        };
    } & {
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        project_id: string;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    removeProjectExpense(id: string, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        project_id: string;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
    }>;
    createTaskExpense(dto: CreateTaskExpenseDto, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
        task_id: string;
    }>;
    findTaskExpenses(task_id: string | undefined, userId: string): Promise<({
        task: {
            title: string;
            id: string;
            project_id: string;
        };
    } & {
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
        task_id: string;
    })[]>;
    removeTaskExpense(id: string, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
        task_id: string;
    }>;
}
