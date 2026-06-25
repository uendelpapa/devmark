import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Prisma } from '@prisma/client';
export declare class PaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePaymentDto, userId: string): Promise<{
        id: string;
        created_at: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        project_id: string;
        amount: Prisma.Decimal;
        due_date: Date;
        payment_date: Date | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
    }>;
    findAll(params: {
        page?: number;
        limit?: number;
        project_id?: string;
        status?: string;
    }, userId: string): Promise<{
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
            amount: Prisma.Decimal;
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
    findOne(id: string, userId: string): Promise<{
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
        amount: Prisma.Decimal;
        due_date: Date;
        payment_date: Date | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
    }>;
    update(id: string, dto: UpdatePaymentDto, userId: string): Promise<{
        id: string;
        created_at: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        project_id: string;
        amount: Prisma.Decimal;
        due_date: Date;
        payment_date: Date | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        created_at: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        project_id: string;
        amount: Prisma.Decimal;
        due_date: Date;
        payment_date: Date | null;
        payment_method: import("@prisma/client").$Enums.PaymentMethod | null;
    }>;
    private updateProjectReceivedAmount;
}
