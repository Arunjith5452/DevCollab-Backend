import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { ISubscription } from "@/infrastructure/db/interface/subscription.interface";
import { Document } from "mongoose";
import { IPersistenceMapper } from "@/infrastructure/mappers/interface/persistence-mapper.interface";
import { injectable } from "inversify";

@injectable()
export class SubscriptionPersistenceMapper implements IPersistenceMapper<SubscriptionEntity, ISubscription> {
    toMongo(entity: SubscriptionEntity): ISubscription {
        return {
            _id: entity.id,
            userId: entity.userId,
            plan: entity.plan,
            startDate: entity.startDate,
            endDate: entity.endDate,
            status: entity.status,
            stripeSubscriptionId: entity.stripeSubscriptionId,
            stripeCustomerId: entity.stripeCustomerId,
            paymentId: entity.paymentId
        } as unknown as ISubscription;
    }

    fromMongo(doc: ISubscription & Document): SubscriptionEntity {
        return SubscriptionEntity.create({
            id: doc._id.toString(),
            userId: doc.userId.toString(),
            plan: doc.plan as 'free' | 'pro',
            startDate: doc.startDate,
            endDate: doc.endDate,
            status: doc.status as 'active' | 'inactive' | 'cancelled' | 'expired',
            stripeSubscriptionId: doc.stripeSubscriptionId ?? undefined,
            stripeCustomerId: doc.stripeCustomerId ?? undefined,
            paymentId: doc.paymentId ?? undefined
        });
    }
}
