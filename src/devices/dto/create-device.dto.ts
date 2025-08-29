import { IsEmail, IsInt } from 'class-validator';

export class CreateDeviceDto {
  @IsEmail()
  email: string;

  @IsInt()
  device_id: number;
}
