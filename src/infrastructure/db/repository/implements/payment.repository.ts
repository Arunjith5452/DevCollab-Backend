import { IPaymentRepository } from "@/infrastructure/db/repository/interface/payment.interface";
import { PaymentEntity } from "@/domain/entities/payment.entity";
import { inject, injectable } from "inversify";
import { PaymentPersistenceMapper } from "@/infrastructure/mappers/payment-persistence.mapper";
import { BaseRepository } from "./base.repository";
import { Model, UpdateQuery } from "mongoose";
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
}
