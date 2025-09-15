import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleFacebookDto } from './create-schedule-facebook.dto';

export class UpdateScheduleFacebookDto extends PartialType(
  CreateScheduleFacebookDto,
) {}
