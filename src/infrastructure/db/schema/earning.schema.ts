import { Schema, Types } from "mongoose";

export const earningSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    projectId: {
      type: Types.ObjectId,
      ref: "Project",
      required: true,
    },

    taskId: {
      type: Types.ObjectId,
      ref: "Task",
      required: true,
    },

    paymentId: {
      type: Types.ObjectId,
      ref: "Payment",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "withdrawn"],
      default: "pending",
    },
  },
  { timestamps: true }
);
