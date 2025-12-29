import { IPaymentRepository } from "@/infrastructure/db/repository/interface/payment.interface";
import { PaymentEntity } from "@/domain/entities/payment.entity";
import { inject, injectable } from "inversify";
import { PaymentPersistenceMapper } from "@/infrastructure/mappers/payment-persistence.mapper";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";

@injectable()
export class PaymentRepository extends BaseRepository<PaymentEntity> implements IPaymentRepository<PaymentEntity> {
    private readonly paymentPersistenceMapper: PaymentPersistenceMapper;

    constructor(@inject("PaymentModel") model: Model<PaymentEntity>, paymentPersistenceMapper: PaymentPersistenceMapper) {
        super(model)
        this.paymentPersistenceMapper = paymentPersistenceMapper
    }

    async createPayment(payment: PaymentEntity): Promise<void> {
        const mongoData = this.paymentPersistenceMapper.toMongo(payment);
        await this.create(mongoData);
    }

    async updatePayment(payment: PaymentEntity): Promise<void> {
        const mongoData = this.paymentPersistenceMapper.toMongo(payment);
        await this.updateOne({ _id: payment.id }, mongoData);
    }
}
