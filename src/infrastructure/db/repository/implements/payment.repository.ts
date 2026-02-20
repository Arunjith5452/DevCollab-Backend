import { IPaymentRepository } from "@/domain/repository/payment.interface";
import { PaymentEntity } from "@/domain/entities/payment.entity";
import { inject, injectable } from "inversify";
import { PaymentPersistenceMapper } from "@/infrastructure/mappers/payment-persistence.mapper";
import { BaseRepository } from "./base.repository";
import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { PaymentWithUserDTO } from "@/application/dtos/payment/payment.dto";
import { IPayment } from "@/infrastructure/db/interface/payment.interface";

@injectable()
export class PaymentRepository extends BaseRepository<PaymentEntity, IPayment> implements IPaymentRepository<PaymentEntity> {

    constructor(
        @inject("PaymentModel") model: Model<IPayment>,
        @inject(PaymentPersistenceMapper) mapper: PaymentPersistenceMapper
    ) {
        super(model, mapper)
    }

    async createPayment(payment: PaymentEntity): Promise<void> {
        await this.create(payment);
    }

    async updatePayment(payment: PaymentEntity): Promise<void> {
        if (!payment.id) throw new Error("Payment ID required for update");
        await this.update(payment.id, this.mapper.toMongo(payment) as unknown as UpdateQuery<PaymentEntity>);
    }

    async getAllSubscriptions(page: number, limit: number, search?: string): Promise<{ data: PaymentWithUserDTO[], total: number }> {
        const query: FilterQuery<IPayment> = { purpose: 'SUBSCRIPTION' };

        // If search is implemented, it would require aggregation to filter by user details
        // For now, we return all subscriptions paginated

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.model.find(query)
                .populate('userId', 'name email profileImage')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean<PaymentWithUserDTO[]>()
                .exec(),
            this.model.countDocuments(query)
        ]);

        return { data, total };
    }
}
