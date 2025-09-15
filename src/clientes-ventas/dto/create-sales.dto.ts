import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum ClientOrigin {
  TIKTOK = 'TIKTOK',
  FACEBOOK = 'FACEBOOK',
  RECOMENDACION = 'RECOMENDACION',
  OTRO = 'OTRO',
}

export class CreateSalesDto {
  @IsOptional()
  @IsNumber()
  client_id?: number;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsEnum(ClientOrigin, {
    message:
      'Debe seleccionar una opción válida: TIKTOK, FACEBOOK, RECOMENDACION u OTRO',
  })
  client_origin: ClientOrigin;
}
