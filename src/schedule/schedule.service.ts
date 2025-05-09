// 1. Librerías de Node.js

// 2. Librerías de terceros
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// 3. Librerías internas absolutas
import { device, InteractionStatus } from '@prisma/client';

// 4. Imports relativos
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleTiktokDTO } from '../socket-gateway/dto/schedule-tiktok.dto';

type IdRelations = {
  device_id: number;
  device_scheduled_tiktok_interaction_id: number;
  udid: string;
};

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async updateStatusDeviceScheduleTiktok(data: {
    idRelations: IdRelations;
    status: InteractionStatus;
    history: any;
  }) {
    const { idRelations, status } = data;

    await this.prisma.device_scheduled_tiktok_interaction.update({
      where: { id: idRelations.device_scheduled_tiktok_interaction_id },
      data: { status },
    });
  }

  //Guardar datos en la tabla scheduled_tiktok_interaction y device_scheduled_tiktok_interaction
  async saveScheduleTiktokInteractionWithDevices(
    scheduledTiktokData: ScheduleTiktokDTO,
    activeDevices: Array<device>,
  ) {
    const { video_url, views_count, comment, items } = scheduledTiktokData;

    const liked = items.includes('liked');
    const saved = items.includes('saved');

    return await this.prisma.$transaction(async (tx) => {
      // 1. Insertar la interacción programada de tiktok
      const scheduledInteraction = await tx.scheduled_tiktok_interaction.create(
        {
          data: {
            video_url,
            views_count,
            comment,
            liked,
            saved,
          },
        },
      );

      // 2. Asociar cada dispositivo con la interaccion programada
      const deviceInteractionData = activeDevices.map((device) => ({
        device_id: device.id,
        scheduled_tiktok_interaction_id: scheduledInteraction.id,
      }));

      // 3. Crear los registros para la tabla device_scheduled_tiktok_interaction una por una para obtener los IDs
      const createdDeviceInteractions = await Promise.all(
        deviceInteractionData.map((entry) =>
          tx.device_scheduled_tiktok_interaction.create({
            data: entry,
          }),
        ),
      );

      // 4. Retornar los IDs de la tabla device_scheduled_tiktok_interaction
      return createdDeviceInteractions.map((registro) => {
        const matchedDevice = activeDevices.find(
          (device) => device.id === registro.device_id,
        );
        return {
          device_id: registro.device_id,
          device_scheduled_tiktok_interaction_id: registro.id,
          udid: matchedDevice?.udid || null,
        };
      });
    });
  }

  create(interactionData: CreateScheduleDto) {
    return 'This action adds a new schedule';
  }

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
