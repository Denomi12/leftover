import { ApiProperty } from '@nestjs/swagger';
import { FoodUnit } from '../../../../utils/types/food-unit.type.js';
import { IngredientStockStatus } from '../../../../utils/types/ingredient-stock-status.type.js';

export class MealIngredientResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'Moka' })
  name!: string;

  @ApiProperty({ example: 200 })
  quantity!: number;

  @ApiProperty({ enum: FoodUnit, example: FoodUnit.Gram })
  unit!: FoodUnit;

  @ApiProperty({
    enum: IngredientStockStatus,
    example: IngredientStockStatus.Missing,
    description: `${IngredientStockStatus.InStock}: v zalogi je vsaj potrebna količina, ${IngredientStockStatus.Missing}: v zalogi je premalo`,
  })
  stockStatus!: IngredientStockStatus;

  @ApiProperty({
    example: 50,
    description: 'Manjkajoča količina v enoti sestavine, 0 pri sestavini na zalogi',
  })
  missingQuantity!: number;
}
