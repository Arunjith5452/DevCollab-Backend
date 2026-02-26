import { IExecute } from "@/application/interface/execute.usecase.interface";
import { CreateMeetingDTO } from "@/application/dtos/meetings/create-meeting.dto";
import { IMeetingRepository } from "@/domain/repository/meeting.interface";
import { MEETING_TYPES } from "@/infrastructure/di/types/meetings";
import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { inject, injectable } from "inversify";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";

@injectable()
export class ScheduleMeetingUseCase implements IExecute<CreateMeetingDTO, void> {
    constructor(
        @inject(MEETING_TYPES.MeetingRepository) private readonly _meetingRepository: IMeetingRepository<MeetingEntity>
    ) { }

    async execute(data: CreateMeetingDTO): Promise<void> {

        try {
            const meeting = MeetingEntity.create({
                projectId: data.projectId,
                title: data.title,
                date: new Date(data.date),
                endTime: new Date(data.endTime),
                createdBy: data.createdBy || "",
                link: data.link,
                type: data.type,
                status: MeetingStatus.SCHEDULED
            });

            await this._meetingRepository.createMeeting(meeting);
        } catch (error) {
            throw error
        }
    }
}
