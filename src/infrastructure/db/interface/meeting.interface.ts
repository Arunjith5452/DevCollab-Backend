import { InferSchemaType } from "mongoose";
import { meetingSchema } from "../schema/meeting.schema";

export type IMeeting = InferSchemaType<typeof meetingSchema>;
