import { Schema } from "mongoose";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";

export const meetingSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: false,
    },

    date: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: ["single", "group"],
      default: "group",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "Users",
        },
        joinedAt: {
          type: Date,
        },
      },
    ],

    status: {
      type: String,
      enum: Object.values(MeetingStatus),
      default: MeetingStatus.SCHEDULED,
    },
  },
  { timestamps: true }
);
