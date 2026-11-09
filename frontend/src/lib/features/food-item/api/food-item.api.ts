import { api } from '#lib/shared/lib/api.js';
import { foodItemSearchParams } from '../lib/food-item-query.js';
import type {
  CreateFoodItemPayload,
  FoodItem,
  FoodItemQuery,
  UpdateFoodItemPayload,
} from '../types/food-item.js';

const foodItemsPath = (householdId: string) => `/households/${householdId}/food-items`;

export const foodItemApi = {
  list: (householdId: string, query: Partial<FoodItemQuery> = {}, fetchFn?: typeof fetch) => {
    const params = foodItemSearchParams(query).toString();
    return api<FoodItem[]>(`${foodItemsPath(householdId)}${params ? `?${params}` : ''}`, {
      fetch: fetchFn,
    });
  },
  create: (householdId: string, body: CreateFoodItemPayload) =>
    api<FoodItem>(foodItemsPath(householdId), { method: 'POST', body }),
  update: (householdId: string, foodItemId: string, body: UpdateFoodItemPayload) =>
    api<FoodItem>(`${foodItemsPath(householdId)}/${foodItemId}`, { method: 'PATCH', body }),
  remove: (householdId: string, foodItemId: string) =>
    api<null>(`${foodItemsPath(householdId)}/${foodItemId}`, { method: 'DELETE' }),
};
