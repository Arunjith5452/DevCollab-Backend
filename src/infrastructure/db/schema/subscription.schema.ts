import { Schema, model } from 'mongoose';

export const subscriptionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        required: true

    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired'],
        required: true
    },
    stripeSubscriptionId: {
        type: String
    },
    stripeCustomerId: {
        type: String
    },
    paymentId: {
        type: String
    },
}, {
    timestamps: true,
    versionKey: false
});


