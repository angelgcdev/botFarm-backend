import { usuario } from '@prisma/client';

export type User = Omit<usuario, 'password'>;
