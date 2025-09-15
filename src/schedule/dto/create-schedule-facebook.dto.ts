import { IsBoolean, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateScheduleFacebookDto {
  @IsUrl()
  post_url: string;

  @IsOptional()
  @IsString()
  title_post?: string;

  @IsOptional()
  @IsBoolean()
  liked?: boolean;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsInt()
  share_groups_count?: number;
}
