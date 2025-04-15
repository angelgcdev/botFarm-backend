import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { device } from './dto/device.dto';

@Injectable()
export class SocketGatewayService {
  constructor(private readonly prisma: PrismaService) {}

  //Método para guardar el dispositivo
  async saveDevice(deviceData: device) {
    try {
      //Verifica si ya existe el dispositivo por su udid y el usuario_id
      const existingDevice = await this.prisma.dispositivo.findFirst({
        where: {
          udid: deviceData.udid,
          usuario_id: deviceData.usuario_id,
        },
      });

      if (existingDevice) {
        return existingDevice;
      }

      //Si no existe guardas el dispositivo en la base de datos
      const newDevice = await this.prisma.dispositivo.create({
        data: deviceData,
      });

      return newDevice;
    } catch (error) {
      console.error('Error guardando el dispositivo: ', error);

      throw new Error('Error al guardar el dispositivo');
    }
  }
}
