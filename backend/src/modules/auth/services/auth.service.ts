import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UserEntity } from '../../../../libs/db/entities/index.js';
import { AuthRepository } from '../repository/auth.repository.js';
import { BCRYPT_SALT_ROUNDS } from '../constants/auth.constants.js';
import type { JwtPayload } from '../interfaces/index.js';
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthSessionResponse,
  AuthUserResponse,
} from '../dtos/index.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, password }: AuthRegisterRequest): Promise<AuthSessionResponse> {
    const existing = await this.authRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await this.authRepository.create({ name, email, password: passwordHash });

    return this.createSession(user);
  }

  async login({ email, password }: AuthLoginRequest): Promise<AuthSessionResponse> {
    const user = await this.authRepository.findByEmail(email);

    const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createSession(user);
  }

  async getMe(userId: string): Promise<AuthUserResponse> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return this.toUserResponse(user);
  }

  private async createSession(user: UserEntity): Promise<AuthSessionResponse> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user: this.toUserResponse(user) };
  }

  private toUserResponse({ id, email, name }: UserEntity): AuthUserResponse {
    return { id, email, name };
  }
}
