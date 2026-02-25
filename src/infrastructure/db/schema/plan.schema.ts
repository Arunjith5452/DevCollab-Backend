import { Schema, model, Document } from 'mongoose';
import { PlanFeature } from '@/domain/enums/plan/plan-feature.enum';

export interface IPlanDocument extends Document {
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    features: PlanFeature[];
    isActive: boolean;
    type: 'one-time';
    projectLimit: number;
    maxContributors: number;
    participationLimit: number;
    stripePriceId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const planSchema = new Schema({
    name:
    {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true, min: 0
    },
    durationInDays: {
        type: Number,
        required: true, min: 1
    },
    features: [{
        type: String,
        enum: Object.values(PlanFeature)
    }],
    isActive: {
        type: Boolean, default: true
    },
    type: {
        type: String, enum: ['one-time'],
        default: 'one-time'
    },
    projectLimit: {
        type: Number, default: 1
    },
    maxContributors: {
        type: Number, default: 4
    },
    participationLimit: {
        type: Number, default: 1
    },
    stripePriceId: {
        type: String
    },
}, {
    timestamps: true,
    versionKey: false
});

export const PlanModel = model<IPlanDocument>('Plan', planSchema);
