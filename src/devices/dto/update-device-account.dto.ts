import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateDeviceAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
