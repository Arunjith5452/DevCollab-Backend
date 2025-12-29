import { Request, Response, Router } from "express";
import express from "express";
import { container } from "@/infrastructure/di/inversify.di";
import { PaymentController } from "@/presentation/http/controllers/payment.controller";
import { validateDTO } from "../../middlewares/validate-dto.middlware";
import { CreateCheckoutSessionDTO } from "@/application/dtos/payment/create-checkout-session.dto";

const router = Router();

const paymentController = container.get(PaymentController)

router.post("/payment/checkout-session", validateDTO(CreateCheckoutSessionDTO), (req: Request, res: Response) => paymentController.createCheckoutSession(req, res))
router.post("/payment/webhook", express.raw({ type: 'application/json' }), (req: Request, res: Response) => paymentController.handleWebhook(req, res))

export { router as paymentRouter };
