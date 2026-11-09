import { Module } from '@nestjs/common';
import { DbModule } from '../../../libs/db/db.module.js';
import { ShoppingItemController } from './controllers/shopping-item.controller.js';
import { ShoppingItemRepository } from './repository/shopping-item.repository.js';
import { ShoppingItemService } from './services/shopping-item.service.js';

@Module({
  imports: [DbModule],
  controllers: [ShoppingItemController],
  providers: [ShoppingItemService, ShoppingItemRepository],
  exports: [ShoppingItemService],
})
export class ShoppingItemModule {}
