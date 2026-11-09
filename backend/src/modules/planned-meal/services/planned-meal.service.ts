import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
  type CreateMealIngredientRequest,
  CreatePlannedMealRequest,
  PlannedMealResponse,
  UpdatePlannedMealRequest,
} from '../dtos/index.js';
import { toPlannedMealResponse } from '../mappers/planned-meal.mapper.js';
import {
  type MealChangeResult,
  type PlannedMealChanges,
  PlannedMealRepository,
} from '../repository/planned-meal.repository.js';
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
      ingredients.map(toIngredientData),
    );
    await this.shoppingItemService.syncMissingIngredients(householdId);
    return toPlannedMealResponse(meal, await this.getStock(householdId));
  }

  async completePlannedMeal(
    householdId: string,
    plannedMealId: string,
  ): Promise<PlannedMealResponse> {
    const meal = assertChanged(
      await this.plannedMealRepository.complete(householdId, plannedMealId),
      'Planned meal is already completed',
    );
    await this.shoppingItemService.syncMissingIngredients(householdId);
    return toPlannedMealResponse(meal, await this.getStock(householdId));
  }

  async updatePlannedMeal(
    householdId: string,
    plannedMealId: string,
    { name, date, ingredients }: UpdatePlannedMealRequest,
  ): Promise<PlannedMealResponse> {
    const changes: PlannedMealChanges = {
      ...(name !== undefined && { name }),
      ...(date !== undefined && { date }),
    };
    const meal = assertChanged(
      await this.plannedMealRepository.update(
        householdId,
        plannedMealId,
        changes,
        ingredients?.map(toIngredientData),
      ),
      'Completed meals cannot be changed',
    );
    await this.shoppingItemService.syncMissingIngredients(householdId);
    return toPlannedMealResponse(meal, await this.getStock(householdId));
  }

  async deletePlannedMeal(householdId: string, plannedMealId: string): Promise<void> {
    const deleted = await this.plannedMealRepository.delete(householdId, plannedMealId);
    if (!deleted) {
      throw new NotFoundException('Planned meal not found');
    }
    await this.shoppingItemService.syncMissingIngredients(householdId);
  }

  private async getStock(householdId: string): Promise<Stock> {
    return buildStock(await this.plannedMealRepository.findStockOfHousehold(householdId));
  }
}

function toIngredientData({ name, quantity, unit }: CreateMealIngredientRequest) {
  return { name, quantity: String(quantity), unit };
}

function assertChanged(result: MealChangeResult, conflictMessage: string) {
  if (result.status === 'not-found') {
    throw new NotFoundException('Planned meal not found');
  }
  if (result.status === 'already-completed') {
    throw new ConflictException(conflictMessage);
  }
  return result.meal;
}
