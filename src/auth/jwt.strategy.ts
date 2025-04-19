import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: number; // O el tipo correcto de tu ID de usuario
  email: string;
  // Puedes agregar otras propiedades que estén en tu payload
  iat?: number;
  exp?: number;
}

// Creamos el extractor con tipo explicito
const cookieExtractor: JwtFromRequestFunction = (
  req: Request,
): string | null => {
  const cookies = req?.cookies as { access_token?: string };
  return cookies?.access_token || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'secreto_super_seguro',
    });
  }

  validate(payload: JwtPayload) {
    // Este objeto estara disponible en req.user
    return { sub: payload.sub, email: payload.email };
  }
}
