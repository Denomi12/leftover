import type { FoodUnit } from '#lib/features/food-item/index.js';

export type IngredientStockStatus = 'IN_STOCK' | 'MISSING';

export interface MealIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: FoodUnit;
  stockStatus: IngredientStockStatus;
  missingQuantity: number;
}

export interface PlannedMeal {
  id: string;
  name: string;
  date: string;
  completed: boolean;
  ingredients: MealIngredient[];
}

export interface CreatePlannedMealPayload {
  name: string;
  date: string;
  ingredients: { name: string; quantity: number; unit: FoodUnit }[];
}
