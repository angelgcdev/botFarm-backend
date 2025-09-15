import { Test, TestingModule } from '@nestjs/testing';
import { ClientesVentasService } from './clientes-ventas.service';

describe('ClientesVentasService', () => {
  let service: ClientesVentasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientesVentasService],
    }).compile();

    service = module.get<ClientesVentasService>(ClientesVentasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
