declare enum ProjectArea {
    MARKETING = "MARKETING",
    DEVELOPER = "DEVELOPER"
}
declare enum ProjectStatus {
    PLANNING = "PLANNING",
    IN_PROGRESS = "IN_PROGRESS",
    WAITING_CLIENT = "WAITING_CLIENT",
    REVIEW = "REVIEW",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED"
}
declare enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class CreateProjectDto {
    client_id: string;
    name: string;
    description?: string;
    area: ProjectArea;
    specialty?: string;
    status?: ProjectStatus;
    priority?: Priority;
    project_value?: number;
    amount_received?: number;
    estimated_hours?: number;
    start_date?: string;
    expected_delivery_date?: string;
    notes?: string;
}
export {};
