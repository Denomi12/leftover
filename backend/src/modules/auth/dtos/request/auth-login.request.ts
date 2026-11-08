import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { normalizeEmail } from './auth.transforms.js';

export class AuthLoginRequest {
  @ApiProperty({ example: 'janez@example.com' })
  @Transform(normalizeEmail)
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'supersecret' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
