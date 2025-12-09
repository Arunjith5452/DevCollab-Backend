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
    assignedTo: {
        type: String,   
        default: null
    },
    assigneeId: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        default: null
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
        enum: ["todo", "in-progress", "done", "improvement-needed"],
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
        advancePaid: {
            type: Number,
            default: 0
        },
        amount: {
            type: Number,
            default: 0
        }
    },

    documents: [
        {
            type: String
        }
    ]

}, { timestamps: true });
