import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SocketGatewayModule } from './socket-gateway/socket-gateway.module';
import { AutomationService } from './automation/automation.service';

@Module({
  imports: [AuthModule, PrismaModule, SocketGatewayModule],
  controllers: [AppController],
  providers: [AppService, AutomationService],
})
export class AppModule {}
