import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DashboardAdminService } from './dashboard-admin.service';
// import { CreateDashboardAdminDto } from './dto/create-dashboard-admin.dto';
// import { UpdateDashboardAdminDto } from './dto/update-dashboard-admin.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard-admin')
export class DashboardAdminController {
  constructor(private readonly dashboardAdminService: DashboardAdminService) {}

  // @Post()
  // create(@Body() createDashboardAdminDto: CreateDashboardAdminDto) {
  //   return this.dashboardAdminService.create(createDashboardAdminDto);
  // }

  @Get()
  findAll() {
    return this.dashboardAdminService.findAll();
  }

  @Get('total-tiktok-interactions')
  getTotalTiktokInteractions() {
    return this.dashboardAdminService.getTotalTiktokInteractions();
  }

  @Get('total-facebook-interactions')
  getTotalFacebookInteractions() {
    return this.dashboardAdminService.getTotalFacebookInteractions();
  }

  @Get('total-tiktok-views')
  getTotalTiktokViews() {
    return this.dashboardAdminService.getTotalTiktokViews();
  }

  @Get('total-tiktok-likes')
  getTotalTiktokLikes() {
    return this.dashboardAdminService.getTotalTiktokLikes();
  }

  @Get('total-facebook-likes')
  getTotalFacebookLikes() {
    return this.dashboardAdminService.getTotalFacebookLikes();
  }

  @Get('total-tiktok-comments')
  getTotalTiktokComments() {
    return this.dashboardAdminService.getTotalTiktokComments();
  }

  @Get('total-facebook-comments')
  getTotalFacebookComments() {
    return this.dashboardAdminService.getTotalFacebookComments();
  }

  @Get('total-tiktok-shares')
  getTotalTiktokShares() {
    return this.dashboardAdminService.getTotalTiktokShares();
  }

  @Get('total-facebook-shares')
  getTotalFacebookShares() {
    return this.dashboardAdminService.getTotalFacebookShares();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dashboardAdminService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDashboardAdminDto: UpdateDashboardAdminDto,
  // ) {
  //   return this.dashboardAdminService.update(+id, updateDashboardAdminDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dashboardAdminService.remove(+id);
  }
}
