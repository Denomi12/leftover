import type { FoodUnit } from '#lib/features/food-item/index.js';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: FoodUnit;
  completed: boolean;
}
