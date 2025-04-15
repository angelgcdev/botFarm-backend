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
  async login(@Body() body: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.validateUser(body);

    if (!user) {
      throw new HttpException(
        'Credenciales invalidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    //Generar y devolver el token JWT
    return this.authService.login(user);
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
