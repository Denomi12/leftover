import { Module } from '@nestjs/common';
import { DbModule } from '../../../libs/db/db.module.js';
import { HouseholdController } from './controllers/household.controller.js';
import { HouseholdService } from './services/household.service.js';
import { HouseholdRepository } from './repository/household.repository.js';

@Module({
  imports: [DbModule],
  controllers: [HouseholdController],
  providers: [HouseholdService, HouseholdRepository],
  exports: [HouseholdService],
})
export class HouseholdModule {}
