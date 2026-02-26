import express from 'express';
import { applyCorsAndSecurity } from '../middlewares/cors-security.middleware';
import { applyBodyParsers } from '../middlewares/body-parser.middleware';
import { appRouter } from '../router/index';
import { errorHandler } from '../middlewares/error-handler.middlware';

const app = express();

applyCorsAndSecurity(app);
applyBodyParsers(app);

app.use('/api', appRouter);

app.use(errorHandler);

export default app;