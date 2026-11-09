import type { FoodItemEntity } from '../../../../libs/db/entities/index.js';
import type { FoodItemResponse } from '../dtos/index.js';
import { currentIsoDate, getExpirationStatus } from '../utils/expiration.js';

export function toFoodItemResponse(
  { id, name, quantity, unit, category, expirationDate }: FoodItemEntity,
  today: string = currentIsoDate(),
): FoodItemResponse {
  return {
    id,
    name,
    quantity: Number(quantity),
    unit,
    category,
    expirationDate,
    expirationStatus: getExpirationStatus(expirationDate, today),
  };
}
