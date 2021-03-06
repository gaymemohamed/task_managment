import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from '@nestjs/common';
import { log } from 'util';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  
  const port = 3000;
  await app.listen(port);

  logger.log(`Application listen in port ${port}`);
  
}
bootstrap();
