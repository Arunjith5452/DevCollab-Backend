import { Schema, Types } from "mongoose";

export const paymentSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        projectId: {
            type: Types.ObjectId,
            ref: "Project",
        },

        taskId: {
            type: Types.ObjectId,
            ref: "Task",
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "INR",
        },

        purpose: {
            type: String,
            enum: ["SUBSCRIPTION", "TASK_ESCROW"],
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "held", "released", "failed"],
            default: "pending",
        },

        paymentGateway: {
            type: String,
            enum: ["stripe"],
            default: "stripe",
        },

        stripePaymentIntentId: {
            type: String,
        },

        stripeSessionId: {
            type: String,
        },
        
        metadata: {
            type: Object,
        },
    },
    { timestamps: true }
);
