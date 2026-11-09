import { Injectable } from '@nestjs/common';
import { CreateFoodItemRequest, FoodItemResponse } from '../dtos/index.js';
import { toFoodItemResponse } from '../mappers/food-item.mapper.js';
import { FoodItemRepository } from '../repository/food-item.repository.js';

@Injectable()
export class FoodItemService {
  constructor(private readonly foodItemRepository: FoodItemRepository) {}

  async getFoodItems(householdId: string): Promise<FoodItemResponse[]> {
    const items = await this.foodItemRepository.findOfHousehold(householdId);
    return items.map(toFoodItemResponse);
  }

  async createFoodItem(
    householdId: string,
    { name, quantity, unit, category, expirationDate }: CreateFoodItemRequest,
  ): Promise<FoodItemResponse> {
    const item = await this.foodItemRepository.create({
      householdId,
      name,
      quantity: String(quantity),
      unit,
      category,
      expirationDate: expirationDate ?? null,
    });
    return toFoodItemResponse(item);
  }
}
