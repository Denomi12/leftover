import { ApiProperty } from '@nestjs/swagger';

export class InvitationUserResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'Janez Novak' })
  name!: string;

  @ApiProperty({ example: 'janez@example.com' })
  email!: string;
}
