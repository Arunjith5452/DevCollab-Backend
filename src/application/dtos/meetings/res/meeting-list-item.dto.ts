import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";

export class MeetingListItemDto {
    id: string;
    _id: string; // For frontend compatibility
    projectId: string;
    title: string;
    link: string;
    date: string;
    type: "single" | "group";
    createdBy: string;
    status: MeetingStatus;
    participants: Array<{ userId: string; joinedAt?: string }>;

    constructor(data: {
        id: string;
        projectId: string;
        title: string;
        link: string;
        date: Date;
        type: "single" | "group";
        createdBy: string;
        status: MeetingStatus;
        participants: Array<{ userId: string; joinedAt?: Date }>;
    }) {
        this.id = data.id;
        this._id = data.id;
        this.projectId = data.projectId;
        this.title = data.title;
        this.link = data.link;
        this.date = data.date.toISOString();
        this.type = data.type;
        this.createdBy = data.createdBy;
        this.status = data.status;
        this.participants = data.participants.map(p => ({
            userId: p.userId,
            joinedAt: p.joinedAt?.toISOString()
        }));
    }
}
