import type { FoodUnit } from '#lib/features/food-item/index.js';

export type ShoppingItemSource = 'MEAL_PLAN' | 'MANUAL';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: FoodUnit;
  completed: boolean;
  source: ShoppingItemSource;
}

export interface CreateShoppingItemPayload {
  name: string;
  quantity: number;
  unit: FoodUnit;
}

export type UpdateShoppingItemPayload = Partial<CreateShoppingItemPayload> & {
  completed?: boolean;
};
