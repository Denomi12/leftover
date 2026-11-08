import { ApiProperty } from '@nestjs/swagger';

export class HouseholdResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'Družina Novak' })
  name!: string;

  @ApiProperty()
  createdAt!: Date;
}
