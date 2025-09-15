import { Injectable } from '@nestjs/common';
// import { CreateDashboardDto } from './dto/create-dashboard.dto';
// import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // create(createDashboardDto: CreateDashboardDto) {
  //   return 'This action adds a new dashboard';
  // }

  getTotalFacebookCommentsForPersonal(user_id: number) {
    return this.prisma.facebook_interaction_history.count({
      where: {
        device: { user_id },
        NOT: [{ comment: null }, { comment: '' }],
      },
    });
  }

  getTotalFacebookSharesForPersonal(user_id: number) {
    return this.prisma.facebook_shared_group.count({
      where: {
        facebook_interaction_history: {
          device: { user_id },
        },
      },
    });
  }

  getTotalFacebookLikesForPersonal(user_id: number) {
    return this.prisma.facebook_interaction_history.count({
      where: {
        device: { user_id },
        liked: true,
      },
    });
  }

  getTotalFacebookInteractionsForPersonal(user_id: number) {
    return this.prisma.facebook_interaction_history.count({
      where: {
        device: { user_id },
      },
    });
  }

  getTotalTiktokSharesForPersonal(user_id: number) {
    return this.prisma.tiktok_interaction_history.count({
      where: {
        device: { user_id },
        shared_on_facebook: true,
      },
    });
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  // update(id: number, updateDashboardDto: UpdateDashboardDto) {
  //   return `This action updates a #${id} dashboard`;
  // }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
