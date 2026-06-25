import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateEventDto, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        user_id: string;
        start_date: Date;
        project_id: string | null;
        end_date: Date;
    }>;
    findAll(params: {
        project_id?: string;
        start?: string;
        end?: string;
    }, userId: string): Promise<({
        project: {
            name: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        user_id: string;
        start_date: Date;
        project_id: string | null;
        end_date: Date;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        project: {
            name: string;
            id: string;
        } | null;
    } & {
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        user_id: string;
        start_date: Date;
        project_id: string | null;
        end_date: Date;
    }>;
    update(id: string, dto: UpdateEventDto, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        user_id: string;
        start_date: Date;
        project_id: string | null;
        end_date: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        user_id: string;
        start_date: Date;
        project_id: string | null;
        end_date: Date;
    }>;
}
