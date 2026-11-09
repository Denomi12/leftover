import type { FoodUnit } from '../types/food-item.js';

export const FOOD_UNITS: FoodUnit[] = ['kos', 'g', 'kg', 'ml', 'l', 'porcija'];

export const FOOD_UNIT_LABELS: Record<FoodUnit, string> = {
  kos: 'kos',
  g: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  porcija: 'porcija',
};

const quantityFormat = new Intl.NumberFormat('sl-SI', { maximumFractionDigits: 3 });

function portionLabel(quantity: number): string {
  if (!Number.isInteger(quantity)) return 'porcije';
  const lastTwo = quantity % 100;
  if (lastTwo === 1) return 'porcija';
  if (lastTwo === 2) return 'porciji';
  if (lastTwo === 3 || lastTwo === 4) return 'porcije';
  return 'porcij';
}

export function formatQuantity(quantity: number, unit: FoodUnit): string {
  const label = unit === 'porcija' ? portionLabel(quantity) : FOOD_UNIT_LABELS[unit];
  return `${quantityFormat.format(quantity)} ${label}`;
}

export function formatBatchCount(count: number): string {
  const lastTwo = count % 100;
  if (lastTwo === 2) return `${count} različna roka`;
  if (lastTwo === 3 || lastTwo === 4) return `${count} različni roki`;
  return `${count} različnih rokov`;
}

export function formatFoodCount(count: number): string {
  const lastTwo = count % 100;
  if (lastTwo === 1) return `${count} živilo`;
  if (lastTwo === 2) return `${count} živili`;
  if (lastTwo === 3 || lastTwo === 4) return `${count} živila`;
  return `${count} živil`;
}
