import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlannedMealRequest, PlannedMealResponse } from '../dtos/index.js';
import { toPlannedMealResponse } from '../mappers/planned-meal.mapper.js';
import { PlannedMealRepository } from '../repository/planned-meal.repository.js';
import { ShoppingItemService } from '../../shopping-item/services/shopping-item.service.js';
import { buildStock, type Stock } from '../utils/stock.js';

@Injectable()
export class PlannedMealService {
  constructor(
    private readonly plannedMealRepository: PlannedMealRepository,
    private readonly shoppingItemService: ShoppingItemService,
  ) {}

  async getPlannedMeals(householdId: string): Promise<PlannedMealResponse[]> {
    const [meals, stock] = await Promise.all([
      this.plannedMealRepository.findOfHousehold(householdId),
      this.getStock(householdId),
    ]);
    return meals.map((meal) => toPlannedMealResponse(meal, stock));
  }

  async createPlannedMeal(
    householdId: string,
    { name, date, ingredients }: CreatePlannedMealRequest,
  ): Promise<PlannedMealResponse> {
    const meal = await this.plannedMealRepository.create(
      { householdId, name, date },
      ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: String(ingredient.quantity),
        unit: ingredient.unit,
      })),
    );
    await this.shoppingItemService.addMissingIngredients(householdId);
    return toPlannedMealResponse(meal, await this.getStock(householdId));
  }

  async completePlannedMeal(
    householdId: string,
    plannedMealId: string,
  ): Promise<PlannedMealResponse> {
    const result = await this.plannedMealRepository.complete(householdId, plannedMealId);
    if (result.status === 'not-found') {
      throw new NotFoundException('Planned meal not found');
    }
    if (result.status === 'already-completed') {
      throw new ConflictException('Planned meal is already completed');
    }
    await this.shoppingItemService.addMissingIngredients(householdId);
    return toPlannedMealResponse(result.meal, await this.getStock(householdId));
  }

  private async getStock(householdId: string): Promise<Stock> {
    return buildStock(await this.plannedMealRepository.findStockOfHousehold(householdId));
  }
}
