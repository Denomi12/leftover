import { ConfigService } from '@nestjs/config';
import { TRAILING_SLASHES_PATTERN } from '../constants/index.js';

export function getCorsOrigins(configService: ConfigService): string[] {
  const origins = configService
    .getOrThrow<string>('APP_CORS_ORIGIN')
    .split(',')
    .map((origin) => origin.trim().replace(TRAILING_SLASHES_PATTERN, ''))
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('APP_CORS_ORIGIN must list at least one origin');
  }

  return origins;
}
