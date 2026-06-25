declare enum ClientStatus {
    LEAD = "LEAD",
    NEGOTIATING = "NEGOTIATING",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    LOST = "LOST"
}
declare enum CommunicationType {
    WHATSAPP = "WHATSAPP",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    MEETING = "MEETING"
}
declare enum PaymentMethod {
    PIX = "PIX",
    BANK_TRANSFER = "BANK_TRANSFER",
    CREDIT_CARD = "CREDIT_CARD",
    CASH = "CASH"
}
export declare class CreateClientDto {
    name: string;
    email: string;
    company_name?: string;
    document?: string;
    phone?: string;
    website?: string;
    instagram?: string;
    linkedin?: string;
    industry?: string;
    source?: string;
    status?: ClientStatus;
    preferred_communication?: CommunicationType;
    preferred_payment_method?: PaymentMethod;
    notes?: string;
}
export {};
