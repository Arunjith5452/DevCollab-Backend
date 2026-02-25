import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
class SubscriptionUserDTO {
    @Expose()
    _id!: string;

    @Expose()
    name!: string;

    @Expose()
    email!: string;

    @Expose()
    profileImage!: string;

    constructor(data: Partial<SubscriptionUserDTO>) {
        Object.assign(this, data);
    }
}

@Exclude()
export class SubscriptionWithUserDTO {
    @Expose()
    _id!: string;

    @Expose()
    plan!: string;

    @Expose()
    status!: 'active' | 'inactive' | 'cancelled' | 'expired';

    @Expose()
    startDate!: Date;

    @Expose()
    endDate!: Date;

    @Expose()
    amount?: number;

    @Expose()
    createdAt!: Date;

    @Expose()
    @Type(() => SubscriptionUserDTO)
    userId!: SubscriptionUserDTO;

    constructor(data: Partial<SubscriptionWithUserDTO>) {
        Object.assign(this, data);
    }
}
