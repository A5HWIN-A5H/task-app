import request from 'supertest';
import app from '../src/app';

describe('Auth API Integration Tests', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  };

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(validUser);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(validUser.email);
      expect(res.body.data.user.passwordHash).toBeUndefined(); 
    });

    it('should return 400 for invalid email formatting', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        ...validUser,
        email: 'invalid-email',
      });
      
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 409 if email already exists', async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);
      const res = await request(app).post('/api/v1/auth/register').send(validUser);
      
      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);
    });

    it('should login successfully and return a JWT token', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: validUser.email,
        password: validUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: validUser.email,
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(401);
    });
  });
});