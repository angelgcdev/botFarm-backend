import { Response } from 'express';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './types/login-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const user = await this.authService.validateUser(credentials);

    if (!user) {
      throw new HttpException(
        'Credenciales invalidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    //Generar y devolver el token JWT
    return this.authService.login(user, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Post('register')
  async registerUser(@Body() body: CreateAuthDto) {
    return this.authService.registerUser(body);
  }

  @Get()
  findAllUsers() {
    return this.authService.findAllUsers();
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.updateUser(+id, updateAuthDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return this.authService.removeUser(+id);
  }
}
