import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { MeetingListItemDto } from "../../dtos/meetings/res/meeting-list-item.dto";

export class MeetingResponseMapper {
    static toList(meetings: MeetingEntity[]): MeetingListItemDto[] {
        return meetings.map(meeting => new MeetingListItemDto({
            id: meeting.id || "",
            projectId: meeting.projectId,
            title: meeting.title,
            link: meeting.link,
            date: meeting.date,
            endTime: meeting.endTime,
            type: meeting.type,
            createdBy: meeting.createdBy,
            createdByName: meeting.createdByName || 'Unknown',
            status: meeting.status,
            participants: meeting.participants,
            notes: meeting.notes
        }));
    }
}
