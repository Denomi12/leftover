import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  HouseholdMemberEntity,
  ShoppingItemEntity,
} from '../../../../libs/db/entities/index.js';
import { HouseholdRole } from '../../../utils/types/household-role.type.js';
import { ShoppingItemSource } from '../../../utils/types/shopping-item-source.type.js';
import {
  CreateShoppingItemRequest,
  ShoppingItemResponse,
  UpdateShoppingItemRequest,
} from '../dtos/index.js';
import { toShoppingItemResponse } from '../mappers/shopping-item.mapper.js';
import {
  type ShoppingItemChanges,
  ShoppingItemRepository,
} from '../repository/shopping-item.repository.js';

@Injectable()
export class ShoppingItemService {
  constructor(private readonly shoppingItemRepository: ShoppingItemRepository) {}

  async getShoppingItems(householdId: string): Promise<ShoppingItemResponse[]> {
    const items = await this.shoppingItemRepository.findOfHousehold(householdId);
    return items.map(toShoppingItemResponse);
  }

  async createShoppingItem(
    householdId: string,
    { name, quantity, unit }: CreateShoppingItemRequest,
  ): Promise<ShoppingItemResponse> {
    const item = await this.shoppingItemRepository.create({
      householdId,
      name,
      quantity: String(quantity),
      unit,
    });
    return toShoppingItemResponse(item);
  }

  async updateShoppingItem(
    { householdId, role }: HouseholdMemberEntity,
    shoppingItemId: string,
    { name, quantity, unit, completed }: UpdateShoppingItemRequest,
  ): Promise<ShoppingItemResponse> {
    const item = await this.findShoppingItem(householdId, shoppingItemId);
    const details: ShoppingItemChanges = {
      ...(name !== undefined && { name }),
      ...(quantity !== undefined && { quantity: String(quantity) }),
      ...(unit !== undefined && { unit }),
    };

    if (Object.keys(details).length > 0) {
      if (role === HouseholdRole.Guest) {
        throw new ForbiddenException('Guests can only mark shopping items as bought');
      }
      assertManual(item);
    }

    const updated = await this.shoppingItemRepository.update(item, {
      ...details,
      ...(completed !== undefined && { completed }),
    });
    return toShoppingItemResponse(updated);
  }

  async deleteShoppingItem(householdId: string, shoppingItemId: string): Promise<void> {
    const item = await this.findShoppingItem(householdId, shoppingItemId);
    assertManual(item);
    await this.shoppingItemRepository.delete(item.id);
  }

  addMissingIngredients(householdId: string): Promise<void> {
    return this.shoppingItemRepository.addMissingIngredients(householdId);
  }

  private async findShoppingItem(
    householdId: string,
    shoppingItemId: string,
  ): Promise<ShoppingItemEntity> {
    const item = await this.shoppingItemRepository.findOne(householdId, shoppingItemId);
    if (!item) {
      throw new NotFoundException('Shopping item not found');
    }
    return item;
  }
}

function assertManual(item: ShoppingItemEntity): void {
  if (item.source !== ShoppingItemSource.Manual) {
    throw new ForbiddenException('Shopping items from the meal plan cannot be changed');
  }
}
