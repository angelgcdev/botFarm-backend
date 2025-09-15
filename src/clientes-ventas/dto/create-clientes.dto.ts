import { IsString } from 'class-validator';

export class CreateClientesDto {
  @IsString()
  name?: string;

  @IsString()
  ci: string;

  @IsString()
  phone?: string;

  @IsString()
  email?: string;

  @IsString()
  city?: string;
}
