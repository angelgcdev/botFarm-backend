import { Module } from '@nestjs/common';
import { SocketGatewayGateway } from './socket-gateway.gateway';
import { SocketGatewayService } from './socket-gateway.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DevicesModule } from 'src/devices/devices.module';

@Module({
  imports: [PrismaModule, DevicesModule],
  providers: [SocketGatewayGateway, SocketGatewayService],
})
export class SocketGatewayModule {}
