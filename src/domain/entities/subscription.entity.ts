export class SubscriptionEntity {
    private readonly _id?: string;
    private _userId: string;
    private _plan: string;
    private _startDate: Date;
    private _endDate: Date;
    private _status: 'active' | 'inactive' | 'cancelled' | 'expired';
    private _stripeSubscriptionId?: string;
    private _stripeCustomerId?: string;
    private _paymentId?: string;

    private constructor(
        userId: string,
        plan: string,
        startDate: Date,
        endDate: Date,
        status: 'active' | 'inactive' | 'cancelled' | 'expired',
        id?: string,
        stripeSubscriptionId?: string,
        stripeCustomerId?: string,
        paymentId?: string
    ) {
        this._id = id;
        this._userId = userId;
        this._plan = plan;
        this._startDate = startDate;
        this._endDate = endDate;
        this._status = status;
        this._stripeSubscriptionId = stripeSubscriptionId;
        this._stripeCustomerId = stripeCustomerId;
        this._paymentId = paymentId;
    }

    static create(data: {
        userId: string;
        plan: string;
        startDate: Date;
        endDate: Date;
        status: 'active' | 'inactive' | 'cancelled' | 'expired';
        id?: string;
        stripeSubscriptionId?: string;
        stripeCustomerId?: string;
        paymentId?: string;
    }): SubscriptionEntity {
        return new SubscriptionEntity(
            data.userId,
            data.plan,
            data.startDate,
            data.endDate,
            data.status,
            data.id,
            data.stripeSubscriptionId,
            data.stripeCustomerId,
            data.paymentId
        );
    }

    get id(): string | undefined {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get plan(): string {
        return this._plan;
    }

    get startDate(): Date {
        return this._startDate;
    }

    get endDate(): Date {
        return this._endDate;
    }

    get status(): 'active' | 'inactive' | 'cancelled' | 'expired' {
        return this._status;
    }

    get stripeSubscriptionId(): string | undefined {
        return this._stripeSubscriptionId;
    }

    get stripeCustomerId(): string | undefined {
        return this._stripeCustomerId;
    }

    get paymentId(): string | undefined {
        return this._paymentId;
    }

    updateStatus(status: 'active' | 'inactive' | 'cancelled' | 'expired') {
        this._status = status;
    }

    extendSubscription(endDate: Date) {
        this._endDate = endDate;
    }
}
