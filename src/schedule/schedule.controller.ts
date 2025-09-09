// 1. Librerías de Node.js

// 2. Librerías de terceros
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// 3. Librerías internas absolutas

// 4. Imports relativos
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
import { CreateScheduleFacebookDto } from './dto/create-schedule-facebook.dto';
import { UpdateScheduledFacebookDto } from './dto/update-schedule-facebook.dto';

@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // Crear interacción de Facebook
  @Post('facebook-post')
  createInteractionFacebookData(
    @Req() req: Request,
    @Body() createScheduleFacebookDto: CreateScheduleFacebookDto,
  ) {
    const user = req.user as JwtPayload;
    return this.scheduleService.createInteractionFacebookData(
      createScheduleFacebookDto,
      user.userId,
    );
  }

  @Post()
  create(@Req() req: Request, @Body() createScheduleDto: CreateScheduleDto) {
    const user = req.user as JwtPayload;
    return this.scheduleService.create(createScheduleDto, user.userId);
  }

  // Obtener interacciones creadas
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.scheduleService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Patch('facebook-post-edit/:id')
  editInteractionFacebookData(
    @Param('id') id: string,
    @Body() updateScheduledFacebookDto: UpdateScheduledFacebookDto,
  ) {
    return this.scheduleService.editInteractionFacebookData(
      +id,
      updateScheduledFacebookDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete('facebook-post-delete/:id')
  deleteInteractionFacebookData(@Param('id') id: string) {
    return this.scheduleService.deleteInteractionFacebookData(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
