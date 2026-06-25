import { SubtaskDto } from './subtask.dto';
declare enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
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
export declare class CreateTaskDto {
    project_id: string;
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    estimated_hours?: number;
    expected_value?: number;
    received_value?: number;
    due_date?: string;
    tags?: string[];
    subtasks?: SubtaskDto[];
}
export {};
