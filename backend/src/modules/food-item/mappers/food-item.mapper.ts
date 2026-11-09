import type { FoodItemEntity } from '../../../../libs/db/entities/index.js';
import type { FoodItemResponse } from '../dtos/index.js';

export function toFoodItemResponse({
  id,
  name,
  quantity,
  unit,
  category,
  expirationDate,
}: FoodItemEntity): FoodItemResponse {
  return { id, name, quantity: Number(quantity), unit, category, expirationDate };
}
