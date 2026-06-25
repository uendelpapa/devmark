import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(dto: CreatePaymentDto, req: Request): Promise<{
        id: string;
        created_at: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        project_id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        due_date: Date;
        payment_date: Date | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
    }>;
    findAll(page?: number, limit?: number, project_id?: string, status?: string, req?: Request): Promise<{
        data: ({
            project: {
                name: string;
                id: string;
                client_id: string;
            };
        } & {
            id: string;
            created_at: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            notes: string | null;
            project_id: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            due_date: Date;
            payment_date: Date | null;
            payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
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
    } & {
        id: string;
        created_at: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        project_id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        due_date: Date;
        payment_date: Date | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
    }>;
    update(id: string, dto: UpdatePaymentDto, req: Request): Promise<{
        id: string;
        created_at: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        project_id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        due_date: Date;
        payment_date: Date | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
    }>;
    remove(id: string, req: Request): Promise<{
        id: string;
        created_at: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        project_id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        due_date: Date;
        payment_date: Date | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
    }>;
}
