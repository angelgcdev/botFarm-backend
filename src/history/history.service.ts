import { Injectable } from '@nestjs/common';
// import { UpdateHistoryDto } from './dto/update-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { CreateHistoryFacebookDto } from './dto/create-history-facebook.dto';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  createFacebookSharedGroupsHistory(
    history_id: number,
    sharedGroups: string[],
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.prisma.facebook_shared_group.createMany({
      data: sharedGroups.map((group) => ({
        history_id,
        name: group,
      })),
    });
  }

  async createFacebookInteractionHistory(
    createHistoryDto: CreateHistoryFacebookDto,
  ) {
    return this.prisma.facebook_interaction_history.create({
      data: { ...createHistoryDto, finished_at: new Date() },
    });
  }

  async createTiktokInteractionHistory(createHistoryDto: CreateHistoryDto) {
    return this.prisma.tiktok_interaction_history.create({
      data: { ...createHistoryDto, finished_at: new Date() },
    });
  }

  tiktokCommentsCount(user_id: number) {
    return this.prisma.tiktok_interaction_history.count({
      where: {
        commented: {
          not: '',
        },
        device: {
          user_id,
        },
      },
    });
  }

  tiktokLikesCount(user_id: number) {
    return this.prisma.tiktok_interaction_history.count({
      where: {
        liked: true,
        device: {
          user_id,
        },
      },
    });
  }

  tiktokViewsCount(user_id: number) {
    return this.prisma.tiktok_interaction_history.aggregate({
      _sum: {
        total_views: true,
      },
      where: {
        device: {
          user_id,
        },
      },
    });
  }

  tiktokInteractionsCount(user_id: number) {
    return this.prisma.tiktok_interaction_history.count({
      where: {
        device: {
          user_id,
        },
      },
    });
  }

  // Obtener historial de Facebook de un usuario especifico
  async getFacebookHistory(user_id: number) {
    return await this.prisma.facebook_interaction_history.findMany({
      where: {
        device: {
          user_id: user_id,
        },
      },
      orderBy: {
        finished_at: 'desc',
      },
      include: {
        device: {
          // incluir info del dispositivo
          select: {
            id: true,
            udid: true,
            device_type: true,
            status: true,
            os_version: true,
            brand: true,
          },
        },
        facebook_shared_groups: true,
      },
    });
  }

  // Obtener historial de Tiktok de un usuario especifico
  async getTiktokHistory(user_id: number) {
    return await this.prisma.tiktok_interaction_history.findMany({
      where: {
        device: {
          user_id: user_id,
        },
      },
      orderBy: {
        finished_at: 'desc',
      },
      select: {
        id: true,
        username: true,
        total_views: true,
        liked: true,
        video_saved: true,
        commented: true,
        shared_on_facebook: true,
        video_url: true,
        status: true,
        finished_at: true,
        device_id: true,
        device: {
          // incluir info del dispositivo
          select: {
            id: true,
            udid: true,
            device_type: true,
            status: true,
            os_version: true,
            brand: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  // update(id: number, updateHistoryDto: UpdateHistoryDto) {
  //   return `This action updates a #${id} history`;
  // }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }
}
