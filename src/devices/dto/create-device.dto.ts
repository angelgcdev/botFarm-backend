import { IsEmail, IsArray, IsInt, IsEnum } from 'class-validator';
import { RedesSociales } from '@prisma/client';

export class CreateDeviceDto {
  @IsEmail()
  email: string;

  @IsInt()
  dispositivo_id: number;

  @IsArray()
  @IsEnum(RedesSociales, { each: true }) // <- Valida cada item como un enum válido
  items: RedesSociales[]; // redes sociales  como "tiktok", "facebook"
}
