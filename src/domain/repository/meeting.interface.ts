import { MeetingEntity, ParticipantNote } from "@/domain/entities/meeting.entity";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";
import { IBaseRepository } from "./base-repository.interface";

export interface IMeetingRepository<T> extends IBaseRepository<T> {
    createMeeting(data: MeetingEntity): Promise<MeetingEntity>;
    findByProjectId(projectId: string): Promise<MeetingEntity[]>;
    updateStatus(meetingId: string, status: MeetingStatus, endTime?: Date): Promise<void>;
    updateNotes(meetingId: string, notes: ParticipantNote[] | string): Promise<void>;
    updateParticipantNote(meetingId: string, userId: string, userName: string, content: string): Promise<void>;
    findByProjectIdAndStatus(projectId: string, status?: string, page?: number, limit?: number): Promise<{ items: T[], total: number }>;
}
