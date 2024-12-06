import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.config.js';
import logger from './lib/winston/logger.js';
import errorHandler from './middlewares/error-handler.middleware.js';
import { APP_BASE_URL, APP_PORT } from './configs/env.config.js';

import expressJSDocSwagger from 'express-jsdoc-swagger';
import swaggerConfig from './configs/swagger.config.js';

import userRouter from './routes/user.route.js';
import adminRouter from './routes/admin.route.js';
import bookingRouter from './routes/booking.route.js';

const app = express();

expressJSDocSwagger(app)(swaggerConfig);

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/admins', adminRouter);
app.use('/api/users', userRouter);
app.use('/api/bookings', bookingRouter);

app.use(errorHandler);

app.listen(APP_PORT, () => {
  logger.info(`Server is running on ${APP_BASE_URL}${APP_PORT}`);
});
