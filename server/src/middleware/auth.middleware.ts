import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { User, IUser } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication required. Missing Bearer token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Malformed authorization header');
    }

    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Session expired. Please log in again');
      }
      throw ApiError.unauthorized('Invalid authentication token');
    }

    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      throw ApiError.unauthorized('User associated with token no longer exists');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account has been deactivated. Please contact support');
    }

    req.user = user;
    next();
  }
);