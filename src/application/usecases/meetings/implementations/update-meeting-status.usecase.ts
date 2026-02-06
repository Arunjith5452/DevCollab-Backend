import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IMeetingRepository } from "@/domain/repository/meeting.interface";
import { MEETING_TYPES } from "@/infrastructure/di/types/meetings";
import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { inject, injectable } from "inversify";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";

@injectable()
export class UpdateMeetingStatusUseCase implements IExecute<{ meetingId: string, status: MeetingStatus }, void> {
    constructor(
        @inject(MEETING_TYPES.MeetingRepository) private readonly _meetingRepository: IMeetingRepository<MeetingEntity>
    ) { }

    async execute(data: { meetingId: string, status: MeetingStatus }): Promise<void> {
        await this._meetingRepository.updateStatus(data.meetingId, data.status);
    }
}
