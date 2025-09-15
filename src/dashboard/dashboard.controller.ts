import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
// import { CreateDashboardDto } from './dto/create-dashboard.dto';
// import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // @Post()
  // create(@Body() createDashboardDto: CreateDashboardDto) {
  //   return this.dashboardService.create(createDashboardDto);
  // }

  @Get('total-facebook-comments')
  getTotalFacebookCommentsForPersonal(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    return this.dashboardService.getTotalFacebookCommentsForPersonal(
      payload.userId,
    );
  }

  @Get('total-facebook-shares')
  getTotalFacebookSharesForPersonal(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    return this.dashboardService.getTotalFacebookSharesForPersonal(
      payload.userId,
    );
  }

  @Get('total-facebook-likes')
  getTotalFacebookLikesForPersonal(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    return this.dashboardService.getTotalFacebookLikesForPersonal(
      payload.userId,
    );
  }

  @Get('total-facebook-interactions')
  getTotalFacebookInteractionsForPersonal(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    return this.dashboardService.getTotalFacebookInteractionsForPersonal(
      payload.userId,
    );
  }

  @Get('total-tiktok-shares')
  getTotalTiktokSharesForPersonal(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    return this.dashboardService.getTotalTiktokSharesForPersonal(
      payload.userId,
    );
  }

  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dashboardService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDashboardDto: UpdateDashboardDto,
  // ) {
  //   return this.dashboardService.update(+id, updateDashboardDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dashboardService.remove(+id);
  }
}
