import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private readonly refreshTtlDays: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.refreshTtlDays = Number(this.config.get('JWT_REFRESH_TTL_DAYS', '7'));
  }

  // ─── Register ────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const inviteCode = await this.prisma.inviteCode.findUnique({
      where: { code: dto.accessKey },
    });

    if (!inviteCode || inviteCode.used_at) {
      throw new UnauthorizedException('Chave de acesso inválida ou já utilizada');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Um usuário com este e-mail já existe');
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

    await this.prisma.inviteCode.update({
      where: { id: inviteCode.id },
      data: { used_at: new Date() },
    });

    const tokens = await this.generateTokenPair(user.id, user.email);

    return { user, ...tokens };
  }

  // ─── Login ───────────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Revoke all previous refresh tokens for this user (single-session enforcement)
    await this.prisma.refreshToken.updateMany({
      where: { user_id: user.id, revoked: false },
      data: { revoked: true },
    });

    const tokens = await this.generateTokenPair(user.id, user.email);

    const { password_hash, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  // ─── Refresh Session ────────────────────────────────────────────────────────

  async refreshSession(rawRefreshToken: string) {
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
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (storedToken.revoked) {
      // Possible token theft detected: revoke ALL tokens for this user
      await this.prisma.refreshToken.updateMany({
        where: { user_id: storedToken.user_id, revoked: false },
        data: { revoked: true },
      });
      throw new UnauthorizedException('Refresh token já utilizado — sessão revogada por segurança');
    }

    if (storedToken.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    // Revoke the old refresh token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // Generate new pair
    const tokens = await this.generateTokenPair(
      storedToken.user.id,
      storedToken.user.email,
    );

    return { user: storedToken.user, ...tokens };
  }

  // ─── Logout ──────────────────────────────────────────────────────────────────

  async logout(rawRefreshToken: string) {
    if (!rawRefreshToken) return;

    const tokenHash = this.hashToken(rawRefreshToken);

    await this.prisma.refreshToken.updateMany({
      where: { token_hash: tokenHash, revoked: false },
      data: { revoked: true },
    });
  }

  // ─── Get Profile ─────────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, created_at: true },
    });
  }

  // ─── Update Profile ──────────────────────────────────────────────────────────

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const updateData: any = {};

    if (dto.name) updateData.name = dto.name;
    
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (emailExists) throw new ConflictException('Este e-mail já está em uso');
      updateData.email = dto.email;
    }

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new UnauthorizedException('A senha atual é necessária para alterar a senha');
      }
      const passwordValid = await bcrypt.compare(dto.currentPassword, user.password_hash);
      if (!passwordValid) {
        throw new UnauthorizedException('A senha atual está incorreta');
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

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private async generateTokenPair(userId: string, email: string) {
    // Generate access token
    const accessToken = this.jwt.sign(
      { sub: userId, email },
      { expiresIn: this.config.get('JWT_ACCESS_TTL', '15m') } as any,
    );

    // Generate refresh token (opaque random string)
    const rawRefreshToken = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.refreshTtlDays);

    // Store hashed refresh token in DB
    await this.prisma.refreshToken.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
