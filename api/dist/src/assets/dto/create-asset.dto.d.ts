declare enum AssetType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    PDF = "PDF",
    DOCUMENT = "DOCUMENT",
    SPREADSHEET = "SPREADSHEET",
    DESIGN = "DESIGN",
    OTHER = "OTHER"
}
export declare class CreateAssetDto {
    project_id: string;
    task_id?: string;
    name: string;
    type: AssetType;
    url: string;
    size?: number;
}
export {};
