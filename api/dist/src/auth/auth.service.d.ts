import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    private readonly refreshTtlDays;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            email: string;
            id: string;
            created_at: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            email: string;
            id: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    refreshSession(rawRefreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            email: string;
            id: string;
            created_at: Date;
        };
    }>;
    logout(rawRefreshToken: string): Promise<void>;
    getProfile(userId: string): Promise<{
        name: string;
        email: string;
        id: string;
        created_at: Date;
    } | null>;
    private generateTokenPair;
    private hashToken;
}
