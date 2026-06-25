declare enum PaymentMethod {
    PIX = "PIX",
    BANK_TRANSFER = "BANK_TRANSFER",
    CREDIT_CARD = "CREDIT_CARD",
    CASH = "CASH"
}
declare enum PaymentStatus {
    PENDING = "PENDING",
    OVERDUE = "OVERDUE",
    PAID = "PAID",
    CANCELED = "CANCELED"
}
export declare class CreatePaymentDto {
    project_id: string;
    amount: number;
    due_date: string;
    payment_date?: string;
    payment_method?: PaymentMethod;
    status?: PaymentStatus;
    notes?: string;
}
export {};
