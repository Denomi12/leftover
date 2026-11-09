import { api } from '#lib/shared/lib/api.js';
import type { CreateFoodItemPayload, FoodItem, UpdateFoodItemPayload } from '../types/food-item.js';

const foodItemsPath = (householdId: string) => `/households/${householdId}/food-items`;

export const foodItemApi = {
  list: (householdId: string, fetchFn?: typeof fetch) =>
    api<FoodItem[]>(foodItemsPath(householdId), { fetch: fetchFn }),
  create: (householdId: string, body: CreateFoodItemPayload) =>
    api<FoodItem>(foodItemsPath(householdId), { method: 'POST', body }),
  update: (householdId: string, foodItemId: string, body: UpdateFoodItemPayload) =>
    api<FoodItem>(`${foodItemsPath(householdId)}/${foodItemId}`, { method: 'PATCH', body }),
  remove: (householdId: string, foodItemId: string) =>
    api<null>(`${foodItemsPath(householdId)}/${foodItemId}`, { method: 'DELETE' }),
};
