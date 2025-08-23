import {
  ConflictException,
  // ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  //Metodo login
  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    //Buscar usuario en la base de datos
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(
        `Credenciales incorrectas`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload, { expiresIn: '24h' });

    return {
      user: { userId: user.id, email: user.email, role: user.role },
      accessToken: token,
    };
  }

  //Registro de usuario
  async registerUser(createAuthDto: CreateAuthDto) {
    try {
      //Generar un hash de la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...createAuthDto,
          password: hashedPassword,
        },
      });

      //Devolver el usuario sin la contraseña
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException(`Usuario ya existe.`, HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  findAllUsers() {
    return this.prisma.user.findMany();
  }

  // Modificar usuario
  async updateUser(id: number, userData: UpdateAuthDto) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    //Validar email unico
    if (userData.email) {
      const existing = await this.prisma.user.findFirst({
        where: {
          email: userData.email,
          NOT: { id }, // excluir al mismo usuario
        },
      });
      if (existing) {
        throw new ConflictException('Correo ya existe');
      }
    }

    //Hashear la nueva contraseña si es que se envio
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    } else {
      delete userData.password;
    }

    return this.prisma.user.update({
      where: { id },
      data: { ...userData, updated_at: new Date() },
    });
  }

  //Eliminar usuario
  removeUser(id: number) {
    try {
      return this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      throw error; // otros errores los dejaos que Nest los maneje como 500
    }
  }
}
