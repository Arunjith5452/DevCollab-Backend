
import { Stripe } from "stripe";

export interface IPaymentService {
    createCheckoutSession(
        amount: number,
        currency: string,
        metadata: Record<string, string>,
        successUrl: string,
        cancelUrl: string
    ): Promise<Stripe.Checkout.Session>;

    retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;

    constructWebhookEvent(
        payload: string | Buffer,
        signature: string,
        webhookSecret: string
    ): Promise<Stripe.Event>;

    retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
}
