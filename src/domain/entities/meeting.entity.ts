import { MeetingStatus } from "../enums/meetings/meeting-status.enum";

export class MeetingEntity {
    private readonly _id?: string;
    private _projectId: string;
    private _title: string;
    private _link?: string;
    private _date: Date;
    private _endTime: Date;
    private _type: "single" | "group";
    private _createdBy: string;
    private _createdByName?: string;
    private _status: MeetingStatus;
    private _participants: Array<{ userId: string; joinedAt?: Date }>;
    private readonly _createdAt?: Date;
    private _updatedAt?: Date;

    private constructor(data: {
        id?: string;
        projectId: string;
        title: string;
        link?: string;
        date: Date;
        endTime: Date;
        type: "single" | "group";
        createdBy: string;
        createdByName?: string;
        status: MeetingStatus;
        participants?: Array<{ userId: string; joinedAt?: Date }>;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = data.id;
        this._projectId = data.projectId;
        this._title = data.title;
        this._link = data.link;
        this._date = data.date;
        this._endTime = data.endTime;
        this._type = data.type;
        this._createdBy = data.createdBy;
        this._createdByName = data.createdByName;
        this._status = data.status;
        this._participants = data.participants || [];
        this._createdAt = data.createdAt || new Date();
        this._updatedAt = data.updatedAt || new Date();
    }

    static create(data: {
        id?: string;
        projectId: string;
        title: string;
        link?: string;
        date: Date;
        endTime: Date;
        type: "single" | "group";
        createdBy: string;
        createdByName?: string;
        status: MeetingStatus;
        participants?: Array<{ userId: string; joinedAt?: Date }>;
        createdAt?: Date;
        updatedAt?: Date;
    }): MeetingEntity {
        if (!data.title?.trim()) throw new Error("Meeting title is required");
        if (!data.projectId) throw new Error("ProjectId is required");

        return new MeetingEntity({
            ...data,
            title: data.title.trim()
        });
    }

    get id(): string | undefined {
        return this._id;
    }

    get projectId(): string {
        return this._projectId;
    }

    get title(): string {
        return this._title;
    }

    get link(): string | undefined {
        return this._link;
    }

    get date(): Date {
        return this._date;
    }
    get endTime(): Date {
        return this._endTime;
    }

    get type(): "single" | "group" {
        return this._type;
    }

    get createdBy(): string {
        return this._createdBy;
    }
    get createdByName(): string | undefined {
        return this._createdByName;
    }

    get status(): MeetingStatus {
        return this._status;
    }

    get participants() {
        return this._participants;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    updateStatus(status: MeetingStatus) {
        this._status = status;
        this._updatedAt = new Date();
    }

    addParticipant(participant: { userId: string; joinedAt?: Date }) {
        this._participants.push(participant);
        this._updatedAt = new Date();
    }
}
