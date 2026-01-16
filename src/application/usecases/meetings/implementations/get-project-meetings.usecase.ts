import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IMeetingRepository } from "@/infrastructure/db/repository/interface/meeting.interface";
import { MEETING_TYPES } from "@/infrastructure/di/types/meetings";
import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { inject, injectable } from "inversify";
import { MeetingListItemDto } from "@/application/dtos/meetings/res/meeting-list-item.dto";
import { MeetingResponseMapper } from "@/application/mapper/meetings/meeting-response.mapper";

@injectable()
export class GetProjectMeetingsUseCase implements IExecute<string, MeetingListItemDto[]> {
    constructor(
        @inject(MEETING_TYPES.MeetingRepository) private readonly _meetingRepository: IMeetingRepository<MeetingEntity>
    ) { }

    async execute(projectId: string): Promise<MeetingListItemDto[]> {
        const meetings = await this._meetingRepository.findByProjectId(projectId);
        return MeetingResponseMapper.toList(meetings);
    }
}
