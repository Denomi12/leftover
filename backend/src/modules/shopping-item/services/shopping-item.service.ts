import { Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingItemResponse, UpdateShoppingItemRequest } from '../dtos/index.js';
import { toShoppingItemResponse } from '../mappers/shopping-item.mapper.js';
import { ShoppingItemRepository } from '../repository/shopping-item.repository.js';

@Injectable()
export class ShoppingItemService {
  constructor(private readonly shoppingItemRepository: ShoppingItemRepository) {}

  async getShoppingItems(householdId: string): Promise<ShoppingItemResponse[]> {
    const items = await this.shoppingItemRepository.findOfHousehold(householdId);
    return items.map(toShoppingItemResponse);
  }

  async updateShoppingItem(
    householdId: string,
    shoppingItemId: string,
    { completed }: UpdateShoppingItemRequest,
  ): Promise<ShoppingItemResponse> {
    const item = await this.shoppingItemRepository.setCompleted(
      householdId,
      shoppingItemId,
      completed,
    );
    if (!item) {
      throw new NotFoundException('Shopping item not found');
    }
    return toShoppingItemResponse(item);
  }

  addMissingIngredients(householdId: string): Promise<void> {
    return this.shoppingItemRepository.addMissingIngredients(householdId);
  }
}
