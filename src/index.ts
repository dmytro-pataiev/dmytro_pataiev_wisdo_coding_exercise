import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import apiRoutes from './routes/index';
import { logger } from './utils/logger';
import { specs } from './swagger';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/book_management';

app.use(express.json());

app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/v1', apiRoutes);

app.use(errorHandler);

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', err);
  });

export default app;
