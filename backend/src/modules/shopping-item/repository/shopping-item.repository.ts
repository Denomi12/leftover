import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  FoodItemEntity,
  HouseholdEntity,
  MealIngredientEntity,
  ShoppingItemEntity,
} from '../../../../libs/db/entities/index.js';
import { ShoppingItemSource } from '../../../utils/types/shopping-item-source.type.js';
import { planMissingIngredients } from '../utils/shopping-list.js';

type ShoppingItemData = Pick<ShoppingItemEntity, 'householdId' | 'name' | 'quantity' | 'unit'>;

export type ShoppingItemChanges = Partial<
  Pick<ShoppingItemEntity, 'name' | 'quantity' | 'unit' | 'completed'>
>;

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

  findOne(householdId: string, shoppingItemId: string): Promise<ShoppingItemEntity | null> {
    return this.shoppingItemRepository.findOneBy({ id: shoppingItemId, householdId });
  }

  create(data: ShoppingItemData): Promise<ShoppingItemEntity> {
    return this.shoppingItemRepository.save(
      this.shoppingItemRepository.create({ ...data, source: ShoppingItemSource.Manual }),
    );
  }

  update(item: ShoppingItemEntity, changes: ShoppingItemChanges): Promise<ShoppingItemEntity> {
    return this.shoppingItemRepository.save(Object.assign(item, changes));
  }

  async delete(shoppingItemId: string): Promise<void> {
    await this.shoppingItemRepository.delete({ id: shoppingItemId });
  }

  syncMissingIngredients(householdId: string): Promise<void> {
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
          where: { householdId, completed: false, source: ShoppingItemSource.MealPlan },
          order: { id: 'ASC' },
        }),
      ]);

      const { updates, additions, deletions } = planMissingIngredients(ingredients, stock, pending);

      for (const { id, quantity } of updates) {
        await manager.update(ShoppingItemEntity, { id }, { quantity });
      }
      if (deletions.length) {
        await manager.delete(ShoppingItemEntity, { id: In(deletions) });
      }
      if (additions.length) {
        await manager.insert(
          ShoppingItemEntity,
          additions.map((item) => ({
            ...item,
            householdId,
            source: ShoppingItemSource.MealPlan,
          })),
        );
      }
    });
  }
}
