import { PaymentPurpose } from "../enums/payment/payment-purpose.enums";
import { PaymentStatus } from "../enums/payment/payment.enums";

export class PaymentEntity {
  private readonly _id?: string;
  private _userId: string;
  private _projectId?: string;
  private _taskId?: string;
  private _amount: number;
  private _currency: string;
  private _purpose: PaymentPurpose;
  private _status: PaymentStatus;
  private _paymentGateway: "stripe";
  private _stripePaymentIntentId?: string;
  private _stripeSessionId?: string;
  private _metadata?: Object;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(
    userId: string,
    amount: number,
    purpose: PaymentPurpose,
    stripePaymentIntentId?: string,
    taskId?: string,
    projectId?: string,
    status: PaymentStatus = PaymentStatus.PENDING,
    currency: string = "INR",
    stripeSessionId?: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._userId = userId;
    this._amount = amount;
    this._purpose = purpose;
    this._stripePaymentIntentId = stripePaymentIntentId;
    this._stripeSessionId = stripeSessionId;
    this._taskId = taskId;
    this._projectId = projectId;
    this._status = status;
    this._currency = currency;
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._paymentGateway = "stripe";
  }

  static create(data: {
    userId: string;
    amount: number;
    purpose: PaymentPurpose;
    stripePaymentIntentId?: string;
    stripeSessionId?: string;
    taskId?: string;
    projectId?: string;
    status?: PaymentStatus;
  }): PaymentEntity {
    return new PaymentEntity(
      data.userId,
      data.amount,
      data.purpose,
      data.stripePaymentIntentId,
      data.taskId,
      data.projectId,
      data.status ?? PaymentStatus.PENDING,
      "INR",
      data.stripeSessionId
    );
  }


  get id(): string | undefined {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get amount(): number {
    return this._amount;
  }

  get purpose(): PaymentPurpose {
    return this._purpose;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get currency(): string {
    return this._currency;
  }

  get projectId(): string | undefined {
    return this._projectId;
  }

  get taskId(): string | undefined {
    return this._taskId;
  }

  get stripePaymentIntentId(): string | undefined {
    return this._stripePaymentIntentId;
  }

  get stripeSessionId(): string | undefined {
    return this._stripeSessionId;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

}