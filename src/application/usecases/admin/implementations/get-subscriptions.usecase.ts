import { injectable, inject } from "inversify";
import { SubscriptionWithUserDTO } from "@/application/dtos/admin/subscription.dto";
import { GetSubscriptionsQueryDTO } from "@/application/dtos/admin/get-subscriptions.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { SUBSCRIPTION_TYPES } from "@/infrastructure/di/types/subscription"; // Changed to SUBSCRIPTION_TYPES
import { ISubscriptionRepository } from "@/domain/repository/subscription.interface"; // Changed to ISubscriptionRepository
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { plainToInstance } from "class-transformer";


@injectable()
export class GetAllSubscriptionsUseCase implements IExecute<GetSubscriptionsQueryDTO, { subscriptions: SubscriptionWithUserDTO[], total: number }> {
    constructor(
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository<SubscriptionEntity>
    ) { }

    async execute(query: GetSubscriptionsQueryDTO): Promise<{ subscriptions: SubscriptionWithUserDTO[], total: number }> {
        const { page, limit, search, status } = query;

        const result = await this._subscriptionRepository.findAllWithUserInfo(page, limit, status, search);

        return {
            subscriptions: plainToInstance(SubscriptionWithUserDTO, result.data),
            total: result.total
        };
    }
}
