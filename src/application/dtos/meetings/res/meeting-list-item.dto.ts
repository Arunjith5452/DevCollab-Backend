import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";

export class MeetingListItemDto {
    id: string;
    _id: string;
    projectId: string;
    title: string;
    link?: string;
    date: string;
    endTime: string;
    type: "single" | "group";
    createdBy: string;
    createdByName: string;
    status: MeetingStatus;
    participants: Array<{ userId: string; joinedAt?: string }>;

    constructor(data: {
        id: string;
        projectId: string;
        title: string;
        link?: string;
        date: Date;
        endTime: Date;
        type: "single" | "group";
        createdBy: string;
        createdByName: string;
        status: MeetingStatus;
        participants: Array<{ userId: string; joinedAt?: Date }>;
    }) {
        this.id = data.id;
        this._id = data.id;
        this.projectId = data.projectId;
        this.title = data.title;
        this.link = data.link;
        this.date = data.date?.toISOString() || new Date().toISOString();
        this.endTime = data.endTime?.toISOString() || new Date().toISOString();
        this.type = data.type;
        this.createdBy = data.createdBy;
        this.createdByName = data.createdByName;
        this.status = data.status;
        this.participants = (data.participants || []).map(p => ({
            userId: p.userId,
            joinedAt: p.joinedAt?.toISOString()
        }));
    }
}
