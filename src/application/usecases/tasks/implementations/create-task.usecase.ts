import { inject, injectable } from "inversify";
import { CreateTaskDTO } from "@/application/dtos/tasks/create-task.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { PaymentEntity } from "@/domain/entities/payment.entity";
import { PaymentPurpose } from "@/domain/enums/payment/payment-purpose.enums";
import { PaymentStatus } from "@/domain/enums/payment/payment.enums";
import { ITasksRepository } from "@/domain/repository/task.interface";
import { IPaymentRepository } from "@/domain/repository/payment.interface";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { PAYMENT_TYPES } from "@/infrastructure/di/types/payment";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { IPaymentService } from "@/application/interface/payment.service.interface";
import { CreateTaskResponseDTO } from "@/application/dtos/tasks/res/create-task-response.dto";
import { TaskResponseMapper } from "@/application/mapper/tasks/task-response.mapper";

@injectable()
export class CreateTaskUseCase implements IExecute<CreateTaskDTO, CreateTaskResponseDTO> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>,
        @inject(COMMON_TYPES.PaymentService) private readonly _paymentService: IPaymentService,
        @inject(PAYMENT_TYPES.PaymentRepository) private readonly _paymentRepository: IPaymentRepository<PaymentEntity>,
        @inject(TASK_TYPES.TaskResponseMapper) private readonly _mapper: TaskResponseMapper
    ) { }

    async execute(dto: CreateTaskDTO): Promise<CreateTaskResponseDTO> {
        try {
            if (!dto.payment || dto.payment.amount <= 0) {
                throw new Error("Payment amount is required and must be greater than zero.");
            }

            let stripePaymentIntentId: string | undefined;

            if (dto.payment.sessionId) {
                const session = await this._paymentService.retrieveCheckoutSession(dto.payment.sessionId);

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
                        escrowStatus: stripePaymentIntentId ? "held" : "not-paid"
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

            return this._mapper.toResponse(createdTask);
        } catch (error) {
            throw error;
        }
    }
}