import { Schema, Types } from "mongoose";

export const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    expectation: {
      type: String,
    },
    image: {
      type: String
    },
    creatorId: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    githubRepo: {
      type: String,
    },
    techStack: {
      type: [String],
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "completed", "disabled"],
      default: "active",
    },
    members: [
      {
        joinedAt: { type: String },
        role: { type: String },
        status: { type: String },
        userId: { type: Types.ObjectId, ref: "Users" },
      },
    ],
    requiredRoles: [
      {
        count: { type: String },
        experience: { type: String },
        role: { type: String },
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);
