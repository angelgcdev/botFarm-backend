import { Module } from '@nestjs/common';
import { ClientesVentasService } from './clientes-ventas.service';
import { ClientesVentasController } from './clientes-ventas.controller';

@Module({
  controllers: [ClientesVentasController],
  providers: [ClientesVentasService],
})
export class ClientesVentasModule {}
