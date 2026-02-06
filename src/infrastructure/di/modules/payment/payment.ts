import { ContainerModule } from "inversify";
import { StripeProvider } from "@/infrastructure/providers/stripe/stripe.provider";
import { PaymentController } from "@/presentation/http/controllers/payment.controller";
import { PaymentRepository } from "@/infrastructure/db/repository/implements/payment.repository";
import { PAYMENT_TYPES } from "../../types";
import { CreateCheckoutSessionUseCase } from "@/application/usecases/payment/implementations/create-checkout-session.usecase";
import { HandleWebhookUseCase } from "@/application/usecases/payment/implementations/handle-webhook.usecase";
import { paymentModel } from "@/infrastructure/db/models/payment.model";
import { Model } from "mongoose";
import { IPayment } from "@/infrastructure/db/interface/payment.interface";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { IPaymentService } from "@/application/interface/payment.service.interface";

export const PaymentModule = new ContainerModule(({ bind }) => {
    bind<StripeProvider>(PAYMENT_TYPES.StripeProvider).to(StripeProvider);
    bind<IPaymentService>(COMMON_TYPES.PaymentService).to(StripeProvider).inSingletonScope();
    bind<Model<IPayment>>("PaymentModel").toConstantValue(paymentModel)
    bind<CreateCheckoutSessionUseCase>(PAYMENT_TYPES.CreateCheckoutSessionUseCase).to(CreateCheckoutSessionUseCase);
    bind<HandleWebhookUseCase>(PAYMENT_TYPES.HandleWebhookUseCase).to(HandleWebhookUseCase);
    bind<PaymentController>(PAYMENT_TYPES.PaymentController).to(PaymentController);
    bind<PaymentRepository>(PAYMENT_TYPES.PaymentRepository).to(PaymentRepository);
});
