import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientesDto } from './dto/create-clientes.dto';
import { UpdateClientesDto } from './dto/update-clientes.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateSalesDto } from './dto/create-sales.dto';
import { UpdateSalesDto } from './dto/update-sales.dto';

@Injectable()
export class ClientesVentasService {
  constructor(private prisma: PrismaService) {}

  async updateSale(id: number, updateSalesDto: UpdateSalesDto) {
    try {
      return await this.prisma.sale.update({
        where: { id },
        data: updateSalesDto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`No se encontró la venta con ID${id}`);
      }
      throw error;
    }
  }

  async createSale(createSaleDto: CreateSalesDto, user_id: number) {
    return await this.prisma.sale.create({
      data: { ...createSaleDto, user_id },
    });
  }

  // crear cliente
  async createClient(createClientesDto: CreateClientesDto, user_id: number) {
    try {
      return await this.prisma.client.create({
        data: { ...createClientesDto, user_id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `El CI ${createClientesDto.ci} ya esta registrado`,
        );
      }
      throw error;
    }
  }

  async findAllSales(user_id: number) {
    return this.prisma.sale.findMany({
      where: {
        OR: [
          { client: { user_id } }, // ventas con cliente
          { client_id: null, user_id },
        ], // ventas anónimas
      },
      include: {
        client: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async findAllClients(user_id: number) {
    return this.prisma.client.findMany({
      where: {
        user_id,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} clientesVenta`;
  }

  async updateClient(id: number, updateClientesDto: UpdateClientesDto) {
    try {
      return await this.prisma.client.update({
        where: { id },
        data: updateClientesDto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `El CI ${updateClientesDto.ci} ya esta registrado`,
        );
      }

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`No se encontró el cliente con ID${id}`);
      }
      throw error;
    }
  }

  removeClient(id: number) {
    try {
      return this.prisma.client.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`No se encontró el cliente con ID ${id}`);
      }
      throw error;
    }
  }
}
