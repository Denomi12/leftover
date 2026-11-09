import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConfigModule } from '../libs/db/db-config.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { HouseholdModule } from './modules/household/household.module.js';
import { HouseholdInvitationModule } from './modules/household-invitation/household-invitation.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    DbConfigModule,
    AuthModule,
    HouseholdModule,
    HouseholdInvitationModule,
  ],
})
export class AppModule {}
