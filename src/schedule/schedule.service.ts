// 1. Librerías de Node.js

// 2. Librerías de terceros
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// 3. Librerías internas absolutas

// 4. Imports relativos
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleFacebookDto } from './dto/create-schedule-facebook.dto';
import { InteractionStatus } from './dto/facebook-interaction.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  // Crear interacción de Facebook
  async createInteractionFacebookData(
    interactionData: CreateScheduleFacebookDto,
    user_id: number,
  ) {
    const createData = { ...interactionData, user_id };

    return await this.prisma.scheduled_facebook_interaction.create({
      data: createData,
    });
  }

  //Crear interaccion de tiktok
  async create(interactionData: CreateScheduleDto, user_id: number) {
    const createData = { ...interactionData, user_id };

    return await this.prisma.scheduled_tiktok_interaction.create({
      data: createData,
    });
  }

  // Obtener todas la interacciones creadas
  async findAll(user_id: number) {
    const tiktok = await this.prisma.scheduled_tiktok_interaction.findMany({
      where: {
        user_id,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    const facebook = await this.prisma.scheduled_facebook_interaction.findMany({
      where: {
        user_id,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    return { tiktok, facebook };
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  async updateStatusScheduleFacebookInteraction(data: {
    status: InteractionStatus;
    id: number;
  }) {
    const { status, id } = data;

    return await this.prisma.scheduled_facebook_interaction.update({
      where: { id },
      data: { status },
    });
  }

  async updateStatusScheduleTiktokInteraction(data: {
    status: InteractionStatus;
    id: number;
  }) {
    const { status, id } = data;

    return await this.prisma.scheduled_tiktok_interaction.update({
      where: { id },
      data: { status },
    });
  }

  async editInteractionFacebookData(
    id: number,
    updateScheduledFacebookDto: UpdateScheduleDto,
  ) {
    const existing =
      await this.prisma.scheduled_facebook_interaction.findUnique({
        where: { id },
      });

    if (!existing) {
      throw new NotFoundException(`Registro con id ${id} no encontrado.`);
    }

    return await this.prisma.scheduled_facebook_interaction.update({
      where: { id },
      data: updateScheduledFacebookDto,
    });
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const existing = await this.prisma.scheduled_tiktok_interaction.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Registro con id ${id} no encontrado.`);
    }

    return await this.prisma.scheduled_tiktok_interaction.update({
      where: { id },
      data: updateScheduleDto,
    });
  }

  async deleteInteractionFacebookData(id: number) {
    const interaction =
      await this.prisma.scheduled_facebook_interaction.findUnique({
        where: { id },
      });

    if (!interaction) {
      throw new NotFoundException(`No se encontró la interacción con ID ${id}`);
    }

    return this.prisma.scheduled_facebook_interaction.delete({ where: { id } });
  }

  //eliminar datos
  async remove(id: number) {
    const interaction =
      await this.prisma.scheduled_tiktok_interaction.findUnique({
        where: { id },
      });

    if (!interaction) {
      throw new NotFoundException(`No se encontró la interacción con ID ${id}`);
    }

    return this.prisma.scheduled_tiktok_interaction.delete({ where: { id } });
  }
}
