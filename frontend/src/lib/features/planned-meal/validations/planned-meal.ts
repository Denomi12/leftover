import { z } from 'zod';
import { createFoodItemSchema } from '#lib/features/food-item/index.js';

export const PLANNED_MEAL_NAME_MAX_LENGTH = 100;
export const PLANNED_MEAL_INGREDIENTS_MAX = 50;

const ingredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vnesi sestavino.')
    .max(100, 'Ime je lahko dolgo največ 100 znakov.'),
  quantity: createFoodItemSchema.shape.quantity,
  unit: createFoodItemSchema.shape.unit,
});

export const createPlannedMealSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vnesi ime obroka.')
    .max(
      PLANNED_MEAL_NAME_MAX_LENGTH,
      `Ime je lahko dolgo največ ${PLANNED_MEAL_NAME_MAX_LENGTH} znakov.`,
    ),
  date: z.string('Izberi datum.'),
  ingredients: z
    .array(ingredientSchema)
    .min(1, 'Dodaj vsaj eno sestavino.')
    .max(
      PLANNED_MEAL_INGREDIENTS_MAX,
      `Obrok ima lahko največ ${PLANNED_MEAL_INGREDIENTS_MAX} sestavin.`,
    ),
});
