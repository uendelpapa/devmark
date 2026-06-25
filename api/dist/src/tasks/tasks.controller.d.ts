import { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(dto: CreateTaskDto, req: Request): Promise<{
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
        expected_value: import("@prisma/client/runtime/library").Decimal | null;
        received_value: import("@prisma/client/runtime/library").Decimal | null;
        started_at: Date | null;
        finished_at: Date | null;
    }>;
    findAll(page?: number, limit?: number, project_id?: string, status?: string, req?: Request): Promise<{
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
            expected_value: import("@prisma/client/runtime/library").Decimal | null;
            received_value: import("@prisma/client/runtime/library").Decimal | null;
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
    findOne(id: string, req: Request): Promise<{
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
            value: import("@prisma/client/runtime/library").Decimal;
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
        expected_value: import("@prisma/client/runtime/library").Decimal | null;
        received_value: import("@prisma/client/runtime/library").Decimal | null;
        started_at: Date | null;
        finished_at: Date | null;
    }>;
    update(id: string, dto: UpdateTaskDto, req: Request): Promise<{
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
        expected_value: import("@prisma/client/runtime/library").Decimal | null;
        received_value: import("@prisma/client/runtime/library").Decimal | null;
        started_at: Date | null;
        finished_at: Date | null;
    }>;
    remove(id: string, req: Request): Promise<{
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
        expected_value: import("@prisma/client/runtime/library").Decimal | null;
        received_value: import("@prisma/client/runtime/library").Decimal | null;
        started_at: Date | null;
        finished_at: Date | null;
    }>;
}
