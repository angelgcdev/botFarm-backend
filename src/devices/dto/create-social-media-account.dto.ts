import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSocialMediaAccountDto {
  @IsNumber()
  social_network_id: number;

  @IsNumber()
  google_account_id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional() // Password es opcional
  password?: string;
}
