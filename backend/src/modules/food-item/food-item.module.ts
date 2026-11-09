import { Module } from '@nestjs/common';
import { DbModule } from '../../../libs/db/db.module.js';
import { FoodItemController } from './controllers/food-item.controller.js';
import { FoodItemRepository } from './repository/food-item.repository.js';
import { FoodItemService } from './services/food-item.service.js';

@Module({
  imports: [DbModule],
  controllers: [FoodItemController],
  providers: [FoodItemService, FoodItemRepository],
})
export class FoodItemModule {}
