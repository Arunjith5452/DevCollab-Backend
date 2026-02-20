import { PaymentEntity } from "@/domain/entities/payment.entity";
import { IBaseRepository } from "./base-repository.interface";
import { PaymentWithUserDTO } from "@/application/dtos/payment/payment.dto";

export interface IPaymentRepository<T> extends IBaseRepository<T> {
    createPayment(payment: PaymentEntity): Promise<void>;
    updatePayment(payment: PaymentEntity): Promise<void>;
    getAllSubscriptions(page: number, limit: number, search?: string): Promise<{ data: PaymentWithUserDTO[], total: number }>;
}