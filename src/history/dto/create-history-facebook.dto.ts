import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HistoryStatus } from '@prisma/client';

export class CreateHistoryFacebookDto {
  @IsInt()
  device_id: number;

  @IsString()
  post_url: string;

  @IsOptional()
  @IsString()
  title_post?: string;

  @IsBoolean()
  liked: boolean;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @Type(() => Date) // transforma el input a Date si viene como string
  @IsDate()
  finished_at?: Date;

  @IsOptional()
  @IsEnum(HistoryStatus)
  status?: HistoryStatus;
}
