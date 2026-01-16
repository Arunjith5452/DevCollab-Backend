import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { MeetingListItemDto } from "../../dtos/meetings/res/meeting-list-item.dto";

export class MeetingResponseMapper {
    static toList(meetings: MeetingEntity[]): MeetingListItemDto[] {
        return meetings.map(meeting => new MeetingListItemDto({
            id: meeting.id!,
            projectId: meeting.projectId,
            title: meeting.title,
            link: meeting.link,
            date: meeting.date,
            type: meeting.type,
            createdBy: meeting.createdBy,
            status: meeting.status,
            participants: meeting.participants
        }));
    }
}
