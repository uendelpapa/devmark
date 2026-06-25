import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
export declare class TimeEntriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTimeEntryDto, userId: string): Promise<{
        description: string | null;
        id: string;
        created_at: Date;
        project_id: string;
        task_id: string;
        start_time: Date;
        end_time: Date | null;
        duration: number | null;
    }>;
    findAll(params: {
        project_id?: string;
        task_id?: string;
    }, userId: string): Promise<({
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
    stopTimer(id: string, dto: UpdateTimeEntryDto, userId: string): Promise<{
        description: string | null;
        id: string;
        created_at: Date;
        project_id: string;
        task_id: string;
        start_time: Date;
        end_time: Date | null;
        duration: number | null;
    }>;
    remove(id: string, userId: string): Promise<{
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
