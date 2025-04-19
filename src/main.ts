import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo para la ruta /api
  app.setGlobalPrefix('api');

  //Habilitar validacion global
  app.useGlobalPipes(new ValidationPipe());

  //CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  //Para leer cookies el token jwt
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
