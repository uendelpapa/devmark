import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
export declare class AssetsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateAssetDto, userId: string): Promise<{
        type: import("@prisma/client").$Enums.AssetType;
        name: string;
        id: string;
        created_at: Date;
        project_id: string;
        task_id: string | null;
        url: string;
        size: number | null;
    }>;
    findAll(params: {
        page?: number;
        limit?: number;
        project_id?: string;
        task_id?: string;
    }, userId: string): Promise<{
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
    remove(id: string, userId: string): Promise<{
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
