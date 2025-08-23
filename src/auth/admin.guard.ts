import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Primero valida el token con JwtAuthGuard
    const can = await super.canActivate(context);
    if (!can) return false;

    const request = context.switchToHttp().getRequest<{ user: JwtUser }>();
    const user = request.user;

    if (user.role !== 'ADMINISTRADOR') {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este recurso',
      );
    }

    return true;
  }
}
