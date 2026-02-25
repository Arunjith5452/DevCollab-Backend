import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { Application } from 'express';

/**
 * Registers security and transport middlewares:
 * - CORS (origin, credentials, allowed methods)
 * - Cookie parser
 * - Response compression
 */
export function applyCorsAndSecurity(app: Application): void {
    app.use(
        cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        })
    );

    app.use(cookieParser());
    app.use(compression());
}
