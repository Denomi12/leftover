import { ApiProperty } from '@nestjs/swagger';
import { ExpirationStatus } from '../../../../utils/types/expiration-status.type.js';
import { FoodCategory } from '../../../../utils/types/food-category.type.js';
import { FoodUnit } from '../../../../utils/types/food-unit.type.js';
import { EXPIRING_SOON_DAYS } from '../../constants/food-item.constants.js';

export class FoodItemResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'Jogurt' })
  name!: string;

  @ApiProperty({ example: 1.5 })
  quantity!: number;

  @ApiProperty({ enum: FoodUnit, example: FoodUnit.Piece })
  unit!: FoodUnit;

  @ApiProperty({ enum: FoodCategory, example: FoodCategory.Dairy })
  category!: FoodCategory;

  @ApiProperty({ type: String, format: 'date', nullable: true, example: '2026-11-20' })
  expirationDate!: string | null;

  @ApiProperty({
    enum: ExpirationStatus,
    nullable: true,
    example: ExpirationStatus.ExpiringSoon,
    description: `${ExpirationStatus.Expired}: rok pred današnjim dnem, ${ExpirationStatus.ExpiringSoon}: rok danes ali v naslednjih ${EXPIRING_SOON_DAYS} dneh, ${ExpirationStatus.Fresh}: kasnejši rok, null: brez roka`,
  })
  expirationStatus!: ExpirationStatus | null;
}
