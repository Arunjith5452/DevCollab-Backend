import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";

export class MeetingPersistenceMapper {
    toMongo(meeting: MeetingEntity) {
        return {
            projectId: meeting.projectId,
            title: meeting.title,
            link: meeting.link,
            date: meeting.date,
            endTime: meeting.endTime,
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
            date: doc.date ? new Date(doc.date) : new Date(),
            endTime: doc.endTime ? new Date(doc.endTime) : new Date(),
            type: doc.type,
            createdBy: typeof doc.createdBy === 'object' ? doc.createdBy._id?.toString() : doc.createdBy?.toString(),
            createdByName: typeof doc.createdBy === 'object' ? doc.createdBy.name : undefined,
            status: doc.status as MeetingStatus,
            participants: (doc.participants || []).map((p: any) => ({
                userId: p.userId?.toString(),
                joinedAt: p.joinedAt ? new Date(p.joinedAt) : undefined
            })),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
}
