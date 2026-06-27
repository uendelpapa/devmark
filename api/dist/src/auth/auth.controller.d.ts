import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    private readonly isProduction;
    private readonly refreshTtlMs;
    constructor(authService: AuthService, config: ConfigService);
    register(dto: RegisterDto, res: Response): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
            created_at: Date;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
            created_at: Date;
            updated_at: Date;
        };
        accessToken: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
            created_at: Date;
        };
        accessToken: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    me(req: Request): Promise<{
        name: string;
        email: string;
        id: string;
        created_at: Date;
    } | null>;
    updateProfile(req: Request, dto: UpdateProfileDto): Promise<{
        name: string;
        email: string;
        id: string;
        created_at: Date;
    } | null>;
    private setRefreshCookie;
}
