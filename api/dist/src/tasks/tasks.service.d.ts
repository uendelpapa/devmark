import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTaskDto, userId: string): Promise<{
        subtasks: {
            id: string;
            created_at: Date;
            updated_at: Date;
            text: string;
            completed: boolean;
            task_id: string;
        }[];
    } & {
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        tags: string[];
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.Priority;
        estimated_hours: number | null;
        worked_hours: number;
        project_id: string;
        due_date: Date | null;
        expected_value: Prisma.Decimal | null;
        received_value: Prisma.Decimal | null;
        started_at: Date | null;
        finished_at: Date | null;
    }>;
    findAll(params: {
        page?: number;
        limit?: number;
        project_id?: string;
        status?: string;
    }, userId: string): Promise<{
        data: ({
            subtasks: {
                id: string;
                created_at: Date;
                updated_at: Date;
                text: string;
                completed: boolean;
                task_id: string;
            }[];
        } & {
            description: string | null;
            title: string;
            id: string;
            created_at: Date;
            updated_at: Date;
            user_id: string;
            tags: string[];
            status: import("@prisma/client").$Enums.TaskStatus;
            priority: import("@prisma/client").$Enums.Priority;
            estimated_hours: number | null;
            worked_hours: number;
            project_id: string;
            due_date: Date | null;
            expected_value: Prisma.Decimal | null;
            received_value: Prisma.Decimal | null;
            started_at: Date | null;
            finished_at: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string): Promise<{
        project: {
            name: string;
            id: string;
        };
        time_entries: {
            description: string | null;
            id: string;
            created_at: Date;
            project_id: string;
            task_id: string;
            start_time: Date;
            end_time: Date | null;
            duration: number | null;
        }[];
        subtasks: {
            id: string;
            created_at: Date;
            updated_at: Date;
            text: string;
            completed: boolean;
            task_id: string;
        }[];
        task_expenses: {
            description: string | null;
            title: string;
            id: string;
            created_at: Date;
            task_id: string;
            category: import("@prisma/client").$Enums.ExpenseCategory;
            value: Prisma.Decimal;
        }[];
    } & {
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        tags: string[];
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.Priority;
        estimated_hours: number | null;
        worked_hours: number;
        project_id: string;
        due_date: Date | null;
        expected_value: Prisma.Decimal | null;
        received_value: Prisma.Decimal | null;
        started_at: Date | null;
        finished_at: Date | null;
    }>;
    update(id: string, dto: UpdateTaskDto, userId: string): Promise<{
        subtasks: {
            id: string;
            created_at: Date;
            updated_at: Date;
            text: string;
            completed: boolean;
            task_id: string;
        }[];
    } & {
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        tags: string[];
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.Priority;
        estimated_hours: number | null;
        worked_hours: number;
        project_id: string;
        due_date: Date | null;
        expected_value: Prisma.Decimal | null;
        received_value: Prisma.Decimal | null;
        started_at: Date | null;
        finished_at: Date | null;
    }>;
    remove(id: string, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        tags: string[];
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.Priority;
        estimated_hours: number | null;
        worked_hours: number;
        project_id: string;
        due_date: Date | null;
        expected_value: Prisma.Decimal | null;
        received_value: Prisma.Decimal | null;
        started_at: Date | null;
        finished_at: Date | null;
    }>;
}
