import { model } from "mongoose";
import { meetingSchema } from "../schema/meeting.schema";
import { IMeeting } from "../interface/meeting.interface";

export const meetingModel = model<IMeeting>("Meetings", meetingSchema);
