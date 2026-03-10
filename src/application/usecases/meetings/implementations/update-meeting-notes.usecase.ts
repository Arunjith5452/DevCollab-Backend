import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IMeetingRepository } from "@/domain/repository/meeting.interface";
import { inject, injectable } from "inversify";
import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { MEETING_TYPES } from "@/infrastructure/di/types/meetings";

@injectable()
export class UpdateMeetingNotesUseCase implements IExecute<{ meetingId: string; notes: string; userId?: string; userName?: string }, void> {
    constructor(
        @inject(MEETING_TYPES.MeetingRepository) private readonly _meetingRepository: IMeetingRepository<MeetingEntity>
    ) { }

    async execute(payload: { meetingId: string; notes: string; userId?: string; userName?: string }): Promise<void> {
        const { meetingId, notes, userId, userName } = payload;
        const meeting = await this._meetingRepository.findById(meetingId);

        if (!meeting) {
            throw new Error("Meeting not found");
        }

        if (userId && userName) {
            console.log(`[UpdateMeetingNotesUseCase] Collaborative update for ${userName} (${userId})`);
            meeting.updateParticipantNote(userId, userName, notes);
            await this._meetingRepository.updateParticipantNote(meetingId, userId, userName, notes);
        } else {
            console.warn(`[UpdateMeetingNotesUseCase] Falling back to legacy update for meeting ${meetingId}. userId: ${userId}, userName: ${userName}`);
            // Legacy/Fallback: update as general notes (usually creator)
            meeting.updateNotes(notes);
            await this._meetingRepository.updateNotes(meetingId, meeting.notes);
        }
    }
}
