import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  FoodItemEntity,
  HouseholdEntity,
  MealIngredientEntity,
  PlannedMealEntity,
} from '../../../../libs/db/entities/index.js';
import { planConsumption } from '../utils/stock.js';

type PlannedMealData = Pick<PlannedMealEntity, 'householdId' | 'name' | 'date'>;

type MealIngredientData = Pick<MealIngredientEntity, 'name' | 'quantity' | 'unit'>;

export type PlannedMealChanges = Partial<Pick<PlannedMealEntity, 'name' | 'date'>>;

export type MealChangeResult =
  | { status: 'changed'; meal: PlannedMealEntity }
  | { status: 'not-found' }
  | { status: 'already-completed' };

@Injectable()
export class PlannedMealRepository {
  constructor(
    @InjectRepository(PlannedMealEntity)
    private readonly plannedMealRepository: Repository<PlannedMealEntity>,
    @InjectRepository(FoodItemEntity)
    private readonly foodItemRepository: Repository<FoodItemEntity>,
  ) {}

  findOfHousehold(householdId: string): Promise<PlannedMealEntity[]> {
    return this.plannedMealRepository
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.ingredients', 'ingredient')
      .where('meal.householdId = :householdId', { householdId })
      .orderBy('meal.date', 'ASC')
      .addOrderBy('LOWER(meal.name)', 'ASC')
      .addOrderBy('meal.id', 'ASC')
      .addOrderBy('LOWER(ingredient.name)', 'ASC')
      .addOrderBy('ingredient.id', 'ASC')
      .getMany();
  }

  findStockOfHousehold(householdId: string): Promise<FoodItemEntity[]> {
    return this.foodItemRepository.find({
      where: { householdId },
      select: { name: true, quantity: true, unit: true },
    });
  }

  create(meal: PlannedMealData, ingredients: MealIngredientData[]): Promise<PlannedMealEntity> {
    return this.plannedMealRepository.manager.transaction(async (manager) => {
      const saved = await manager.save(manager.create(PlannedMealEntity, meal));
      saved.ingredients = await manager.save(
        ingredients.map((ingredient) =>
          manager.create(MealIngredientEntity, { ...ingredient, plannedMealId: saved.id }),
        ),
      );
      return saved;
    });
  }

  complete(householdId: string, plannedMealId: string): Promise<MealChangeResult> {
    return this.plannedMealRepository.manager.transaction(async (manager) => {
      await manager.findOne(HouseholdEntity, {
        where: { id: householdId },
        lock: { mode: 'pessimistic_write' },
      });

      const meal = await manager.findOne(PlannedMealEntity, {
        where: { id: plannedMealId, householdId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!meal) {
        return { status: 'not-found' };
      }
      if (meal.completed) {
        return { status: 'already-completed' };
      }

      const [ingredients, items] = await Promise.all([
        manager.find(MealIngredientEntity, {
          where: { plannedMealId },
          order: { name: 'ASC', id: 'ASC' },
        }),
        manager
          .createQueryBuilder(FoodItemEntity, 'item')
          .setLock('pessimistic_write')
          .where('item.householdId = :householdId', { householdId })
          .orderBy('item.expirationDate', 'ASC', 'NULLS LAST')
          .addOrderBy('item.id', 'ASC')
          .getMany(),
      ]);

      const { updates, deletions } = planConsumption(ingredients, items);
      for (const { id, quantity } of updates) {
        await manager.update(FoodItemEntity, { id }, { quantity });
      }
      if (deletions.length) {
        await manager.delete(FoodItemEntity, { id: In(deletions) });
      }

      await manager.update(PlannedMealEntity, { id: meal.id }, { completed: true });
      meal.completed = true;
      meal.ingredients = ingredients;
      return { status: 'changed', meal };
    });
  }

  update(
    householdId: string,
    plannedMealId: string,
    changes: PlannedMealChanges,
    ingredients: MealIngredientData[] | undefined,
  ): Promise<MealChangeResult> {
    return this.plannedMealRepository.manager.transaction(async (manager) => {
      const meal = await manager.findOne(PlannedMealEntity, {
        where: { id: plannedMealId, householdId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!meal) {
        return { status: 'not-found' };
      }
      if (meal.completed) {
        return { status: 'already-completed' };
      }

      if (Object.keys(changes).length > 0) {
        await manager.update(PlannedMealEntity, { id: meal.id }, changes);
        Object.assign(meal, changes);
      }

      if (ingredients) {
        await manager.delete(MealIngredientEntity, { plannedMealId });
        await manager.save(
          ingredients.map((ingredient) =>
            manager.create(MealIngredientEntity, { ...ingredient, plannedMealId }),
          ),
        );
      }

      meal.ingredients = await manager.find(MealIngredientEntity, {
        where: { plannedMealId },
        order: { name: 'ASC', id: 'ASC' },
      });
      return { status: 'changed', meal };
    });
  }

  async delete(householdId: string, plannedMealId: string): Promise<boolean> {
    const result = await this.plannedMealRepository.delete({ id: plannedMealId, householdId });
    return (result.affected ?? 0) > 0;
  }
}
