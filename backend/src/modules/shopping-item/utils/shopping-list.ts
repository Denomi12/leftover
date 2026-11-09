import { FOOD_ITEM_QUANTITY_MAX } from '../../food-item/constants/food-item.constants.js';
import {
  buildStock,
  fromBaseThousandths,
  type StockAmount,
  stockKey,
  toBaseThousandths,
} from '../../planned-meal/utils/stock.js';

export interface PendingShoppingItem extends StockAmount {
  id: string;
}

export interface ShoppingListChanges {
  updates: { id: string; quantity: string }[];
  additions: StockAmount[];
}

export function planMissingIngredients(
  ingredients: StockAmount[],
  stockItems: StockAmount[],
  pendingItems: PendingShoppingItem[],
): ShoppingListChanges {
  const required = new Map<string, { base: number; ingredient: StockAmount }>();
  for (const ingredient of ingredients) {
    const key = stockKey(ingredient.name, ingredient.unit);
    const base = toBaseThousandths(ingredient.quantity, ingredient.unit);
    const entry = required.get(key);
    if (entry) {
      entry.base += base;
    } else {
      required.set(key, { base, ingredient });
    }
  }

  const stock = buildStock(stockItems);
  const pending = buildStock(pendingItems);
  const pendingByKey = new Map<string, PendingShoppingItem>();
  for (const item of pendingItems) {
    const key = stockKey(item.name, item.unit);
    if (!pendingByKey.has(key)) {
      pendingByKey.set(key, item);
    }
  }

  const changes: ShoppingListChanges = { updates: [], additions: [] };
  for (const [key, { base, ingredient }] of required) {
    const missing = base - (stock.get(key) ?? 0) - (pending.get(key) ?? 0);
    if (missing <= 0) {
      continue;
    }

    const existing = pendingByKey.get(key);
    if (existing) {
      const quantity = Number(existing.quantity) + fromBaseThousandths(missing, existing.unit);
      changes.updates.push({ id: existing.id, quantity: toQuantity(quantity) });
    } else {
      changes.additions.push({
        name: ingredient.name,
        unit: ingredient.unit,
        quantity: toQuantity(fromBaseThousandths(missing, ingredient.unit)),
      });
    }
  }
  return changes;
}

function toQuantity(quantity: number): string {
  return Math.min(quantity, FOOD_ITEM_QUANTITY_MAX).toFixed(3);
}
