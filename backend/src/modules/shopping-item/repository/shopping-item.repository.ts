import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FoodItemEntity,
  HouseholdEntity,
  MealIngredientEntity,
  ShoppingItemEntity,
} from '../../../../libs/db/entities/index.js';
import { planMissingIngredients } from '../utils/shopping-list.js';

@Injectable()
export class ShoppingItemRepository {
  constructor(
    @InjectRepository(ShoppingItemEntity)
    private readonly shoppingItemRepository: Repository<ShoppingItemEntity>,
  ) {}

  findOfHousehold(householdId: string): Promise<ShoppingItemEntity[]> {
    return this.shoppingItemRepository
      .createQueryBuilder('item')
      .where('item.householdId = :householdId', { householdId })
      .orderBy('item.completed', 'ASC')
      .addOrderBy('LOWER(item.name)', 'ASC')
      .addOrderBy('item.id', 'ASC')
      .getMany();
  }

  async setCompleted(
    householdId: string,
    shoppingItemId: string,
    completed: boolean,
  ): Promise<ShoppingItemEntity | null> {
    const item = await this.shoppingItemRepository.findOneBy({ id: shoppingItemId, householdId });
    if (!item) {
      return null;
    }
    item.completed = completed;
    return this.shoppingItemRepository.save(item);
  }

  addMissingIngredients(householdId: string): Promise<void> {
    return this.shoppingItemRepository.manager.transaction(async (manager) => {
      await manager.findOne(HouseholdEntity, {
        where: { id: householdId },
        lock: { mode: 'pessimistic_write' },
      });

      const [ingredients, stock, pending] = await Promise.all([
        manager
          .createQueryBuilder(MealIngredientEntity, 'ingredient')
          .innerJoin('ingredient.plannedMeal', 'meal')
          .where('meal.householdId = :householdId', { householdId })
          .andWhere('meal.completed = false')
          .orderBy('meal.date', 'ASC')
          .addOrderBy('ingredient.id', 'ASC')
          .getMany(),
        manager.find(FoodItemEntity, {
          where: { householdId },
          select: { name: true, quantity: true, unit: true },
        }),
        manager.find(ShoppingItemEntity, {
          where: { householdId, completed: false },
          order: { id: 'ASC' },
        }),
      ]);

      const { updates, additions } = planMissingIngredients(ingredients, stock, pending);

      for (const { id, quantity } of updates) {
        await manager.update(ShoppingItemEntity, { id }, { quantity });
      }
      if (additions.length) {
        await manager.insert(
          ShoppingItemEntity,
          additions.map((item) => ({ ...item, householdId })),
        );
      }
    });
  }
}
