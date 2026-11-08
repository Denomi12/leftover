import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service.js';
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthSessionResponse,
  AuthUserResponse,
} from '../dtos/index.js';
import type { JwtPayload } from '../interfaces/index.js';
import { JwtAuthGuard } from '../../../utils/guards/index.js';
import { User } from '../../../utils/decorators/index.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: AuthSessionResponse })
  @ApiConflictResponse({ description: 'Email is already registered' })
  register(@Body() body: AuthRegisterRequest): Promise<AuthSessionResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthSessionResponse })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  login(@Body() body: AuthLoginRequest): Promise<AuthSessionResponse> {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AuthUserResponse })
  me(@User() user: JwtPayload): Promise<AuthUserResponse> {
    return this.authService.getMe(user.sub);
  }
}
