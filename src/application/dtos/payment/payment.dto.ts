export interface PaymentWithUserDTO {
    _id: string;
    amount: number;
    currency: string;
    status: string;
    purpose: string;
    paymentMethod: string;
    createdAt: Date;
    userId: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
}
