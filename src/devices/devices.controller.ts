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
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
// import { UpdateDeviceDto } from './dto/update-device.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { DeviceStatus } from './enum/device.enum';
import { UpdateDeviceAccountDto } from './dto/update-device-account.dto';
import { CreateSocialMediaAccountDto } from './dto/create-social-media-account.dto';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';

@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  //Actualizar cuenta de red social
  @Patch('edit-social-account/:id')
  editSocialAccount(
    @Param('id') id: string,
    @Body() body: UpdateSocialAccountDto,
  ) {
    return this.devicesService.editSocialAccount(+id, body);
  }

  //Eliminar cuenta de red social
  @Delete('social/:id')
  deleteSocialNetworkAccount(@Param('id') id: string) {
    return this.devicesService.deleteSocialNetworkAccount(+id);
  }

  // Añadir cuenta de red social
  @Post('social-media-account')
  addSocialMediaAccount(
    @Body() createSocialMediaAccount: CreateSocialMediaAccountDto,
  ) {
    return this.devicesService.addSocialMediaAccount(createSocialMediaAccount);
  }

  //Obtener redes sociales
  @Get('social-media')
  getSocialMediaData() {
    return this.devicesService.getSocialMediaData();
  }

  //Actualizar el correo del dispositivo
  @Patch(':id')
  editDeviceAccount(
    @Param('id') id: string,
    @Body() body: UpdateDeviceAccountDto,
  ) {
    return this.devicesService.editDeviceAccount(+id, body);
  }

  //Añadir informacion adicional en las tablas cuenta_google y cuenta_red_social
  @Post()
  addDeviceAccount(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.addDeviceAccount(createDeviceDto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    return await this.devicesService.findAll(payload.userId);
  }

  //Obtener los emails y redes sociales del dispositivo
  @Get(':id')
  getAccountsAndSocialMedia(
    @Param('id') deviceId: string,
    @Req() req: JwtPayload,
  ) {
    const userId = req.userId;
    return this.devicesService.getAccountsAndSocialMedia(+deviceId, userId);
  }

  // //Actualizar informacion del dispositivo
  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: CreateDeviceDto) {
  //   return this.devicesService.update(+id, dto);
  // }

  //Actualizar el estado de los dispositivos al hacer logout
  @Patch('logout')
  async updateAllStatus(
    @Req() req: Request,
    @Body() body: { status: DeviceStatus },
  ) {
    const payload = req.user as JwtPayload;
    return await this.devicesService.setAllDevicesToStatus(
      payload.userId,
      body.status,
    );
  }

  //
  @Delete('google/:id')
  deleteDeviceAccount(@Param('id') id: string) {
    return this.devicesService.deleteDeviceAccount(+id);
  }
}
