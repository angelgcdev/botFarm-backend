import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSocialAccountDto {
  @IsNumber()
  social_network_id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional() // Password es opcional
  password?: string;
}
