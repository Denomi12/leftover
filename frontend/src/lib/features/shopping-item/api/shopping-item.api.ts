import { api } from '#lib/shared/lib/api.js';
import type {
  CreateShoppingItemPayload,
  ShoppingItem,
  UpdateShoppingItemPayload,
} from '../types/shopping-item.js';

const shoppingItemsPath = (householdId: string) => `/households/${householdId}/shopping-items`;

export const shoppingItemApi = {
  list: (householdId: string, fetchFn?: typeof fetch) =>
    api<ShoppingItem[]>(shoppingItemsPath(householdId), { fetch: fetchFn }),
  create: (householdId: string, body: CreateShoppingItemPayload) =>
    api<ShoppingItem>(shoppingItemsPath(householdId), { method: 'POST', body }),
  update: (householdId: string, shoppingItemId: string, body: UpdateShoppingItemPayload) =>
    api<ShoppingItem>(`${shoppingItemsPath(householdId)}/${shoppingItemId}`, {
      method: 'PATCH',
      body,
    }),
  remove: (householdId: string, shoppingItemId: string) =>
    api<void>(`${shoppingItemsPath(householdId)}/${shoppingItemId}`, { method: 'DELETE' }),
};
