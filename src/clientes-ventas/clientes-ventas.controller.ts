import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClientesVentasService } from './clientes-ventas.service';
import { CreateClientesDto } from './dto/create-clientes.dto';
import { UpdateClientesDto } from './dto/update-clientes.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { Request } from 'express';
import { CreateSalesDto } from './dto/create-sales.dto';
import { UpdateSalesDto } from './dto/update-sales.dto';

@UseGuards(JwtAuthGuard)
@Controller('clientes-ventas')
export class ClientesVentasController {
  constructor(private readonly clientesVentasService: ClientesVentasService) {}

  @Patch('sales/:id')
  updateSale(@Param('id') id: string, @Body() updateSalesDto: UpdateSalesDto) {
    return this.clientesVentasService.updateSale(+id, updateSalesDto);
  }

  @Post('sales')
  createSale(@Req() req: Request, @Body() createClientesDto: CreateSalesDto) {
    const user = req.user as JwtPayload;
    return this.clientesVentasService.createSale(
      createClientesDto,
      user.userId,
    );
  }

  // Crear cliente
  @Post('clients')
  createClient(
    @Req() req: Request,
    @Body() createClientesDto: CreateClientesDto,
  ) {
    const user = req.user as JwtPayload;
    return this.clientesVentasService.createClient(
      createClientesDto,
      user.userId,
    );
  }

  @Get('sales')
  findAllSales(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.clientesVentasService.findAllSales(user.userId);
  }

  @Get('clients')
  findAllClients(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.clientesVentasService.findAllClients(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesVentasService.findOne(+id);
  }

  @Patch('clients/:id')
  updateClient(
    @Param('id') id: string,
    @Body() updateClientesDto: UpdateClientesDto,
  ) {
    return this.clientesVentasService.updateClient(+id, updateClientesDto);
  }

  @Delete('clients/:id')
  removeClient(@Param('id') id: string) {
    return this.clientesVentasService.removeClient(+id);
  }
}
