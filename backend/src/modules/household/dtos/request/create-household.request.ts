import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { HOUSEHOLD_NAME_MAX_LENGTH } from '../../constants/household.constants.js';

export class CreateHouseholdRequest {
  @ApiProperty({ example: 'Družina Novak' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(HOUSEHOLD_NAME_MAX_LENGTH)
  name!: string;
}
