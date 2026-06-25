import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
export declare class TagsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTagDto): Promise<{
        name: string;
        id: string;
        project_id: string;
    }>;
    findAll(project_id?: string): Promise<{
        name: string;
        id: string;
        project_id: string;
    }[]>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        project_id: string;
    }>;
}
