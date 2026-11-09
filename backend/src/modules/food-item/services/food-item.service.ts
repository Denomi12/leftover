import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { NUMERIC_OUT_OF_RANGE_CODE } from '../constants/food-item.constants.js';
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
    try {
      const item = await this.foodItemRepository.addOrMerge({
        householdId,
        name,
        quantity: String(quantity),
        unit,
        category,
        expirationDate: expirationDate ?? null,
      });
      return toFoodItemResponse(item);
    } catch (error) {
      if (isNumericOutOfRange(error)) {
        throw new BadRequestException('quantity would exceed the maximum allowed value');
      }
      throw error;
    }
  }
}

function isNumericOutOfRange(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code === NUMERIC_OUT_OF_RANGE_CODE
  );
}
