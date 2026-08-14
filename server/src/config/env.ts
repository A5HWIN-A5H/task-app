import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.MONGODB_URI) {
  throw new Error('CRITICAL ERROR: MONGODB_URI environment variable is missing!');
}

if (!process.env.JWT_SECRET) {
  throw new Error('CRITICAL ERROR: JWT_SECRET environment variable is missing!');
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI, // 
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET, // 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};