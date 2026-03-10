import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";
import { IMeeting } from "../db/interface/meeting.interface";
import { IPersistenceMapper } from "./interface/persistence-mapper.interface";
import { Types } from "mongoose";

export class MeetingPersistenceMapper implements IPersistenceMapper<MeetingEntity, IMeeting> {
    toMongo(meeting: MeetingEntity) {
        return {
            projectId: new Types.ObjectId(meeting.projectId) as unknown as Types.ObjectId,
            title: meeting.title,
            link: meeting.link,
            date: meeting.date,
            endTime: meeting.endTime,
            type: meeting.type,
            createdBy: new Types.ObjectId(meeting.createdBy) as unknown as Types.ObjectId,
            status: meeting.status,
            participants: meeting.participants.map(p => ({
                userId: new Types.ObjectId(p.userId) as unknown as Types.ObjectId,
                joinedAt: p.joinedAt
            })) as unknown as IMeeting['participants'],
            createdAt: meeting.createdAt,
            updatedAt: meeting.updatedAt,
            notes: meeting.notes as unknown as IMeeting['notes']
        };
    }

    fromMongo(doc: IMeeting & { _id: Types.ObjectId }): MeetingEntity {
        const createdByRaw = doc.createdBy as unknown;
        let createdById: string;
        let createdByName: string | undefined;

        if (createdByRaw instanceof Types.ObjectId || typeof createdByRaw === 'string') {
            createdById = createdByRaw.toString();
        } else if (typeof createdByRaw === 'object' && createdByRaw !== null && '_id' in createdByRaw) {
            const populated = createdByRaw as { _id: Types.ObjectId; name?: string };
            createdById = populated._id.toString();
            if ('name' in populated) {
                createdByName = populated.name;
            }
        } else {
            createdById = String(createdByRaw);
        }

        return MeetingEntity.create({
            id: doc._id?.toString(),
            projectId: doc.projectId?.toString() ?? "",
            title: doc.title,
            link: doc.link ?? "",
            date: doc.date ? new Date(doc.date) : new Date(),
            endTime: doc.endTime ? new Date(doc.endTime) : new Date(),
            type: doc.type,
            createdBy: createdById,
            createdByName: createdByName,
            status: doc.status as MeetingStatus,
            participants: (doc.participants || []).map((p) => {
                const uRaw = p.userId as unknown;
                let userIdStr = "";

                if (uRaw instanceof Types.ObjectId || typeof uRaw === "string") {
                    userIdStr = uRaw.toString();
                } else if (typeof uRaw === "object" && uRaw !== null && "_id" in uRaw) {
                    userIdStr = (uRaw as { _id: Types.ObjectId })._id.toString();
                }

                return {
                    userId: userIdStr,
                    joinedAt: p.joinedAt ? new Date(p.joinedAt) : undefined
                }
            }),
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            notes: Array.isArray(doc.notes) 
                ? doc.notes.map(n => ({
                    userId: n.userId?.toString() ?? "",
                    userName: n.userName ?? "",
                    content: n.content ?? ""
                }))
                : (typeof doc.notes === 'string' ? doc.notes : [])
        });
    }
}

