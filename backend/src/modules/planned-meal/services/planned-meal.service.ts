import { Injectable } from '@nestjs/common';
import { CreatePlannedMealRequest, PlannedMealResponse } from '../dtos/index.js';
import { toPlannedMealResponse } from '../mappers/planned-meal.mapper.js';
import { PlannedMealRepository } from '../repository/planned-meal.repository.js';
import { buildStock, type Stock } from '../utils/stock.js';

@Injectable()
export class PlannedMealService {
  constructor(private readonly plannedMealRepository: PlannedMealRepository) {}

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
    return toPlannedMealResponse(meal, await this.getStock(householdId));
  }

  private async getStock(householdId: string): Promise<Stock> {
    return buildStock(await this.plannedMealRepository.findStockOfHousehold(householdId));
  }
}
