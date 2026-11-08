import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { getCorsOrigins, setupSwagger } from './utils/config/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: getCorsOrigins(configService),
    credentials: true,
  });

  setupSwagger(app);

  await app.listen(configService.get<number>('PORT', 3000));
}
await bootstrap();
