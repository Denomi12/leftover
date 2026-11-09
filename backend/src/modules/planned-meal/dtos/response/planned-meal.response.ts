import { ApiProperty } from '@nestjs/swagger';
import { MealIngredientResponse } from './meal-ingredient.response.js';

export class PlannedMealResponse {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id!: string;

  @ApiProperty({ example: 'Palačinke' })
  name!: string;

  @ApiProperty({ type: String, format: 'date', example: '2026-11-20' })
  date!: string;

  @ApiProperty({ example: false })
  completed!: boolean;

  @ApiProperty({ type: MealIngredientResponse, isArray: true })
  ingredients!: MealIngredientResponse[];
}
