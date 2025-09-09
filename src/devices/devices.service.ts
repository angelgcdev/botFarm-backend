import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Device } from './interface/device.interface';

import { DeviceStatus } from './enum/device.enum';
import { Prisma } from '@prisma/client';
import { UpdateDeviceAccountDto } from './dto/update-device-account.dto';
import { CreateSocialMediaAccountDto } from './dto/create-social-media-account.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';
import { CompleteConfig } from './dto/complete-config.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  // Método para actualizar la cuenta de la red social
  async updateCompleteConfig(id: number, updateDto: CompleteConfig) {
    try {
      const updated = await this.prisma.device.update({
        where: { id },
        data: updateDto,
      });

      return updated;
    } catch (error) {
      // Si no existe el registro
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Dispositivo con id ${id} no encontrada`);
      }
      throw new BadRequestException(
        'No se pudo actualizar la cuenta de red social',
      );
    }
  }

  // Método para actualizar la cuenta de la red social
  async editSocialAccount(id: number, updateDto: UpdateSocialAccountDto) {
    try {
      const updated = await this.prisma.social_network_account.update({
        where: { id },
        data: updateDto,
      });

      return updated;
    } catch (error) {
      // Si no existe el registro
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Cuenta con id ${id} no encontrada`);
      }
      throw new BadRequestException(
        'No se pudo actualizar la cuenta de red social',
      );
    }
  }

  //Eliminar cuenta de red social
  async deleteSocialNetworkAccount(id: number) {
    try {
      return await this.prisma.social_network_account.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // Prisma error: Record to delete does not exist.
        throw new NotFoundException(
          `Cuenta de red social con ID ${id} no existe`,
        );
      }
      throw error;
    }
  }

  //Crear cuenta de red social
  async addSocialMediaAccount(
    createSocialMediaAccount: CreateSocialMediaAccountDto,
  ) {
    try {
      const socialNetworkAccount =
        await this.prisma.social_network_account.create({
          data: {
            ...createSocialMediaAccount,
            status: 'ACTIVO',
          },
        });

      return socialNetworkAccount;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Username duplicado para esta red social. Cambia el username y vuelve a intentar.',
        );
      }
      throw error;
    }
  }

  //Obtener redes sociales
  getSocialMediaData() {
    return this.prisma.social_network.findMany();
  }

  // Método para actualizar el correo del dispositivo
  async editDeviceAccount(id: number, updateDto: UpdateDeviceAccountDto) {
    try {
      const updated = await this.prisma.google_account.update({
        where: { id },
        data: { email: updateDto.email },
      });

      return updated;
    } catch (error) {
      // Si no existe el registro
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Cuenta con id ${id} no encontrada`);
      }
      throw new BadRequestException('No se pudo actualizar el correo');
    }
  }

  //Método para guardar el dispositivo
  async saveDevice(deviceData: Device) {
    //Verifica si ya existe el dispositivo por su udid y el usuario_id
    const existingDevice = await this.prisma.device.findFirst({
      where: {
        udid: deviceData.udid,
        user_id: deviceData.user_id,
      },
    });

    if (existingDevice) {
      throw new BadRequestException('El dispositivo ya existe');
    }

    //Si no existe guardas el dispositivo en la base de datos
    return await this.prisma.device.create({
      data: deviceData,
    });
  }

  //Metodo para actualizar el estado del dispositivo
  async updateStatusAndConnectionDevice(
    udid: string,
    user_id: number,
    newStatus: DeviceStatus,
    connected_at?: Date,
    last_activity?: Date,
  ) {
    console.log('AQUI:', udid);

    const device = await this.prisma.device.findFirst({
      where: { udid, user_id },
    });

    if (!device) {
      throw new NotFoundException('Dispositivo no encontrado');
    }

    return this.prisma.device.update({
      where: { id: device.id },
      data: {
        status: newStatus,
        ...(connected_at && { connected_at }),
        ...(last_activity && { last_activity }),
      },
    });
  }

  //Método para actualizar el estado de todos los dispositivos de un usuario
  setAllDevicesToStatus(user_id: number, status: DeviceStatus) {
    return this.prisma.device.updateMany({
      where: { user_id },
      data: { status },
    });
  }

  // Completar informacion del dispositivo
  async addDeviceAccount(data: CreateDeviceDto) {
    const { email, device_id } = data;

    try {
      // 1. Añadir cuenta_google del dispositivo
      const googleAccount = await this.prisma.google_account.create({
        data: {
          device_id,
          email,
          status: 'ACTIVO',
        },
      });

      // //2. Marcar como completado en la tabla device
      // await this.prisma.device.update({
      //   where: { id: device_id },
      //   data: {
      //     complete_config: true,
      //   },
      // });

      return googleAccount;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Este correo ya está registrado en este dispositivo. Intenta con otro.',
        );
      }
      throw error;
    }
  }

  //actualizar los datos antes de Obtener datos "device → google_accounts → social_network_accounts"
  async getAllDevicesWithConfig(user_id: number) {
    const devices = await this.prisma.$transaction(async (tx) => {
      // 1. Buscar dispositivos del usuario que cumplen la condición
      const completeDevices = await tx.device.findMany({
        where: {
          user_id,
          google_accounts: {
            some: {
              social_network_accounts: {
                some: {}, //al menos una red social registrada
              },
            },
          },
        },
      });

      const completeIds = completeDevices.map((d) => d.id);

      //2. Actualizar solo con los dispositivos obtenidos en completeIds
      await tx.device.updateMany({
        where: { id: { in: completeIds }, user_id },
        data: { complete_config: true },
      });

      // 3. Los demás -> false
      await tx.device.updateMany({
        where: { id: { notIn: completeIds }, user_id },
        data: { complete_config: false },
      });

      //4. Retornar todos los dispositivos con las relaciones anidadas
      return await tx.device.findMany({
        where: {
          user_id,
        },
        include: {
          google_accounts: {
            include: {
              social_network_accounts: {
                select: {
                  id: true,
                  social_network_id: true,
                  google_account_id: true,
                  username: true,
                  status: true,
                  created_at: true,
                },
              },
            },
          },
        },
      });
    });

    if (devices.length === 0) {
      throw new NotFoundException('No se encontraron dispositivos');
    }

    return devices;
  }

  //Obtener informacion del dispositivo
  async getAccountsAndSocialMedia(device_id: number, user_id: number) {
    const accounts = await this.prisma.google_account.findMany({
      where: {
        device: {
          id: device_id,
          user_id: user_id,
        },
      },
      include: {
        social_network_accounts: {
          include: { social_network: true },
        },
      },
    });

    if (!accounts) {
      throw new NotFoundException(
        `No se encontró una cuenta Google para el dispositivo con ID ${device_id}`,
      );
    }

    return accounts;
  }

  // Metodo para obtener el device_id con el udid y el user_id
  async findDeviceIdByUdidAndUserId(
    udid: string,
    user_id: number,
  ): Promise<number> {
    const device = await this.prisma.device.findFirst({
      where: { udid, user_id },
      select: { id: true },
    });

    console.log('device_id service:', device);

    if (!device) {
      throw new NotFoundException('Dispositivo no encontrado');
    }

    return device.id;
  }

  async deleteDeviceAccount(id: number) {
    try {
      return await this.prisma.google_account.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // Prisma error: Record to delete does not exist.
        throw new NotFoundException(`Google Account con ID ${id} no existe`);
      }
      throw error;
    }
  }
}
