import { PaymentEntity } from "@/domain/entities/payment.entity";
import { IPayment } from "../db/interface/payment.interface";
import { PaymentPurpose } from "@/domain/enums/payment/payment-purpose.enums";
import { PaymentStatus } from "@/domain/enums/payment/payment.enums";
import { IPersistenceMapper } from "./interface/persistence-mapper.interface";
import { Types } from "mongoose";

export class PaymentPersistenceMapper implements IPersistenceMapper<PaymentEntity, IPayment> {
    toMongo(payment: PaymentEntity) {
        return {
            userId: new Types.ObjectId(payment.userId) as unknown as Types.ObjectId,
            projectId: payment.projectId ? new Types.ObjectId(payment.projectId) as unknown as Types.ObjectId : undefined,
            taskId: payment.taskId ? new Types.ObjectId(payment.taskId) as unknown as Types.ObjectId : undefined,
            amount: payment.amount,
            currency: payment.currency,
            purpose: payment.purpose as PaymentPurpose,
            status: payment.status as unknown as IPayment['status'],
            stripePaymentIntentId: payment.stripePaymentIntentId,
            stripeSessionId: payment.stripeSessionId,
            createdAt: payment.createdAt
        };
    }

    fromMongo(doc: IPayment & { _id: Types.ObjectId }): PaymentEntity {
        // userId in IPayment is ObjectId.
        return new PaymentEntity(
            String(doc.userId),
            doc.amount,
            doc.purpose as PaymentPurpose,
            doc.stripePaymentIntentId ?? undefined,
            doc.taskId ? String(doc.taskId) : undefined,
            doc.projectId ? String(doc.projectId) : undefined,
            doc.status as PaymentStatus,
            doc.currency,
            doc.stripeSessionId ?? undefined,
            doc._id.toString(),
            doc.createdAt,
            doc.updatedAt
        );
    }
}
