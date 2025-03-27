import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(), //Para manejar variables de entorno
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto_super_seguro', //usar  variable de entorno
      signOptions: { expiresIn: '1h' }, //Tiempo de expiracion del token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], //Exportamos el AuthService para usarlo en otros modulos
})
export class AuthModule {}
