import { ApiProperty } from '@nestjs/swagger';
import { FoodUnit } from '../../../../utils/types/food-unit.type.js';

export class ShoppingItemResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'Moka' })
  name!: string;

  @ApiProperty({ example: 150 })
  quantity!: number;

  @ApiProperty({ enum: FoodUnit, example: FoodUnit.Gram })
  unit!: FoodUnit;

  @ApiProperty({ example: false, description: 'Ali je živilo kupljeno' })
  completed!: boolean;
}
