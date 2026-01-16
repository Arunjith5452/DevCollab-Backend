import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";

export class MeetingPersistenceMapper {
    toMongo(meeting: MeetingEntity) {
        return {
            projectId: meeting.projectId,
            title: meeting.title,
            link: meeting.link,
            date: meeting.date,
            type: meeting.type,
            createdBy: meeting.createdBy,
            status: meeting.status,
            participants: meeting.participants,
            createdAt: meeting.createdAt,
            updatedAt: meeting.updatedAt
        };
    }

    fromMongo(doc: any): MeetingEntity {
        return MeetingEntity.create({
            id: doc._id?.toString(),
            projectId: doc.projectId?.toString(),
            title: doc.title,
            link: doc.link,
            date: doc.date,
            type: doc.type,
            createdBy: doc.createdBy?.toString(),
            status: doc.status as MeetingStatus,
            participants: doc.participants,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
}
