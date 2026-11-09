import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodItemEntity } from '../../../../libs/db/entities/index.js';

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

  create(
    data: Pick<
      FoodItemEntity,
      'householdId' | 'name' | 'quantity' | 'unit' | 'category' | 'expirationDate'
    >,
  ): Promise<FoodItemEntity> {
    return this.foodItemRepository.save(this.foodItemRepository.create(data));
  }
}
