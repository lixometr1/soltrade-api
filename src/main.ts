require('dotenv').config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  console.log('running on ' + port);
}

bootstrap();
