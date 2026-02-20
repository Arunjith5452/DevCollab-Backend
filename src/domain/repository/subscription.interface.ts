import { SubscriptionWithUserDTO } from "@/application/dtos/admin/subscription.dto";
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface ISubscriptionRepository<T> extends IBaseRepository<T> {
    findByUserId(userId: string): Promise<T | null>;
    findByStripeSubscriptionId(subscriptionId: string): Promise<T | null>;
    createSubscription(subscription: SubscriptionEntity): Promise<T>;
    updateSubscription(id: string, subscription: Partial<SubscriptionEntity>): Promise<T | null>;
    findAllWithUserInfo(page: number, limit: number, status?: string, search?: string): Promise<{ data: SubscriptionWithUserDTO[], total: number }>;
}
