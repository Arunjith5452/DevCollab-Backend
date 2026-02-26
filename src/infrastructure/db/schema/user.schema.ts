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
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    title: {
        type: String
    },
    techStack: [{
        type: String,
    }],
    githubProfile: {
        type: String,
    },
    githubAccessToken: {
        type: String,
        select: false
    },
    googleId: { type: String, required: false },
    bio: {
        type: String,
    },
    profileImage: {
        type: String
    },
    status: {
        type: String,
        default: "active"
    },

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

