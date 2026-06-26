
import { injectable, inject } from "inversify";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { IPaymentService } from "@/application/interface/payment.service.interface";
import Stripe from "stripe";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { CreateCheckoutSessionDTO } from "@/application/dtos/payment/create-checkout-session.dto";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { ISubscriptionRepository } from "@/domain/repository/subscription.interface";
import { SUBSCRIPTION_TYPES } from "@/infrastructure/di/types/subscription";
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";

@injectable()
export class CreateCheckoutSessionUseCase implements IExecute<CreateCheckoutSessionDTO, Stripe.Checkout.Session> {
  constructor(
    @inject(COMMON_TYPES.PaymentService) private readonly _paymentService: IPaymentService,
    @inject(PLAN_TYPES.PlanRepository) private readonly _planRepository: IPlanRepository,
    @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository<SubscriptionEntity>
  ) { }

  async execute(dto: CreateCheckoutSessionDTO): Promise<Stripe.Checkout.Session> {
    try {
      let amount = dto.amount || 0;
      let mode = dto.mode || 'payment';
      let priceId = dto.priceId;
      let metadata = { ...dto.metadata };
      const paymentType = dto.paymentType;

      switch (paymentType) {
        case 'SUBSCRIPTION':
          if (!dto.planId) throw new Error("Plan ID is required for subscription");
          const plan = await this._planRepository.findById(dto.planId);
          if (!plan) throw new Error("Plan not found");

          amount = plan.price * 100;
          mode = 'payment';
          priceId = undefined;

          if (!plan.id) throw new Error("Plan ID is missing");
          metadata.planId = plan.id;
          metadata.durationInDays = plan.durationInDays.toString();
          metadata.productName = plan.name;
          metadata.productDescription = plan.description;
          metadata.type = 'plan_purchase';
          if (dto.metadata?.userId) {
            metadata.userId = dto.metadata.userId;
          }
          break;

        case 'TASK_PAYMENT':

          mode = 'payment';
          metadata.type = 'task_payment';
          break;

        default:
          if (dto.planId) {
            const plan = await this._planRepository.findById(dto.planId);
            if (plan) {
              amount = plan.price * 100;
              mode = 'payment';
              if (!plan.id) throw new Error("Plan ID is missing");
              metadata.planId = plan.id;
              metadata.durationInDays = plan.durationInDays.toString();
              metadata.productName = plan.name;
              metadata.productDescription = plan.description;
              metadata.type = 'plan_purchase';
              if (dto.metadata?.userId) {
                metadata.userId = dto.metadata.userId;
              }
            }
          }
          break;
      }

      if (metadata.type === 'plan_purchase' && amount === 0) {
        const userId = metadata.userId;
        if (!userId) throw new Error("User ID is required for free plan activation");

        const durationInDays = parseInt(metadata.durationInDays || '36500');
        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(startDate.getDate() + durationInDays);

        const existingSub = await this._subscriptionRepository.findByUserId(userId);

        if (existingSub) {
          if (!existingSub.id) throw new Error("Subscription ID is missing");
          await this._subscriptionRepository.updateSubscription(existingSub.id, {
            startDate,
            endDate,
            plan: metadata.productName,
            status: 'active'
          });
        } else {
          const newSub = SubscriptionEntity.create({
            userId,
            plan: metadata.productName || 'Free',
            startDate,
            endDate,
            status: 'active'
          });
          await this._subscriptionRepository.createSubscription(newSub);
        }

        return {
          id: 'free_plan_activation_' + Date.now(),
          url: dto.success_url,
        } as unknown as Stripe.Checkout.Session;
      }

      if (!dto.success_url || !dto.cancel_url) throw new Error("Success and cancel URLs are required");

      return await this._paymentService.createCheckoutSession(
        amount,
        dto.currency || 'inr',
        metadata,
        dto.success_url,
        dto.cancel_url,
        mode,
        priceId
      )

    } catch (error) {
      throw error
    }
  }
}