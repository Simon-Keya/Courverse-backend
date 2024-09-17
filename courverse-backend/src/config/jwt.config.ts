export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'supersecretkey',
  expiresIn: process.env.JWT_EXPIRES_IN || '3600s', // 1 hour expiration
};
