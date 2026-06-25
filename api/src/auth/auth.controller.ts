import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly isProduction: boolean;
  private readonly refreshTtlMs: number;

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.isProduction = config.get('NODE_ENV') === 'production';
    const days = Number(config.get('JWT_REFRESH_TTL_DAYS', '7'));
    this.refreshTtlMs = days * 24 * 60 * 60 * 1000;
  }

  // ─── Register ──────────────────────────────────────────────────────────────

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(dto);

    this.setRefreshCookie(res, refreshToken);

    return { user, accessToken };
  }

  // ─── Login ─────────────────────────────────────────────────────────────────

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login com email e senha' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(dto);

    this.setRefreshCookie(res, refreshToken);

    return { user, accessToken };
  }

  // ─── Refresh ───────────────────────────────────────────────────────────────

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar sessão com refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.['refresh_token'];

    if (!oldRefreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    const { user, accessToken, refreshToken } =
      await this.authService.refreshSession(oldRefreshToken);

    this.setRefreshCookie(res, refreshToken);

    return { user, accessToken };
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encerrar sessão' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refresh_token'];
    await this.authService.logout(refreshToken);

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/api/auth',
    });

    return { message: 'Logout realizado com sucesso' };
  }

  // ─── Me ────────────────────────────────────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  async me(@Req() req: Request) {
    return this.authService.getProfile((req.user as any).id);
  }

  // ─── Cookie Helper ─────────────────────────────────────────────────────────

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: this.refreshTtlMs,
    });
  }
}
