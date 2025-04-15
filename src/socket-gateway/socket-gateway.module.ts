import { Module } from '@nestjs/common';
import { SocketGatewayGateway } from './socket-gateway.gateway';
import { SocketGatewayService } from './socket-gateway.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SocketGatewayGateway, SocketGatewayService],
})
export class SocketGatewayModule {}
