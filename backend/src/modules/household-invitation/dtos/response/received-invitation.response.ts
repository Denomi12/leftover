import { ApiProperty } from '@nestjs/swagger';
import { HouseholdRole } from '../../../../utils/types/household-role.type.js';
import { InvitationUserResponse } from './invitation-user.response.js';

export class InvitationHouseholdResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'Stanovanje Kotnikova' })
  name!: string;
}

export class ReceivedInvitationResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ enum: HouseholdRole, example: HouseholdRole.Member })
  role!: HouseholdRole;

  @ApiProperty({ type: InvitationHouseholdResponse })
  household!: InvitationHouseholdResponse;

  @ApiProperty({ type: InvitationUserResponse })
  invitedBy!: InvitationUserResponse;

  @ApiProperty()
  createdAt!: Date;
}
