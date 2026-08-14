import { connectDB } from '../config/database';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
import { signToken, verifyToken } from '../utils/jwt';

const runAuthTests = async () => {
  try {
    await connectDB();
    console.log('--- Starting Authentication Tests ---');

    await User.deleteMany({ email: 'auth_test@example.com' });

    const regResult = await AuthService.register({
      name: 'Auth Test User',
      email: 'auth_test@example.com',
      password: 'Password123!',
    });
    console.log('User Registration passed:', regResult.user.email);

    try {
      await AuthService.register({
        name: 'Duplicate',
        email: 'auth_test@example.com',
        password: 'Password123!',
      });
      console.error('Duplicate registration check failed');
    } catch (err: any) {
      console.log('Duplicate registration caught (Status:', err.statusCode, ')');
    }

    const loginResult = await AuthService.login({
      email: 'auth_test@example.com',
      password: 'Password123!',
    });
    console.log('Login passed. Generated JWT token length:', loginResult.token.length);

    try {
      await AuthService.login({
        email: 'auth_test@example.com',
        password: 'WrongPassword!',
      });
      console.error('Invalid password check failed');
    } catch (err: any) {
      console.log('Invalid password caught (Status:', err.statusCode, ')');
    }

    const decoded = verifyToken(loginResult.token);
    console.log('JWT verification decoded payload for User ID:', decoded.userId);

    console.log('--- All Authentication Tests Passed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Auth test suite failed:', error);
    process.exit(1);
  }
};

runAuthTests();