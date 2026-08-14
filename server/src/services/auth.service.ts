import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';

export class AuthService {
  static async register(input: RegisterInput): Promise<{ user: Partial<IUser> }> {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'USER',
      isActive: true,
    });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  static async login(input: LoginInput): Promise<{ token: string; user: Partial<IUser> }> {
    const user = await User.findOne({ email: input.email }).select('+passwordHash');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }
}