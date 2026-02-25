import { ContainerModule } from "inversify";
import { SUBSCRIPTION_TYPES } from "../../types/subscription";
import { ISubscriptionRepository } from "@/domain/repository/subscription.interface";
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { SubscriptionRepository } from "@/infrastructure/db/repository/implements/subscription.repository";

import { SubscriptionPersistenceMapper } from "@/infrastructure/mappers/subscription-persistence.mapper";

export const subscriptionModule = new ContainerModule(({ bind }) => {
    bind<ISubscriptionRepository<SubscriptionEntity>>(SUBSCRIPTION_TYPES.SubscriptionRepository).to(SubscriptionRepository);
    bind<SubscriptionPersistenceMapper>(SUBSCRIPTION_TYPES.SubscriptionPersistenceMapper).to(SubscriptionPersistenceMapper);
});
