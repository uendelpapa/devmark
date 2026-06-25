import { Request } from 'express';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
export declare class TimeEntriesController {
    private readonly timeEntriesService;
    constructor(timeEntriesService: TimeEntriesService);
    create(dto: CreateTimeEntryDto, req: Request): Promise<{
        description: string | null;
        id: string;
        created_at: Date;
        project_id: string;
        task_id: string;
        start_time: Date;
        end_time: Date | null;
        duration: number | null;
    }>;
    findAll(project_id?: string, task_id?: string, req?: Request): Promise<({
        task: {
            title: string;
            id: string;
        };
    } & {
        description: string | null;
        id: string;
        created_at: Date;
        project_id: string;
        task_id: string;
        start_time: Date;
        end_time: Date | null;
        duration: number | null;
    })[]>;
    stopTimer(id: string, dto: UpdateTimeEntryDto, req: Request): Promise<{
        description: string | null;
        id: string;
        created_at: Date;
        project_id: string;
        task_id: string;
        start_time: Date;
        end_time: Date | null;
        duration: number | null;
    }>;
    remove(id: string, req: Request): Promise<{
        description: string | null;
        id: string;
        created_at: Date;
        project_id: string;
        task_id: string;
        start_time: Date;
        end_time: Date | null;
        duration: number | null;
    }>;
}
