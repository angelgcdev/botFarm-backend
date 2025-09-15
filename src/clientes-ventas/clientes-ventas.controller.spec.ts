import { Test, TestingModule } from '@nestjs/testing';
import { ClientesVentasController } from './clientes-ventas.controller';
import { ClientesVentasService } from './clientes-ventas.service';

describe('ClientesVentasController', () => {
  let controller: ClientesVentasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesVentasController],
      providers: [ClientesVentasService],
    }).compile();

    controller = module.get<ClientesVentasController>(ClientesVentasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
