import { Injectable } from '@nestjs/common';
// import { CreateDashboardAdminDto } from './dto/create-dashboard-admin.dto';
// import { UpdateDashboardAdminDto } from './dto/update-dashboard-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardAdminService {
  constructor(private prisma: PrismaService) {}

  // create(createDashboardAdminDto: CreateDashboardAdminDto) {
  //   return 'This action adds a new dashboardAdmin';
  // }

  findAll() {
    return `This action returns all dashboardAdmin`;
  }

  getTotalTiktokInteractions() {
    return this.prisma.tiktok_interaction_history.count({
      where: {
        NOT: [{ status: 'FALLIDA' }],
      },
    });
  }

  getTotalFacebookInteractions() {
    return this.prisma.facebook_interaction_history.count({
      where: {
        NOT: [{ status: 'FALLIDA' }],
      },
    });
  }

  getTotalTiktokViews() {
    return this.prisma.tiktok_interaction_history.aggregate({
      _sum: {
        total_views: true,
      },
    });
  }

  getTotalTiktokLikes() {
    return this.prisma.tiktok_interaction_history.count({
      where: {
        liked: true,
      },
    });
  }

  getTotalFacebookLikes() {
    return this.prisma.facebook_interaction_history.count({
      where: {
        liked: true,
      },
    });
  }

  getTotalTiktokComments() {
    return this.prisma.tiktok_interaction_history.count({
      where: {
        NOT: [{ commented: null }, { commented: '' }],
      },
    });
  }

  getTotalFacebookComments() {
    return this.prisma.facebook_interaction_history.count({
      where: {
        NOT: [{ comment: null }, { comment: '' }],
      },
    });
  }

  getTotalTiktokShares() {
    return this.prisma.tiktok_interaction_history.count({
      where: {
        shared_on_facebook: true,
      },
    });
  }

  getTotalFacebookShares() {
    return this.prisma.facebook_shared_group.count({});
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboardAdmin`;
  }

  // update(id: number, updateDashboardAdminDto: UpdateDashboardAdminDto) {
  //   return `This action updates a #${id} dashboardAdmin`;
  // }

  remove(id: number) {
    return `This action removes a #${id} dashboardAdmin`;
  }
}
