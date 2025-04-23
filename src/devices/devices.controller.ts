import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
// import { UpdateDeviceDto } from './dto/update-device.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  //Añadir informacion adicional en las tablas cuenta_google y cuenta_red_social
  @Post('complete-info')
  async create(@Body() createDeviceDto: CreateDeviceDto) {
    const res = await this.devicesService.create(createDeviceDto);
    console.log(res);
    return res;
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as JwtPayload;
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.devicesService.findAll(user.sub);
  }

  //Modificar los datos del formulario del informacion adicional del dispositivo
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(+id);
  }

  //Actualizar el campo completar_info en la tabla dispositivos
  @Patch(':id/complete')
  completarInfo(@Param('id') id: string, @Req() req: Request) {
    const dispositivoId = Number(id);

    const userId = req.user as JwtPayload;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.devicesService.marcarComoCompleto(dispositivoId, userId.sub);
  }

  //Actualizar informacion del dispositivo
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateDeviceDto) {
    return this.devicesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devicesService.remove(+id);
  }
}
