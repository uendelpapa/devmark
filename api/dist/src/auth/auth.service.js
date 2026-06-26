"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.refreshTtlDays = Number(this.config.get('JWT_REFRESH_TTL_DAYS', '7'));
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Um usuário com este e-mail já existe');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password_hash: passwordHash,
            },
            select: { id: true, name: true, email: true, created_at: true },
        });
        const tokens = await this.generateTokenPair(user.id, user.email);
        return { user, ...tokens };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        await this.prisma.refreshToken.updateMany({
            where: { user_id: user.id, revoked: false },
            data: { revoked: true },
        });
        const tokens = await this.generateTokenPair(user.id, user.email);
        const { password_hash, ...safeUser } = user;
        return { user: safeUser, ...tokens };
    }
    async refreshSession(rawRefreshToken) {
        const tokenHash = this.hashToken(rawRefreshToken);
        const storedToken = await this.prisma.refreshToken.findFirst({
            where: { token_hash: tokenHash },
            include: {
                user: {
                    select: { id: true, name: true, email: true, created_at: true },
                },
            },
        });
        if (!storedToken) {
            throw new common_1.UnauthorizedException('Refresh token inválido');
        }
        if (storedToken.revoked) {
            await this.prisma.refreshToken.updateMany({
                where: { user_id: storedToken.user_id, revoked: false },
                data: { revoked: true },
            });
            throw new common_1.UnauthorizedException('Refresh token já utilizado — sessão revogada por segurança');
        }
        if (storedToken.expires_at < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token expirado');
        }
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true },
        });
        const tokens = await this.generateTokenPair(storedToken.user.id, storedToken.user.email);
        return { user: storedToken.user, ...tokens };
    }
    async logout(rawRefreshToken) {
        if (!rawRefreshToken)
            return;
        const tokenHash = this.hashToken(rawRefreshToken);
        await this.prisma.refreshToken.updateMany({
            where: { token_hash: tokenHash, revoked: false },
            data: { revoked: true },
        });
    }
    async getProfile(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, created_at: true },
        });
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        const updateData = {};
        if (dto.name)
            updateData.name = dto.name;
        if (dto.email && dto.email !== user.email) {
            const emailExists = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (emailExists)
                throw new common_1.ConflictException('Este e-mail já está em uso');
            updateData.email = dto.email;
        }
        if (dto.newPassword) {
            if (!dto.currentPassword) {
                throw new common_1.UnauthorizedException('A senha atual é necessária para alterar a senha');
            }
            const passwordValid = await bcrypt.compare(dto.currentPassword, user.password_hash);
            if (!passwordValid) {
                throw new common_1.UnauthorizedException('A senha atual está incorreta');
            }
            updateData.password_hash = await bcrypt.hash(dto.newPassword, 12);
        }
        if (Object.keys(updateData).length === 0) {
            return this.getProfile(userId);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, created_at: true },
        });
        return updatedUser;
    }
    async generateTokenPair(userId, email) {
        const accessToken = this.jwt.sign({ sub: userId, email }, { expiresIn: this.config.get('JWT_ACCESS_TTL', '15m') });
        const rawRefreshToken = (0, crypto_1.randomBytes)(64).toString('hex');
        const tokenHash = this.hashToken(rawRefreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.refreshTtlDays);
        await this.prisma.refreshToken.create({
            data: {
                user_id: userId,
                token_hash: tokenHash,
                expires_at: expiresAt,
            },
        });
        return { accessToken, refreshToken: rawRefreshToken };
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map