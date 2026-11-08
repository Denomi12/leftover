import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { DataSource } from 'typeorm';
import { ENTITIES } from './entities/index.js';

const envFile = join(import.meta.dirname, '../../../.env');
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  uuidExtension: 'pgcrypto',

  entities: ENTITIES,
  migrations: [join(import.meta.dirname, 'migrations/*.{ts,js}')],

  synchronize: false,
});
