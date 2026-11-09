import { api } from '#lib/shared/lib/api.js';
import type { CreateFoodItemPayload, FoodItem } from '../types/food-item.js';

export const foodItemApi = {
  list: (householdId: string, fetchFn?: typeof fetch) =>
    api<FoodItem[]>(`/households/${householdId}/food-items`, { fetch: fetchFn }),
  create: (householdId: string, body: CreateFoodItemPayload) =>
    api<FoodItem>(`/households/${householdId}/food-items`, { method: 'POST', body }),
};
