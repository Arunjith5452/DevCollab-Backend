import { PaymentEntity } from "@/domain/entities/payment.entity";

export class PaymentPersistenceMapper {
    toMongo(payment: PaymentEntity) {
        return {
            userId: payment.userId,
            projectId: payment.projectId,
            taskId: payment.taskId,
            amount: payment.amount,
            currency: payment.currency,
            purpose: payment.purpose,
            status: payment.status,
            stripePaymentIntentId: payment.stripePaymentIntentId,
            stripeSessionId: payment.stripeSessionId,
            createdAt: payment.createdAt
        };
    }

    fromMongo(doc: any): PaymentEntity {
        return new PaymentEntity(
            doc.userId.toString(),
            doc.amount,
            doc.purpose,
            doc.stripePaymentIntentId,
            doc.taskId?.toString(),
            doc.projectId?.toString(),
            doc.status,
            doc.currency,
            doc.stripeSessionId,
            doc._id.toString(),
            doc.createdAt,
            doc.updatedAt
        );
    }
}
