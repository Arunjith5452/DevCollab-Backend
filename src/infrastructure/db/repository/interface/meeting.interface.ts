import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";
import { IBaseRepository } from "./base-repository.interface";

export interface IMeetingRepository<T> extends IBaseRepository<any> {
    createMeeting(data: MeetingEntity): Promise<MeetingEntity>;
    findByProjectId(projectId: string): Promise<MeetingEntity[]>;
    updateStatus(meetingId: string, status: MeetingStatus): Promise<void>;
}
