import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from './entities/index.js';

@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  exports: [TypeOrmModule],
})
export class DbModule {}
