import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsIn } from 'class-validator';
import { HouseholdRole } from '../../../../utils/types/household-role.type.js';
import { INVITABLE_ROLES } from '../../constants/household-invitation.constants.js';
import { normalizeEmail } from '../../../auth/dtos/request/auth.transforms.js';

export class CreateHouseholdInvitationRequest {
  @ApiProperty({ example: 'janez@example.com' })
  @Transform(normalizeEmail)
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: INVITABLE_ROLES, example: HouseholdRole.Member })
  @IsIn(INVITABLE_ROLES)
  role!: (typeof INVITABLE_ROLES)[number];
}
