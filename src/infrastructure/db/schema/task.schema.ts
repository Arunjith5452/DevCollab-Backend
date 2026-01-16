import { Schema, Types } from "mongoose";

export const taskSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    projectId: {
        type: Types.ObjectId,
        ref: "Project",
        required: true
    },

    assignedId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    description: {
        type: String
    },

    prLink: {
        type: String
    },

    feedBack: {
        type: String
    },

    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo"
    },

    deadline: {
        type: Date
    },

    comments: [
        {
            createdAt: {
                type: Date,
                default: Date.now
            },
            message: {
                type: String
            },
            userId: {
                type: Types.ObjectId,
                ref: "User"
            }
        }
    ],

    tags: [
        {
            type: String
        }
    ],

    acceptanceCriteria: [
        {
            text: { type: String, required: true },
            completed: { type: Boolean, default: false }
        }
    ],

    payment: {
        totalAmount: {
            type: Number,
            required: true,
        },
        escrowStatus: {
            type: String,
            enum: ["not-paid", "held", "released"],
            default: "not-paid",
        },
    },

    documents: [
        {
            type: String
        }
    ],
    
    approval: {
        type: String,
        enum: ["under-review", "approved"]
    },

    workDescription: {
        type: String
    }

}, { timestamps: true });
