
import { injectable, inject } from "inversify";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { IPaymentService } from "@/application/interface/payment.service.interface";
import Stripe from "stripe";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { CreateCheckoutSessionDTO } from "@/application/dtos/payment/create-checkout-session.dto";


@injectable()
export class CreateCheckoutSessionUseCase implements IExecute<CreateCheckoutSessionDTO, Stripe.Checkout.Session> {
  constructor(
    @inject(COMMON_TYPES.PaymentService) private readonly _paymentService: IPaymentService
  ) { }

  async execute(dto: CreateCheckoutSessionDTO): Promise<Stripe.Checkout.Session> {
    try {

      return await this._paymentService.createCheckoutSession(
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