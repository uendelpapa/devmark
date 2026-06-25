import { Request } from 'express';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
export declare class AssetsController {
    private readonly assetsService;
    constructor(assetsService: AssetsService);
    create(dto: CreateAssetDto, req: Request): Promise<{
        type: import("@prisma/client").$Enums.AssetType;
        name: string;
        id: string;
        created_at: Date;
        project_id: string;
        task_id: string | null;
        url: string;
        size: number | null;
    }>;
    findAll(page?: number, limit?: number, project_id?: string, task_id?: string, req?: Request): Promise<{
        data: {
            type: import("@prisma/client").$Enums.AssetType;
            name: string;
            id: string;
            created_at: Date;
            project_id: string;
            task_id: string | null;
            url: string;
            size: number | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    remove(id: string, req: Request): Promise<{
        type: import("@prisma/client").$Enums.AssetType;
        name: string;
        id: string;
        created_at: Date;
        project_id: string;
        task_id: string | null;
        url: string;
        size: number | null;
    }>;
}
