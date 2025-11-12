import { Schema } from "mongoose"

export const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: [String],
        enum: ["user", "creator", "contributor"],
        default: ["user"]
    },
    techStack: [{
        type: String,
    }],
    githubProfile: {
        type: String,
    },
    googleId: { type: String, required: false },

    bio: {
        type: String,
    },
    status: {
        type: String,
        default: "active"
    },
    subscription: [
        {
            plan: {
                type: String,
                enum: ['free', 'pro'],
                // required: true,
                default: 'free'
            },
            startDate: {
                type: Date,
                // required: true,
            },
            endDate: {
                type: Date,
                // required: true,
            },
            status: {
                type: String,
                enum: ['active', 'inactive', 'cancelled'],
                // required: true,
                default: 'active',
            },
        }
    ],
    verification: {
        email: {
            type: Boolean,
            default: true
        },
        phone: {
            type: Boolean,
            default: false
        },
        payment: {
            type: Boolean,
            default: false
        }
    },

    experience: [
        {
            role: {
                type: String,
                trim: true
            },
            years: {
                type: Number,
                min: 0
            }
        }
    ]

}, { timestamps: true })

