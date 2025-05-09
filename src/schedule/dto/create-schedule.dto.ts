import { IsBoolean, IsEmail, IsInt, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsEmail()
  video_url: string;

  @IsInt()
  views_count: number;

  @IsBoolean()
  liked: boolean;

  @IsBoolean()
  saved: boolean;

  @IsString()
  comment?: string;
}
