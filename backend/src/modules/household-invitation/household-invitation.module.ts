import { Module } from '@nestjs/common';
import { DbModule } from '../../../libs/db/db.module.js';
import { HouseholdModule } from '../household/household.module.js';
import { HouseholdInvitationController } from './controllers/household-invitation.controller.js';
import { InvitationController } from './controllers/invitation.controller.js';
import { HouseholdInvitationRepository } from './repository/household-invitation.repository.js';
import { HouseholdInvitationService } from './services/household-invitation.service.js';

@Module({
  imports: [DbModule, HouseholdModule],
  controllers: [HouseholdInvitationController, InvitationController],
  providers: [HouseholdInvitationService, HouseholdInvitationRepository],
})
export class HouseholdInvitationModule {}
