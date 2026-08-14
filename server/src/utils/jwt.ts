import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

export interface JwtPayload {
  userId: string;
  role: 'USER' | 'ADMIN';
}

export const signToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwt.secret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};