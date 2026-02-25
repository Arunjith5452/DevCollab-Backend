import Stripe from 'stripe';
import { injectable } from 'inversify';
import { IPaymentService } from '@/application/interface/payment.service.interface';

@injectable()
export class StripeProvider implements IPaymentService {
    private stripe: Stripe;

    constructor() {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
        }
        this.stripe = new Stripe(secretKey, {
            apiVersion: '2025-12-15.clover',
        });
    }

    async createCheckoutSession(
        amount: number,
        currency: string = 'inr',
        metadata: Record<string, string>,
        successUrl: string,
        cancelUrl: string,
        mode: 'payment' | 'subscription' = 'payment',
        priceId?: string
    ): Promise<Stripe.Checkout.Session> {
        let line_items: Stripe.Checkout.SessionCreateParams.LineItem[];

        if (mode === 'subscription' && priceId) {
            line_items = [
                {
                    price: priceId,
                    quantity: 1,
                },
            ];
        } else {
            line_items = [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: metadata.productName || 'Task Advance Payment',
                            description: metadata.productDescription || metadata.task_title || 'Advance for freelance task',
                        },
                        unit_amount: Math.round(amount),
                    },
                    quantity: 1,
                },
            ];
        }

        return await this.stripe.checkout.sessions.create({
            mode: mode,
            line_items: line_items,
            metadata,
            success_url: successUrl,
            cancel_url: cancelUrl,
            payment_method_options: {
                card: {
                    request_three_d_secure: 'automatic',
                },
            },
        });
    }

    async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
        return await this.stripe.checkout.sessions.retrieve(sessionId);
    }

    async constructWebhookEvent(
        payload: string | Buffer,
        signature: string,
        webhookSecret: string
    ): Promise<Stripe.Event> {
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }

    async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    }
}