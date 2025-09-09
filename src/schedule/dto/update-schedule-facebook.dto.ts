// create-scheduled-facebook-interaction.dto.ts
import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { InteractionStatus } from '@prisma/client'; // asumiendo que tu enum está en Prisma

export class UpdateScheduledFacebookDto {
  // @IsInt()
  // user_id: number;

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

  @IsOptional()
  @IsEnum(InteractionStatus)
  status?: InteractionStatus;
}
