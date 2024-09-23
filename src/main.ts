import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { getBodyParserOptions } from '@nestjs/platform-express/adapters/utils/get-body-parser-options.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(json(getBodyParserOptions(true, { limit: '50mb' })));
  app.use(urlencoded(getBodyParserOptions(true, { limit: '50mb' })));

  await app.listen(3000);
}
bootstrap();
