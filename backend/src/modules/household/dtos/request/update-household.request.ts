import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { HOUSEHOLD_NAME_MAX_LENGTH } from '../../constants/household.constants.js';

export class UpdateHouseholdRequest {
  @ApiPropertyOptional({ example: 'Družina Novak' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(HOUSEHOLD_NAME_MAX_LENGTH)
  name?: string;
}
