import { injectable, inject } from "inversify";
import { PAYMENT_TYPES } from "@/infrastructure/di/types/payment";
import { StripeProvider } from "@/infrastructure/providers/stripe/stripe.provider";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { WebhookDTO } from "@/application/dtos/payment/webhook.dto";
import Stripe from "stripe";

@injectable()
export class HandleWebhookUseCase implements IExecute<WebhookDTO, { received: boolean; eventType?: string }> {
    constructor(
        @inject(PAYMENT_TYPES.StripeProvider) private readonly _stripeProvider: StripeProvider
    ) { }

    async execute(dto: WebhookDTO): Promise<{ received: boolean; eventType?: string }> {
        try {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

            if (!webhookSecret) {
                throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
            }

            if (!dto.payload || !dto.signature) {
                throw new Error('Missing required webhook parameters: payload and signature');
            }

            let event: Stripe.Event;

            try {
                event = await this._stripeProvider.constructWebhookEvent(
                    dto.payload,
                    dto.signature,
                    webhookSecret
                );
            } catch (err: any) {
                console.error('Webhook signature verification failed:', err.message);
                throw new Error(`Webhook Error: ${err.message}`);
            }

            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object as Stripe.Checkout.Session;
                    console.log('Checkout session completed:', session.id);
                    console.log('Payment status:', session.payment_status);
                    console.log('Metadata:', session.metadata);

                    break;

                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    console.log('Payment intent succeeded:', paymentIntent.id);
                    break;

                case 'payment_intent.payment_failed':
                    const failedPayment = event.data.object as Stripe.PaymentIntent;
                    console.log('payment failed:', failedPayment.id);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            return { received: true, eventType: event.type };

        } catch (error) {
            throw error
        }

    }
}