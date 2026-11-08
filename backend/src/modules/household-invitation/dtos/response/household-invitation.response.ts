import { ApiProperty } from '@nestjs/swagger';
import { HouseholdInvitationStatus } from '../../../../utils/types/household-invitation-status.type.js';
import { HouseholdRole } from '../../../../utils/types/household-role.type.js';
import { InvitationUserResponse } from './invitation-user.response.js';

export class HouseholdInvitationResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ enum: HouseholdRole, example: HouseholdRole.Member })
  role!: HouseholdRole;

  @ApiProperty({ enum: HouseholdInvitationStatus, example: HouseholdInvitationStatus.Pending })
  status!: HouseholdInvitationStatus;

  @ApiProperty({ type: InvitationUserResponse })
  invitedUser!: InvitationUserResponse;

  @ApiProperty()
  createdAt!: Date;
}
