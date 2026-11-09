import { z } from 'zod';
import type { FoodCategory, FoodUnit } from '../types/food-item.js';

export const FOOD_ITEM_NAME_MAX_LENGTH = 100;
export const FOOD_ITEM_QUANTITY_MAX = 9_999_999.999;
const QUANTITY_PATTERN = /^-?\d+(\.\d{1,3})?$/;

const FOOD_UNIT_VALUES = ['kos', 'g', 'kg', 'ml', 'l', 'porcija'] as const satisfies FoodUnit[];
const FOOD_CATEGORY_VALUES = [
  'FRUIT',
  'DAIRY',
  'MEAT_AND_FISH',
  'PREPARED_MEALS',
  'SPREADS',
  'VEGETABLES',
  'EGGS',
  'SAUCES',
  'DRINKS',
] as const satisfies FoodCategory[];

export const createFoodItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vnesi ime živila.')
    .max(
      FOOD_ITEM_NAME_MAX_LENGTH,
      `Ime je lahko dolgo največ ${FOOD_ITEM_NAME_MAX_LENGTH} znakov.`,
    ),
  quantity: z
    .string()
    .trim()
    .min(1, 'Vnesi količino.')
    .transform((value) => value.replace(',', '.'))
    .refine((value) => QUANTITY_PATTERN.test(value), 'Vnesi število z največ 3 decimalkami.')
    .transform(Number)
    .refine((value) => value > 0, 'Količina mora biti večja od 0')
    .refine((value) => value <= FOOD_ITEM_QUANTITY_MAX, 'Količina je prevelika.'),
  unit: z.enum(FOOD_UNIT_VALUES, 'Izberi mersko enoto.'),
  category: z.enum(FOOD_CATEGORY_VALUES, 'Izberi mesto v hladilniku.'),
  expirationDate: z.string().nullable(),
});

export type CreateFoodItemValues = z.infer<typeof createFoodItemSchema>;
