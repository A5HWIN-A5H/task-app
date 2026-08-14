import request from 'supertest';
import app from '../src/app';

describe('Task API Integration Tests', () => {
  let token: string;
  let taskId: string;

  const validTask = {
    title: 'Test Task Validation',
    priority: 'HIGH',
    status: 'TODO',
  };

  beforeEach(async () => {
    const userRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Task User',
      email: 'taskuser@example.com',
      password: 'Password123!',
    });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'taskuser@example.com',
      password: 'Password123!',
    });

    token = loginRes.body.data.token;
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a task when authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(validTask);

      expect(res.status).toBe(201);
      expect(res.body.data.task.title).toBe(validTask.title);
      taskId = res.body.data.task._id; 
    });

    it('should return 401 when missing authentication token', async () => {
      const res = await request(app).post('/api/v1/tasks').send(validTask);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should retrieve tasks for the authenticated user', async () => {
      await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send(validTask);

      const res = await request(app).get('/api/v1/tasks').set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.tasks.length).toBeGreaterThan(0);
      expect(res.body.data.pagination).toBeDefined();
    });
  });

  describe('PATCH & DELETE /api/v1/tasks/:id', () => {
    let currentTaskId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(validTask);
      currentTaskId = res.body.data.task._id;
    });

    it('should update an existing task', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${currentTaskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'COMPLETED' });

      expect(res.status).toBe(200);
      expect(res.body.data.task.status).toBe('COMPLETED');
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/v1/tasks/${currentTaskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});