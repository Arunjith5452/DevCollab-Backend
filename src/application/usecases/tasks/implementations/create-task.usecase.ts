import { CreateTaskDTO } from "@/application/dtos/tasks/create-task.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { PaymentEntity } from "@/domain/entities/payment.entity";
import { ITasksRepository } from "@/infrastructure/db/repository/interface/task.interface";
import { IPaymentRepository } from "@/infrastructure/db/repository/interface/payment.interface";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { PAYMENT_TYPES } from "@/infrastructure/di/types/payment";
import { StripeProvider } from "@/infrastructure/providers/stripe/stripe.provider";
import { inject, injectable } from "inversify";
import { PaymentPurpose } from "@/domain/enums/payment/payment-purpose.enums";
import { PaymentStatus } from "@/domain/enums/payment/payment.enums";

@injectable()
export class CreateTaskUseCase implements IExecute<CreateTaskDTO, TaskEntity> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>,
        @inject(PAYMENT_TYPES.StripeProvider) private readonly _stripeProvider: StripeProvider,
        @inject(PAYMENT_TYPES.PaymentRepository) private readonly _paymentRepository: IPaymentRepository<PaymentEntity>
    ) { }

    async execute(dto: CreateTaskDTO): Promise<TaskEntity> {
        try {
            let stripePaymentIntentId: string | undefined;

            // Optional Stripe verification - if sessionId is provided (for backward compatibility or direct calls)
            if (dto.payment && dto.payment.amount > 0 && dto.payment.sessionId) {
                const session = await this._stripeProvider.retrieveCheckoutSession(dto.payment.sessionId);

                if (session.payment_status !== 'paid') {
                    throw new Error(`Payment verification failed: payment status is ${session.payment_status}`);
                }

                stripePaymentIntentId = session.payment_intent as string;
            }

            const task = TaskEntity.create({
                title: dto.title.trim(),
                projectId: dto.projectId,
                assignedId: dto.assignedId,
                description: dto.description,
                status: dto.status || "todo",
                deadline: new Date(dto.deadline),
                tags: dto.tags || [],
                documents: dto.documents || [],
                acceptanceCriteria: dto.acceptanceCriteria,
                payment: dto.payment
                    ? {
                        amount: dto.payment.amount,
                        escrowStatus: stripePaymentIntentId ? "held" : "not-paid" // Use held if verified, else not-paid
                    }
                    : undefined,
            });

            const createdTask = await this._taskRepository.createTask(task);

            if (dto.payment && dto.payment.amount > 0 && dto.payment.sessionId && stripePaymentIntentId) {
                const paymentEntity = PaymentEntity.create({
                    userId: dto.assignedId,
                    amount: dto.payment.amount,
                    purpose: PaymentPurpose.TASK_ESCROW,
                    stripePaymentIntentId: stripePaymentIntentId,
                    stripeSessionId: dto.payment.sessionId,
                    taskId: createdTask.id,
                    projectId: dto.projectId,
                    status: PaymentStatus.HELD
                });
                await this._paymentRepository.createPayment(paymentEntity)
            }

            return createdTask;
        } catch (error) {
            throw error;
        }
    }
}