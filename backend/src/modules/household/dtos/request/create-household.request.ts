import { ApiProperty } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  HOUSEHOLD_NAME_MAX_LENGTH,
  HOUSEHOLD_NAME_MIN_LENGTH,
} from '../../constants/household.constants.js';

const trim = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateHouseholdRequest {
  @ApiProperty({
    example: 'Stanovanje Kotnikova',
    minLength: HOUSEHOLD_NAME_MIN_LENGTH,
    maxLength: HOUSEHOLD_NAME_MAX_LENGTH,
  })
  @Transform(trim)
  @IsString()
  @MinLength(HOUSEHOLD_NAME_MIN_LENGTH)
  @MaxLength(HOUSEHOLD_NAME_MAX_LENGTH)
  name!: string;
}
