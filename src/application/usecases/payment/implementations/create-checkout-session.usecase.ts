
import { injectable, inject } from "inversify";
import { PAYMENT_TYPES } from "@/infrastructure/di/types/payment";
import { StripeProvider } from "@/infrastructure/providers/stripe/stripe.provider";
import Stripe from "stripe";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { CreateCheckoutSessionDTO } from "@/application/dtos/payment/create-checkout-session.dto";


@injectable()
export class CreateCheckoutSessionUseCase implements IExecute<CreateCheckoutSessionDTO, Stripe.Checkout.Session> {
  constructor(
    @inject(PAYMENT_TYPES.StripeProvider) private readonly _stripeProvider: StripeProvider
  ) { }

  async execute(dto: CreateCheckoutSessionDTO): Promise<Stripe.Checkout.Session> {
    try {

      return await this._stripeProvider.createCheckoutSession(
        dto.amount!,
        dto.currency || 'inr',
        dto.metadata!,
        dto.success_url!,
        dto.cancel_url!
      )

    } catch (error) {
      throw error
    }
  }
}