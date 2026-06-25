declare enum ExpenseCategory {
    AI = "AI",
    SOFTWARE = "SOFTWARE",
    DOMAIN = "DOMAIN",
    HOSTING = "HOSTING",
    DESIGN = "DESIGN",
    ADS = "ADS",
    FREELANCER = "FREELANCER",
    OTHER = "OTHER"
}
export declare class CreateTaskExpenseDto {
    task_id: string;
    title: string;
    description?: string;
    category: ExpenseCategory;
    value: number;
}
export {};
