import type { ShoppingItemEntity } from '../../../../libs/db/entities/index.js';
import type { ShoppingItemResponse } from '../dtos/index.js';

export function toShoppingItemResponse({
  id,
  name,
  quantity,
  unit,
  completed,
  source,
}: ShoppingItemEntity): ShoppingItemResponse {
  return { id, name, quantity: Number(quantity), unit, completed, source };
}
