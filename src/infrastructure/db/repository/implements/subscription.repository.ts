import { BaseRepository } from "./base.repository";
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { ISubscriptionRepository } from "@/domain/repository/subscription.interface";
import { SubscriptionWithUserDTO } from "@/application/dtos/admin/subscription.dto";
import { inject, injectable } from "inversify";
import { Document, FilterQuery, Model, PipelineStage } from "mongoose";
import { SubscriptionModel } from "../../models/subscription.model";
import { ISubscription } from "@/infrastructure/db/interface/subscription.interface";
import { SUBSCRIPTION_TYPES } from "@/infrastructure/di/types/subscription";
import { SubscriptionPersistenceMapper } from "@/infrastructure/mappers/subscription-persistence.mapper";

@injectable()
export class SubscriptionRepository extends BaseRepository<SubscriptionEntity, ISubscription> implements ISubscriptionRepository<SubscriptionEntity> {
    constructor(
        @inject(SUBSCRIPTION_TYPES.SubscriptionPersistenceMapper) mapper: SubscriptionPersistenceMapper
    ) {
        super(SubscriptionModel as unknown as Model<ISubscription>, mapper);
    }

    async findByUserId(userId: string): Promise<SubscriptionEntity | null> {
        const doc = await this.model.findOne({ userId, status: 'active' }).sort({ createdAt: -1 });
        return doc ? this.mapper.fromMongo(doc as unknown as ISubscription & Document) : null;
    }

    async findByStripeSubscriptionId(subscriptionId: string): Promise<SubscriptionEntity | null> {
        const doc = await this.model.findOne({ stripeSubscriptionId: subscriptionId });
        return doc ? this.mapper.fromMongo(doc as unknown as ISubscription & Document) : null;
    }

    async createSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
        const data = {
            userId: subscription.userId,
            plan: subscription.plan,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            status: subscription.status,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            stripeCustomerId: subscription.stripeCustomerId,
            paymentId: subscription.paymentId
        };
        const newDoc = await this.model.create(data);
        return this.mapper.fromMongo(newDoc as unknown as ISubscription & Document);
    }

    async updateSubscription(id: string, subscription: Partial<SubscriptionEntity>): Promise<SubscriptionEntity | null> {
        const updateData: Partial<ISubscription> = {};
        if (subscription.plan) updateData.plan = subscription.plan;
        if (subscription.startDate) updateData.startDate = subscription.startDate;
        if (subscription.endDate) updateData.endDate = subscription.endDate;
        if (subscription.status) updateData.status = subscription.status;
        const doc = await this.model.findByIdAndUpdate(id, updateData, { new: true });
        return doc ? this.mapper.fromMongo(doc as unknown as ISubscription & Document) : null;
    }

    async findAllWithUserInfo(page: number, limit: number, status?: string, search?: string): Promise<{ data: SubscriptionWithUserDTO[], total: number }> {
        const skip = (page - 1) * limit;
        const matchStage: FilterQuery<ISubscription> = {};

        if (status && status !== 'all') {
            matchStage.status = status as 'active' | 'inactive' | 'cancelled' | 'expired';
        }

        const pipeline: PipelineStage[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { 'user.name': { $regex: search, $options: 'i' } },
                        { 'user.email': { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        pipeline.push({
            $project: {
                _id: 1,
                plan: 1,
                status: 1,
                startDate: 1,
                endDate: 1,
                amount: 1,
                createdAt: 1,
                userId: {
                    _id: { $ifNull: ['$user._id', '$userId'] },
                    name: { $ifNull: ['$user.name', 'Unknown'] },
                    email: { $ifNull: ['$user.email', 'Unknown'] },
                    profileImage: '$user.profileImage'
                }
            }
        });

        const countPipeline = [...pipeline, { $count: 'total' }];
        const dataPipeline = [...pipeline, { $sort: { createdAt: -1 } as Record<string, 1 | -1> }, { $skip: skip }, { $limit: limit }];

        const [dataResult, countResult] = await Promise.all([
            this.model.aggregate<SubscriptionWithUserDTO>(dataPipeline),
            this.model.aggregate<{ total: number }>(countPipeline)
        ]);

        const total = countResult.length > 0 ? countResult[0].total : 0;

        return { data: dataResult, total };
    }
}
