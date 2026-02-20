import { Schema, model, Document } from 'mongoose';

export interface IPlanDocument extends Document {
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    features: string[];
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
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    durationInDays: { type: Number, required: true, min: 1 },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ['one-time'], default: 'one-time' },
    projectLimit: { type: Number, default: 1 },
    maxContributors: { type: Number, default: 4 },
    participationLimit: { type: Number, default: 1 },
    stripePriceId: { type: String },
}, {
    timestamps: true,
    versionKey: false
});

export const PlanModel = model<IPlanDocument>('Plan', planSchema);
