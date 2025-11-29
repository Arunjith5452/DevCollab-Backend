import { Schema, Types } from "mongoose";

export const applicationSchema = new Schema({

    userId: {
        type: Types.ObjectId,
        ref: "Users",
        required: true
    },
    projectId: {
        type: Types.ObjectId,
        ref: "Projects",
        required: true
    },
    techStack: {
        type: [String],
        required: true
    },
    profileUrl: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },

}, { timestamps: true })