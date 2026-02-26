import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { PAYMENT_TYPES } from "@/infrastructure/di/types/payment";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import Stripe from "stripe";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { CreateCheckoutSessionDTO } from "@/application/dtos/payment/create-checkout-session.dto";
import { WebhookDTO } from "@/application/dtos/payment/webhook.dto";
import { MESSAGES } from "@/shared/constants/messages";

@injectable()
export class PaymentController {
    constructor(
        @inject(PAYMENT_TYPES.CreateCheckoutSessionUseCase) private readonly _createCheckoutSessionUseCase: IExecute<CreateCheckoutSessionDTO, Stripe.Checkout.Session>,
        @inject(PAYMENT_TYPES.HandleWebhookUseCase) private readonly _handleWebhookUseCase: IExecute<WebhookDTO, { received: boolean; eventType?: string }>
    ) { }

    /**
     * Creates a Stripe checkout session for a project.
     * @param req - Express request containing amount and metadata (projectId).
     * @param res - Express response object.
     * @returns JSON with the checkout session URL and ID.
     */
    async createCheckoutSession(req: Request, res: Response): Promise<Response> {
        try {
            const { amount, metadata, mode, priceId, planId, success_url, cancel_url, paymentType } = req.body;


            const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').trim();

            const metadataParams = metadata || {};
            const projectId = metadataParams.project_id || metadataParams.projectId || '';

            const userId = (req as Request & { user: { userId: string } }).user?.userId;
            const enhancedMetadata = { ...metadataParams, userId };

            let successUrl = success_url;
            let cancelUrl = cancel_url;

            if (!successUrl) {
                successUrl = mode === 'subscription'
                    ? `${baseUrl}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`
                    : `${baseUrl}/task-listing?projectId=${projectId}&session_id={CHECKOUT_SESSION_ID}`;
            }

            if (!cancelUrl) {
                cancelUrl = mode === 'subscription'
                    ? `${baseUrl}/subscription`
                    : `${baseUrl}/task-listing?projectId=${projectId}`;
            }

            const session = await this._createCheckoutSessionUseCase.execute({
                amount,
                metadata: enhancedMetadata,
                success_url: successUrl,
                cancel_url: cancelUrl,
                mode,
                priceId,
                planId,
                paymentType: paymentType || (mode === 'subscription' ? 'SUBSCRIPTION' : 'TASK_PAYMENT')
            });

            return successResponse(res, MESSAGES.PAYMENT.SUCCESS.CHECKOUT_SESSION_CREATED, {
                url: session.url,
                id: session.id,
            })

        } catch (error) {
            return errorResponse(res,
                MESSAGES.PAYMENT.ERROR.CHECKOUT_SESSION_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    /**
     * Handles Stripe webhooks for payment events.
     * @param req - Express request containing the webhook payload and signature.
     * @param res - Express response object.
     * @returns JSON confirmation of webhook receipt.
     */
    async handleWebhook(req: Request, res: Response): Promise<Response> {
        try {
            const signature = req.headers['stripe-signature'];

            if (!signature) {
                return errorResponse(res, MESSAGES.PAYMENT.ERROR.MISSING_SIGNATURE, ServerErrorStatus.INTERNAL_SERVER_ERROR);
            }

            const result = await this._handleWebhookUseCase.execute({
                payload: req.body,
                signature: signature as string
            });

            return successResponse(res, MESSAGES.PAYMENT.SUCCESS.WEBHOOK_RECEIVED, result);
        } catch (error) {
            return errorResponse(res, MESSAGES.PAYMENT.ERROR.WEBHOOK_FAILED, ServerErrorStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}