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
  deletions: string[];
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
  const pendingByKey = new Map<string, PendingShoppingItem[]>();
  for (const item of pendingItems) {
    const key = stockKey(item.name, item.unit);
    pendingByKey.set(key, [...(pendingByKey.get(key) ?? []), item]);
  }

  const changes: ShoppingListChanges = { updates: [], additions: [], deletions: [] };
  for (const key of new Set([...required.keys(), ...pendingByKey.keys()])) {
    const entry = required.get(key);
    const shortfall = Math.max(0, (entry?.base ?? 0) - (stock.get(key) ?? 0));
    const pending = pendingByKey.get(key) ?? [];
    const pendingBase = pending.reduce(
      (sum, item) => sum + toBaseThousandths(item.quantity, item.unit),
      0,
    );

    if (shortfall > pendingBase) {
      const missing = shortfall - pendingBase;
      const [existing] = pending;
      if (existing) {
        const quantity = Number(existing.quantity) + fromBaseThousandths(missing, existing.unit);
        changes.updates.push({ id: existing.id, quantity: toQuantity(quantity) });
      } else if (entry) {
        changes.additions.push({
          name: entry.ingredient.name,
          unit: entry.ingredient.unit,
          quantity: toQuantity(fromBaseThousandths(missing, entry.ingredient.unit)),
        });
      }
    } else if (shortfall < pendingBase) {
      reduceExcess(pending, pendingBase - shortfall, changes);
    }
  }
  return changes;
}

function reduceExcess(
  pending: PendingShoppingItem[],
  excess: number,
  changes: ShoppingListChanges,
): void {
  for (const item of [...pending].reverse()) {
    if (excess <= 0) {
      return;
    }
    const base = toBaseThousandths(item.quantity, item.unit);
    if (base <= excess) {
      changes.deletions.push(item.id);
      excess -= base;
    } else {
      changes.updates.push({
        id: item.id,
        quantity: toQuantity(fromBaseThousandths(base - excess, item.unit)),
      });
      excess = 0;
    }
  }
}

function toQuantity(quantity: number): string {
  return Math.min(quantity, FOOD_ITEM_QUANTITY_MAX).toFixed(3);
}
