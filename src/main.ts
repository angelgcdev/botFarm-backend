import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo para la ruta /api
  app.setGlobalPrefix('api');

  //Habilitar validacion global
  app.useGlobalPipes(new ValidationPipe());

  //CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
