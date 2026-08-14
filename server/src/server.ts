import app from './app';
import { connectDB } from './config/database';
import { config } from './config/env';

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });
};

startServer();