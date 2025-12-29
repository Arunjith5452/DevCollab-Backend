import { PaymentEntity } from "@/domain/entities/payment.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IPaymentRepository<T> extends IBaseRepository<T> {
    createPayment(payment: PaymentEntity): Promise<void>;
    updatePayment(payment: PaymentEntity): Promise<void>;
}