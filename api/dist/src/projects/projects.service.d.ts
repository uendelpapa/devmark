import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';
export declare class ProjectsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProjectDto, userId: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        notes: string | null;
        client_id: string;
        area: import("@prisma/client").$Enums.ProjectArea;
        specialty: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        project_value: Prisma.Decimal;
        amount_received: Prisma.Decimal;
        amount_pending: Prisma.Decimal;
        estimated_hours: number | null;
        worked_hours: number;
        start_date: Date | null;
        expected_delivery_date: Date | null;
        delivery_date: Date | null;
    }>;
    findAll(params: {
        page?: number;
        limit?: number;
        status?: string;
        priority?: string;
        area?: string;
        client_id?: string;
    }, userId: string): Promise<{
        data: ({
            client: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            created_at: Date;
            updated_at: Date;
            user_id: string;
            status: import("@prisma/client").$Enums.ProjectStatus;
            notes: string | null;
            client_id: string;
            area: import("@prisma/client").$Enums.ProjectArea;
            specialty: string | null;
            priority: import("@prisma/client").$Enums.Priority;
            project_value: Prisma.Decimal;
            amount_received: Prisma.Decimal;
            amount_pending: Prisma.Decimal;
            estimated_hours: number | null;
            worked_hours: number;
            start_date: Date | null;
            expected_delivery_date: Date | null;
            delivery_date: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string): Promise<{
        client: {
            name: string;
            email: string;
            id: string;
        };
        tasks: {
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
        }[];
        payments: {
            id: string;
            created_at: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            notes: string | null;
            project_id: string;
            amount: Prisma.Decimal;
            due_date: Date;
            payment_date: Date | null;
            payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
        }[];
        project_expenses: {
            description: string | null;
            title: string;
            id: string;
            created_at: Date;
            project_id: string;
            category: import("@prisma/client").$Enums.ExpenseCategory;
            value: Prisma.Decimal;
        }[];
        project_tags: {
            name: string;
            id: string;
            project_id: string;
        }[];
    } & {
        description: string | null;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        notes: string | null;
        client_id: string;
        area: import("@prisma/client").$Enums.ProjectArea;
        specialty: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        project_value: Prisma.Decimal;
        amount_received: Prisma.Decimal;
        amount_pending: Prisma.Decimal;
        estimated_hours: number | null;
        worked_hours: number;
        start_date: Date | null;
        expected_delivery_date: Date | null;
        delivery_date: Date | null;
    }>;
    update(id: string, dto: UpdateProjectDto, userId: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        notes: string | null;
        client_id: string;
        area: import("@prisma/client").$Enums.ProjectArea;
        specialty: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        project_value: Prisma.Decimal;
        amount_received: Prisma.Decimal;
        amount_pending: Prisma.Decimal;
        estimated_hours: number | null;
        worked_hours: number;
        start_date: Date | null;
        expected_delivery_date: Date | null;
        delivery_date: Date | null;
    }>;
    remove(id: string, userId: string): Promise<{
        description: string | null;
        name: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        notes: string | null;
        client_id: string;
        area: import("@prisma/client").$Enums.ProjectArea;
        specialty: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        project_value: Prisma.Decimal;
        amount_received: Prisma.Decimal;
        amount_pending: Prisma.Decimal;
        estimated_hours: number | null;
        worked_hours: number;
        start_date: Date | null;
        expected_delivery_date: Date | null;
        delivery_date: Date | null;
    }>;
}
