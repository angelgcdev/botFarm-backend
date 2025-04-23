import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { device } from './dto/device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  //Metodo para marcar como completado el campo de la tabla dispositivos
  async marcarComoCompleto(dispositivoId: number, userId: number) {
    const dispositivo = await this.prisma.dispositivo.findUnique({
      where: { id: dispositivoId },
    });

    if (!dispositivo) {
      throw new NotFoundException('Dispositivo no encontrado');
    }

    //Para validar que el dispositivo  pertenezca al usuario
    if (dispositivo.usuario_id !== userId) {
      throw new ForbiddenException('No puedes modificar este dispositivo');
    }

    return this.prisma.dispositivo.update({
      where: { id: dispositivoId },
      data: {
        configuracion_completa: true,
      },
    });
  }

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

  async create(dto: CreateDeviceDto) {
    try {
      const { email, dispositivo_id, items } = dto;

      // 1. Insertar cuenta_google
      const cuentaGoogle = await this.prisma.cuenta_google.create({
        data: {
          dispositivo_id,
          email,
          status: 'ACTIVO',
        },
      });

      //2. Buscar IDs de las reds sociales por nombre
      const socialNetwork = await this.prisma.red_social.findMany({
        where: {
          name: {
            in: items,
          },
        },
      });

      //3. Crear entradas en cuenta_red_social
      const cuentaRedes = await this.prisma.$transaction(
        socialNetwork.map((red) =>
          this.prisma.cuenta_red_social.create({
            data: {
              red_social_id: red.id,
              cuenta_google_id: cuentaGoogle.id,
              username: null,
              status: 'ACTIVO',
            },
          }),
        ),
      );

      return {
        status: true,
        message: 'Dispositivo y redes sociales asociados correctamente.',
        cuentaGoogle,
        cuentaRedes,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message:
          'Hubo un problema al asociar las redes sociales. intenta de nuevo.',
      };
    }
  }

  findAll(usuario_id: number) {
    return this.prisma.dispositivo.findMany({
      where: {
        usuario_id,
      },
    });
  }

  //Modificar los datos del formulario del informacion adicional del dispositivo
  async findOne(dispositivo_id: number) {
    const cuentaGoogle = await this.prisma.cuenta_google.findFirst({
      where: { dispositivo_id },
      include: {
        cuenta_red_social: {
          include: {
            red_social: true,
          },
        },
      },
    });

    if (!cuentaGoogle) {
      return { cuentaGoogle: null };
    }

    return {
      cuentaGoogle,
      cuenta_red_social: cuentaGoogle.cuenta_red_social,
    };
  }

  //Actualizar informacion del dispositivo
  async update(dispositivo_id: number, updateDeviceDto: UpdateDeviceDto) {
    const cuentaGoogleExistente = await this.prisma.cuenta_google.findFirst({
      where: { dispositivo_id },
    });

    if (!cuentaGoogleExistente) {
      throw new NotFoundException('Cuenta de Google no encontrada.');
    }

    //1. Actualizar email
    await this.prisma.cuenta_google.update({
      where: { id: cuentaGoogleExistente.id },
      data: { email: updateDeviceDto.email },
    });

    //2. Eliminar redes anteriores y crear nuevas
    await this.prisma.cuenta_red_social.deleteMany({
      where: { cuenta_google_id: cuentaGoogleExistente.id },
    });

    const redes = await this.prisma.red_social.findMany({
      where: { name: { in: updateDeviceDto.items } },
    });

    //3. actualizar tabla cuenta_red_social
    await this.prisma.$transaction(
      redes.map((r) =>
        this.prisma.cuenta_red_social.create({
          data: {
            cuenta_google_id: cuentaGoogleExistente.id,
            red_social_id: r.id,
            username: null,
            status: 'ACTIVO',
          },
        }),
      ),
    );

    return {
      status: true,
      message: 'Información actualizada correctamente.',
    };
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
