import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IMeetingRepository } from "@/domain/repository/meeting.interface";
import { MEETING_TYPES } from "@/infrastructure/di/types/meetings";
import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { inject, injectable } from "inversify";
import { MeetingListItemDto } from "@/application/dtos/meetings/res/meeting-list-item.dto";
import { MeetingResponseMapper } from "@/application/mapper/meetings/meeting-response.mapper";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";

@injectable()
export class GetProjectMeetingsUseCase implements IExecute<{ projectId: string, status?: string, page?: number, limit?: number }, { items: MeetingListItemDto[], total: number }> {
    constructor(
        @inject(MEETING_TYPES.MeetingRepository) private readonly _meetingRepository: IMeetingRepository<MeetingEntity>
    ) { }

    async execute(data: { projectId: string, status?: string, page?: number, limit?: number }): Promise<{ items: MeetingListItemDto[], total: number }> {
        const { items: meetings, total } = await this._meetingRepository.findByProjectIdAndStatus(data.projectId, data.status, data.page, data.limit);
        const now = new Date();

        for (const meeting of meetings) {

            if (meeting.status === 'scheduled' && new Date(meeting.endTime) < now) {
                meeting.updateStatus(MeetingStatus.COMPLETED);
                await this._meetingRepository.updateStatus(meeting.id || "", MeetingStatus.COMPLETED);
            }
        }
        
        return {
            items: MeetingResponseMapper.toList(meetings),
            total
        };
    }
}
