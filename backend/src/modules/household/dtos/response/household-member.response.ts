import { ApiProperty } from '@nestjs/swagger';
import { HouseholdRole } from '../../../../utils/types/household-role.type.js';

export class HouseholdMemberUserResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'Janez Novak' })
  name!: string;

  @ApiProperty({ example: 'janez@example.com' })
  email!: string;
}

export class HouseholdMemberResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ enum: HouseholdRole, example: HouseholdRole.Member })
  role!: HouseholdRole;

  @ApiProperty({ type: HouseholdMemberUserResponse })
  user!: HouseholdMemberUserResponse;
}
