import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export type InteractionStatus =
  | 'PENDIENTE'
  | 'EN_PROGRESO'
  | 'COMPLETADA'
  | 'FALLIDA'
  | 'CANCELADO';

export class FacebookInteractionDto {
  @IsInt()
  id: number;

  @IsInt()
  user_id: number;

  @IsString()
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

  @IsInt()
  share_groups_count: number;

  @IsOptional()
  @IsString()
  created_at?: string;

  @IsOptional()
  @IsString()
  updated_at?: string;

  @IsOptional()
  @IsString()
  status?: InteractionStatus;
}
