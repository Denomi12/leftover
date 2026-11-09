import type { ExpirationStatus, FoodCategory, FoodItem, FoodUnit } from '../types/food-item.js';
import { formatQuantity } from './food-units.js';

export interface FoodGroup {
  key: string;
  name: string;
  category: FoodCategory;
  items: FoodItem[];
}

export const foodGroupKey = ({ category, name }: Pick<FoodItem, 'category' | 'name'>) =>
  `${category}:${name.trim().toLocaleLowerCase('sl')}`;

export function groupFoodItems(items: FoodItem[]): FoodGroup[] {
  const groups = new Map<string, FoodGroup>();
  for (const item of items) {
    const key = foodGroupKey(item);
    const group = groups.get(key);
    if (group) group.items.push(item);
    else groups.set(key, { key, name: item.name, category: item.category, items: [item] });
  }
  return [...groups.values()];
}

export function formatGroupQuantity(items: FoodItem[]): string {
  const totals = new Map<FoodUnit, number>();
  for (const { unit, quantity } of items) {
    totals.set(unit, Math.round(((totals.get(unit) ?? 0) + quantity) * 1000) / 1000);
  }
  return [...totals].map(([unit, quantity]) => formatQuantity(quantity, unit)).join(' + ');
}

export const groupExpirationStatus = (group: FoodGroup): ExpirationStatus | null =>
  group.items[0].expirationStatus;
