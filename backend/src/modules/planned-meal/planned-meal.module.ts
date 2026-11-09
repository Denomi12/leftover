import { Module } from '@nestjs/common';
import { DbModule } from '../../../libs/db/db.module.js';
import { ShoppingItemModule } from '../shopping-item/shopping-item.module.js';
import { PlannedMealController } from './controllers/planned-meal.controller.js';
import { PlannedMealRepository } from './repository/planned-meal.repository.js';
import { PlannedMealService } from './services/planned-meal.service.js';

@Module({
  imports: [DbModule, ShoppingItemModule],
  controllers: [PlannedMealController],
  providers: [PlannedMealService, PlannedMealRepository],
})
export class PlannedMealModule {}
