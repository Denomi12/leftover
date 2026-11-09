import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { NUMERIC_OUT_OF_RANGE_CODE } from '../constants/food-item.constants.js';
import { CreateFoodItemRequest, FoodItemResponse, UpdateFoodItemRequest } from '../dtos/index.js';
import { toFoodItemResponse } from '../mappers/food-item.mapper.js';
import { type FoodItemChanges, FoodItemRepository } from '../repository/food-item.repository.js';

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
    const item = await withQuantityLimit(() =>
      this.foodItemRepository.addOrMerge({
        householdId,
        name,
        quantity: String(quantity),
        unit,
        category,
        expirationDate: expirationDate ?? null,
      }),
    );
    return toFoodItemResponse(item);
  }

  async updateFoodItem(
    householdId: string,
    foodItemId: string,
    { name, quantity, unit, category, expirationDate }: UpdateFoodItemRequest,
  ): Promise<FoodItemResponse> {
    const changes: FoodItemChanges = {
      ...(name !== undefined && { name }),
      ...(quantity !== undefined && { quantity: String(quantity) }),
      ...(unit !== undefined && { unit }),
      ...(category !== undefined && { category }),
      ...(expirationDate !== undefined && { expirationDate }),
    };

    const item = await withQuantityLimit(() =>
      this.foodItemRepository.update(householdId, foodItemId, changes),
    );
    if (!item) {
      throw new NotFoundException('Food item not found');
    }
    return toFoodItemResponse(item);
  }

  async deleteFoodItem(householdId: string, foodItemId: string): Promise<void> {
    const deleted = await this.foodItemRepository.delete(householdId, foodItemId);
    if (!deleted) {
      throw new NotFoundException('Food item not found');
    }
  }
}

async function withQuantityLimit<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isNumericOutOfRange(error)) {
      throw new BadRequestException('quantity would exceed the maximum allowed value');
    }
    throw error;
  }
}

function isNumericOutOfRange(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code === NUMERIC_OUT_OF_RANGE_CODE
  );
}
