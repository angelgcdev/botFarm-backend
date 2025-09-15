import { IsBoolean, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateScheduleDto {
  @IsUrl()
  video_url: string;

  @IsOptional()
  @IsInt()
  views_count?: number;

  @IsOptional()
  @IsBoolean()
  liked?: boolean;

  @IsOptional()
  @IsBoolean()
  saved?: boolean;

  @IsOptional()
  @IsBoolean()
  shared_on_facebook?: boolean;

  @IsOptional()
  @IsString()
  comment?: string;
}
