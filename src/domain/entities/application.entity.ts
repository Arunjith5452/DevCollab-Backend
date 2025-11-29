export class ApplicationEntity {
    private readonly _id?: string;
    private _userId: string;
    private _projectId: string;
    private _techStack: string[];
    private _profileUrl: string;
    private _reason: string;
    private _status: string
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    private constructor(data: {
        id?: string;
        userId: string;
        projectId: string;
        techStack: string[];
        profileUrl: string;
        reason: string;
        status?: string
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = data.id;
        this._userId = data.userId;
        this._projectId = data.projectId;
        this._techStack = data.techStack;
        this._profileUrl = data.profileUrl;
        this._reason = data.reason;
        this._status = data.status || "pending";
        this._createdAt = data.createdAt || new Date();
        this._updatedAt = data.updatedAt || new Date();
    }

    static create(data: {
        id?: string;
        userId: string;
        projectId: string;
        techStack: string[];
        profileUrl: string;
        reason: string;
        status?: string
        createdAt?: Date;
        updatedAt?: Date;
    }): ApplicationEntity {
        if (!data.userId) throw new Error("UserId is required");
        if (!data.projectId) throw new Error("ProjectId is required");
        if (!data.reason?.trim()) throw new Error("Reason is required");

        return new ApplicationEntity({
            ...data,
            reason: data.reason.trim(),
        });
    }

    get id(): string | undefined {
        return this._id;
    }
    get userId(): string {
        return this._userId;
    }
    get projectId(): string {
        return this._projectId;
    }
    get techStack(): string[] {
        return this._techStack;
    }
    get profileUrl(): string {
        return this._profileUrl;
    }
    get reason(): string {
        return this._reason;
    }
    get status(): string {
        return this._status;
    }
    get createdAt(): Date {
        return this._createdAt;
    }
    get updatedAt(): Date {
        return this._updatedAt;
    }

    updateStatus(newStatus: string) {
        this._status = newStatus;
        this._updatedAt = new Date();
    }
}
