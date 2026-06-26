import { Request } from 'express';
import { ExpensesService } from './expenses.service';
import { CreateProjectExpenseDto } from './dto/create-project-expense.dto';
import { CreateTaskExpenseDto } from './dto/create-task-expense.dto';
export declare class ProjectExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(dto: CreateProjectExpenseDto, req: Request): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        project_id: string;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(project_id: string | undefined, req: Request): Promise<({
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
    remove(id: string, req: Request): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        project_id: string;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
    }>;
}
export declare class TaskExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(dto: CreateTaskExpenseDto, req: Request): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        task_id: string;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(task_id: string | undefined, req: Request): Promise<({
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
        task_id: string;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    remove(id: string, req: Request): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        task_id: string;
        category: import("@prisma/client").$Enums.ExpenseCategory;
        value: import("@prisma/client/runtime/library").Decimal;
    }>;
}
