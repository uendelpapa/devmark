import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
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
