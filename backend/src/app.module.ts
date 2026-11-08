import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConfigModule } from '../libs/db/db-config.module.js';
import { HouseholdModule } from './modules/household/household.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    DbConfigModule,
    HouseholdModule,
  ],
})
export class AppModule {}
