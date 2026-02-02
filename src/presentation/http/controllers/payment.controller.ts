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
        console.log("reached")
        try {
            const { amount, metadata } = req.body;

            console.log("payment controllet:", req.body)

            const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').trim();

            const session = await this._createCheckoutSessionUseCase.execute({
                amount,
                metadata,
                success_url: `${baseUrl}/create-task?projectId=${metadata.project_id}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${baseUrl}/task-listing?projectId=${metadata.project_id}`,
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