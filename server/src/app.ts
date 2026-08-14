import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import adminRoutes from './routes/admin.routes';
import taskRoutes from './routes/task.routes';

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === config.clientUrl || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;