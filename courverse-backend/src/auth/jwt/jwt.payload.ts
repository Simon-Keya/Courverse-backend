import { UserRole } from '../../users/entities/user.entity';

export interface JwtPayload {
  sub: string; // User UUID
  username: string;
  email: string;
  role: UserRole;
}
