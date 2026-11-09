import { api } from '#lib/shared/lib/api.js';
import type { ShoppingItem } from '../types/shopping-item.js';

const shoppingItemsPath = (householdId: string) => `/households/${householdId}/shopping-items`;

export const shoppingItemApi = {
  list: (householdId: string, fetchFn?: typeof fetch) =>
    api<ShoppingItem[]>(shoppingItemsPath(householdId), { fetch: fetchFn }),
  setCompleted: (householdId: string, shoppingItemId: string, completed: boolean) =>
    api<ShoppingItem>(`${shoppingItemsPath(householdId)}/${shoppingItemId}`, {
      method: 'PATCH',
      body: { completed },
    }),
};
