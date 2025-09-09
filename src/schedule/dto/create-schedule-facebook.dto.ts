import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateScheduleFacebookDto {
  @IsString()
  post_url: string;

  @IsString()
  title_post?: string;

  @IsBoolean()
  liked?: boolean;

  @IsString()
  comment?: string;

  @IsInt()
  share_groups_count: number;
}
