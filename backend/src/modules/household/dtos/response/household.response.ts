import { ApiProperty } from '@nestjs/swagger';
import { HouseholdRole } from '../../../../utils/types/household-role.type.js';

export class HouseholdResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'Stanovanje Kotnikova' })
  name!: string;

  @ApiProperty({ enum: HouseholdRole, example: HouseholdRole.Owner })
  role!: HouseholdRole;

  @ApiProperty({ example: 3 })
  memberCount!: number;

  @ApiProperty()
  createdAt!: Date;
}
