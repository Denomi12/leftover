import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodItemEntity } from '../../../../libs/db/entities/index.js';

type CreateFoodItemData = Pick<
  FoodItemEntity,
  'householdId' | 'name' | 'quantity' | 'unit' | 'category' | 'expirationDate'
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

  addOrMerge(data: CreateFoodItemData): Promise<FoodItemEntity> {
    return this.foodItemRepository.manager.transaction(async (manager) => {
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

      const existing = await query.getOne();
      if (!existing) {
        return manager.save(manager.create(FoodItemEntity, data));
      }

      await manager.increment(FoodItemEntity, { id: existing.id }, 'quantity', data.quantity);
      return manager.findOneByOrFail(FoodItemEntity, { id: existing.id });
    });
  }
}
