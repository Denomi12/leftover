import { FoodUnit } from '../../../utils/types/food-unit.type.js';

const THOUSANDTHS = 1000;

const UNIT_SCALE: Record<FoodUnit, { dimension: string; factor: number }> = {
  [FoodUnit.Gram]: { dimension: 'mass', factor: 1 },
  [FoodUnit.Kilogram]: { dimension: 'mass', factor: 1000 },
  [FoodUnit.Milliliter]: { dimension: 'volume', factor: 1 },
  [FoodUnit.Liter]: { dimension: 'volume', factor: 1000 },
  [FoodUnit.Piece]: { dimension: 'piece', factor: 1 },
  [FoodUnit.Portion]: { dimension: 'portion', factor: 1 },
};

export interface StockAmount {
  name: string;
  quantity: string;
  unit: FoodUnit;
}

export type Stock = Map<string, number>;

export function stockKey(name: string, unit: FoodUnit): string {
  return `${name.trim().toLocaleLowerCase('sl')}|${UNIT_SCALE[unit].dimension}`;
}

export function toBaseThousandths(quantity: string | number, unit: FoodUnit): number {
  return Math.round(Number(quantity) * THOUSANDTHS) * UNIT_SCALE[unit].factor;
}

export function buildStock(items: StockAmount[]): Stock {
  const stock: Stock = new Map();
  for (const { name, quantity, unit } of items) {
    const key = stockKey(name, unit);
    stock.set(key, (stock.get(key) ?? 0) + toBaseThousandths(quantity, unit));
  }
  return stock;
}

export function getMissingQuantity(stock: Stock, { name, quantity, unit }: StockAmount): number {
  const available = stock.get(stockKey(name, unit)) ?? 0;
  const missing = toBaseThousandths(quantity, unit) - available;
  if (missing <= 0) {
    return 0;
  }
  return fromBaseThousandths(missing, unit);
}

export function fromBaseThousandths(base: number, unit: FoodUnit): number {
  return Math.ceil(base / UNIT_SCALE[unit].factor) / THOUSANDTHS;
}
