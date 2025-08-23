export interface JwtPayload {
  userId: number; // O el tipo correcto de tu ID de usuario
  email: string;
  role: string;
  // Puedes agregar otras propiedades que estén en tu payload
  iat?: number;
  exp?: number;
}
