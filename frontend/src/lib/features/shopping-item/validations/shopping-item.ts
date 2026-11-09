import { createFoodItemSchema } from '#lib/features/food-item/index.js';

export const createShoppingItemSchema = createFoodItemSchema.pick({
  name: true,
  quantity: true,
  unit: true,
});
