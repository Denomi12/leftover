import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ENTITIES } from './entities/index.js';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow<string>('DB_HOST'),
      port: parseInt(this.configService.getOrThrow<string>('DB_PORT'), 10),
      username: this.configService.getOrThrow<string>('DB_USER'),
      password: this.configService.getOrThrow<string>('DB_PASSWORD'),
      database: this.configService.getOrThrow<string>('DB_NAME'),
      uuidExtension: 'pgcrypto',

      entities: ENTITIES,
      synchronize: false,
    };
  }
}
