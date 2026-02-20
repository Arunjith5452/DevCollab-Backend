export interface SubscriptionWithUserDTO {
    _id: string;
    plan: string;
    status: 'active' | 'inactive' | 'cancelled' | 'expired';
    startDate: Date;
    endDate: Date;
    amount?: number;
    createdAt: Date;
    userId: {
        _id: string;
        name: string;
        email: string;
        profileImage: string;
    };
}
