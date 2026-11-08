import { Module } from '@nestjs/common';
import { DbModule } from '../../../libs/db/db.module.js';
import { HouseholdController } from './controllers/household.controller.js';
import { HouseholdRepository } from './repository/household.repository.js';
import { HouseholdService } from './services/household.service.js';

@Module({
  imports: [DbModule],
  controllers: [HouseholdController],
  providers: [HouseholdService, HouseholdRepository],
})
export class HouseholdModule {}
