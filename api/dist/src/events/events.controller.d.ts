import { Request } from 'express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(dto: CreateEventDto, req: Request): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        user_id: string;
        start_date: Date;
        project_id: string | null;
        end_date: Date;
    }>;
    findAll(project_id?: string, start?: string, end?: string, req?: Request): Promise<({
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
    findOne(id: string, req: Request): Promise<{
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
    update(id: string, dto: UpdateEventDto, req: Request): Promise<{
        description: string | null;
        title: string;
        id: string;
        created_at: Date;
        user_id: string;
        start_date: Date;
        project_id: string | null;
        end_date: Date;
    }>;
    remove(id: string, req: Request): Promise<{
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
