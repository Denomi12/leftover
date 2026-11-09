import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FoodItemEntity,
  MealIngredientEntity,
  PlannedMealEntity,
} from '../../../../libs/db/entities/index.js';

type PlannedMealData = Pick<PlannedMealEntity, 'householdId' | 'name' | 'date'>;

type MealIngredientData = Pick<MealIngredientEntity, 'name' | 'quantity' | 'unit'>;

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
}
