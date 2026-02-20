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
import { ISubscriptionRepository } from "@/domain/repository/subscription.interface";
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { SUBSCRIPTION_TYPES } from "@/infrastructure/di/types/subscription";
import { IUserRepository } from "@/domain/repository/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { UserEntity } from "@/domain/entities/user.entity";

@injectable()
export class HandleWebhookUseCase implements IExecute<WebhookDTO, { received: boolean; eventType?: string }> {
    constructor(
        @inject(COMMON_TYPES.PaymentService) private readonly _paymentService: IPaymentService,
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>,
        @inject(PAYMENT_TYPES.PaymentRepository) private readonly _paymentRepository: IPaymentRepository<PaymentEntity>,
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository<SubscriptionEntity>,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>
    ) { }

    async execute(dto: WebhookDTO): Promise<{ received: boolean; eventType?: string }> {
        try {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            console.log('🔔 [WEBHOOK] Received webhook request');
            console.log('🔔 [WEBHOOK] Body type:', typeof dto.payload, '| Is Buffer:', Buffer.isBuffer(dto.payload));
            console.log('🔔 [WEBHOOK] Signature present:', !!dto.signature);
            console.log('🔔 [WEBHOOK] Secret present:', !!webhookSecret);

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
                console.log('✅ [WEBHOOK] Signature verified! Event type:', event.type);
            } catch (error) {
                let err = error as Error
                console.error('❌ [WEBHOOK] Signature verification failed:', err.message);
                throw new Error(`Webhook Error: ${err.message}`);
            }

            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object as Stripe.Checkout.Session;
                    console.log('✅ [WEBHOOK] checkout.session.completed received');
                    console.log('📋 [WEBHOOK] Session mode:', session.mode);
                    console.log('📋 [WEBHOOK] Session metadata:', JSON.stringify(session.metadata));

                    // Handle Subscription / Plan Purchase
                    if ((session.mode === 'payment' && session.metadata?.type === 'plan_purchase') || session.mode === 'subscription') {
                        const userId = session.metadata?.userId || session.client_reference_id;
                        const planId = session.metadata?.planId; // For dynamic plans
                        const durationInDays = parseInt(session.metadata?.durationInDays || '30');
                        const productName = session.metadata?.productName || 'pro';
                        console.log('📋 [WEBHOOK] userId:', userId, '| planId:', planId, '| productName:', productName, '| durationInDays:', durationInDays);

                        if (!userId) {
                            console.error('❌ [WEBHOOK] Missing userId in session metadata - cannot provision subscription!');
                            return { received: true };
                        }

                        const subscriptionId = session.subscription as string; // Might be null for one-time
                        const customerId = session.customer as string;
                        const paymentId = session.payment_intent as string;

                        // Always calculate dates from today — prevents inheriting old plan's duration
                        const existingSub = await this._subscriptionRepository.findByUserId(userId);
                        const startDate = new Date();
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + durationInDays);

                        if (existingSub) {
                            // Update existing subscription with fresh dates and new plan
                            await this._subscriptionRepository.updateSubscription(existingSub.id!, {
                                startDate,
                                endDate,
                                plan: productName,
                                status: 'active',
                                paymentId
                            });
                        } else {
                            // Create brand new subscription
                            const newSub = SubscriptionEntity.create({
                                userId,
                                plan: productName,
                                startDate,
                                endDate,
                                status: 'active',
                                stripeSubscriptionId: subscriptionId,
                                stripeCustomerId: customerId,
                                paymentId
                            });
                            await this._subscriptionRepository.createSubscription(newSub);
                        }
                    } // end if (plan_purchase || subscription mode)

                    // Also update UserEntity subscription summary if needed
                    // (Optional depending on if UserEntity stores a copy)

                    // Handle Task Payment
                    const taskId = session.metadata?.task_id;
                    const projectId = session.metadata?.project_id;

                    if (taskId) {
                        const task = await this._taskRepository.findById(taskId);
                        if (task) {
                            task.updatePayment(task.payment.amount, "held");
                            task.updateStatus(TaskStatus.TODO);
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

                case 'invoice.payment_succeeded':
                    const invoice = event.data.object as Stripe.Invoice & { subscription: string };
                    if (invoice.subscription) {
                        const subscriptionId = invoice.subscription;
                        const sub = await this._subscriptionRepository.findByStripeSubscriptionId(subscriptionId);
                        if (sub) {
                            const newEndDate = new Date(invoice.period_end * 1000); // Stripe uses seconds
                            sub.extendSubscription(newEndDate);
                            await this._subscriptionRepository.updateSubscription(sub.id!, { endDate: newEndDate, status: 'active' });
                        }
                    }
                    break;

                case 'customer.subscription.deleted':
                    const deletedSub = event.data.object as Stripe.Subscription;
                    const dbSub = await this._subscriptionRepository.findByStripeSubscriptionId(deletedSub.id);
                    if (dbSub) {
                        dbSub.updateStatus('cancelled');
                        await this._subscriptionRepository.updateSubscription(dbSub.id!, { status: 'cancelled' });
                    }
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            return { received: true, eventType: event.type };

        } catch (error) {
            throw error
        }

    }
}