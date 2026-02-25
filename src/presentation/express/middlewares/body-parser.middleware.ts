import express, { Application } from 'express';

/**
 * Registers body parsing middlewares:
 * - Skips JSON parsing for Stripe webhook route (needs raw body for signature verification)
 * - Applies express.json() for all other routes
 */
export function applyBodyParsers(app: Application): void {
    app.use((req, res, next) => {
        if (req.originalUrl === '/api/payment/webhook') {
            // Raw body is handled directly in the payment router
            next();
        } else {
            express.json()(req, res, next);
        }
    });
}
