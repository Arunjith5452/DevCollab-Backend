import { injectable, inject } from "inversify";
import { PAYMENT_TYPES } from "@/infrastructure/di/types/payment";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { WebhookDTO } from "@/application/dtos/payment/webhook.dto";
import Stripe from "stripe";
import { ITasksRepository } from "@/domain/repository/task.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { IPaymentRepository } from "@/domain/repository/payment.interface";
import { PaymentEntity } from "@/domain/entities/payment.entity";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { PaymentStatus } from "@/domain/enums/payment/payment.enums";
import { PaymentPurpose } from "@/domain/enums/payment/payment-purpose.enums";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { IPaymentService } from "@/application/interface/payment.service.interface";

@injectable()
export class HandleWebhookUseCase implements IExecute<WebhookDTO, { received: boolean; eventType?: string }> {
    constructor(
        @inject(COMMON_TYPES.PaymentService) private readonly _paymentService: IPaymentService,
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>,
        @inject(PAYMENT_TYPES.PaymentRepository) private readonly _paymentRepository: IPaymentRepository<PaymentEntity>
    ) { }

    async execute(dto: WebhookDTO): Promise<{ received: boolean; eventType?: string }> {
        try {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

            if (!webhookSecret) {
                throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
            }

            if (!dto.payload || !dto.signature) {
                throw new Error('Missing required webhook parameters: payload and signature');
            }

            let event: Stripe.Event;

            try {
                event = await this._paymentService.constructWebhookEvent(
                    dto.payload,
                    dto.signature,
                    webhookSecret
                );
            } catch (error) {
                let err = error as Error
                console.error('Webhook signature verification failed:', err.message);
                throw new Error(`Webhook Error: ${err.message}`);
            }

            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object as Stripe.Checkout.Session;

                    const taskId = session.metadata?.task_id;
                    const projectId = session.metadata?.project_id;

                    if (taskId) {
                        const task = await this._taskRepository.findById(taskId);
                        if (task) {
                            task.updatePayment(task.payment.amount, "held");
                            task.updateStatus(TaskStatus.TODO); // Activate task
                            await this._taskRepository.updateTask(task);

                            // Also create/update payment record
                            const paymentIntentId = session.payment_intent as string;
                            const payment = PaymentEntity.create({
                                userId: task.assignedId,
                                amount: task.payment.amount,
                                purpose: PaymentPurpose.TASK_ESCROW,
                                stripePaymentIntentId: paymentIntentId,
                                stripeSessionId: session.id,
                                taskId: task.id,
                                projectId: projectId || task.projectId,
                                status: PaymentStatus.HELD
                            });
                            await this._paymentRepository.createPayment(payment);
                        }
                    }
                    break

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            return { received: true, eventType: event.type };

        } catch (error) {
            throw error
        }

    }
}