import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateShoppingItemRequest {
  @ApiProperty({ example: true, description: 'Ali je živilo kupljeno' })
  @IsBoolean()
  completed!: boolean;
}
