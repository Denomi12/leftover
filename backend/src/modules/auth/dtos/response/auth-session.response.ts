import { ApiProperty } from '@nestjs/swagger';
import { AuthUserResponse } from './auth-user.response.js';

export class AuthSessionResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ type: AuthUserResponse })
  user!: AuthUserResponse;
}
