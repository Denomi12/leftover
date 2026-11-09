import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type EntityManager, Not, Repository } from 'typeorm';
import { FoodItemEntity } from '../../../../libs/db/entities/index.js';

type FoodItemData = Pick<
  FoodItemEntity,
  'householdId' | 'name' | 'quantity' | 'unit' | 'category' | 'expirationDate'
>;

export type FoodItemChanges = Partial<
  Pick<FoodItemEntity, 'name' | 'quantity' | 'unit' | 'category' | 'expirationDate'>
>;

@Injectable()
export class FoodItemRepository {
  constructor(
    @InjectRepository(FoodItemEntity)
    private readonly foodItemRepository: Repository<FoodItemEntity>,
  ) {}

  findOfHousehold(householdId: string): Promise<FoodItemEntity[]> {
    return this.foodItemRepository.find({
      where: { householdId },
      order: {
        expirationDate: { direction: 'ASC', nulls: 'LAST' },
        name: 'ASC',
      },
    });
  }

  addOrMerge(data: FoodItemData): Promise<FoodItemEntity> {
    return this.foodItemRepository.manager.transaction(async (manager) => {
      const existing = await findSameBatch(manager, data);
      if (!existing) {
        return manager.save(manager.create(FoodItemEntity, data));
      }

      await manager.increment(FoodItemEntity, { id: existing.id }, 'quantity', data.quantity);
      return manager.findOneByOrFail(FoodItemEntity, { id: existing.id });
    });
  }

  update(
    householdId: string,
    foodItemId: string,
    changes: FoodItemChanges,
  ): Promise<FoodItemEntity | null> {
    return this.foodItemRepository.manager.transaction(async (manager) => {
      const item = await manager.findOne(FoodItemEntity, {
        where: { id: foodItemId, householdId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!item) {
        return null;
      }

      const updated = Object.assign(item, changes);
      const sameBatch = await findSameBatch(manager, updated, foodItemId);
      if (!sameBatch) {
        return manager.save(updated);
      }

      await manager.increment(FoodItemEntity, { id: sameBatch.id }, 'quantity', updated.quantity);
      await manager.delete(FoodItemEntity, { id: foodItemId });
      return manager.findOneByOrFail(FoodItemEntity, { id: sameBatch.id });
    });
  }

  async delete(householdId: string, foodItemId: string): Promise<boolean> {
    const result = await this.foodItemRepository.delete({ id: foodItemId, householdId });
    return Boolean(result.affected);
  }
}

function findSameBatch(
  manager: EntityManager,
  data: FoodItemData,
  excludeId?: string,
): Promise<FoodItemEntity | null> {
  const query = manager
    .createQueryBuilder(FoodItemEntity, 'item')
    .setLock('pessimistic_write')
    .where('item.householdId = :householdId', { householdId: data.householdId })
    .andWhere('LOWER(item.name) = LOWER(:name)', { name: data.name })
    .andWhere('item.unit = :unit', { unit: data.unit })
    .andWhere('item.category = :category', { category: data.category });

  if (data.expirationDate) {
    query.andWhere('item.expirationDate = :expirationDate', {
      expirationDate: data.expirationDate,
    });
  } else {
    query.andWhere('item.expirationDate IS NULL');
  }

  if (excludeId) {
    query.andWhere({ id: Not(excludeId) });
  }

  return query.getOne();
}
