export class TaskEntity {
    private readonly _id?: string;
    private _title: string;
    private _projectId: string;
    private _assignedId: string;
    private _description: string;
    private _prLink?: string;
    private _feedBack?: string;
    private _status: string;
    private _deadline: Date;
    private _comments: Array<{
        createdAt: Date;
        message: string;
        userId: string;
    }> = [];
    private _tags: string[];
    private _acceptanceCriteria: Array<{
        text: string;
        completed: boolean;
    }>
    private _payment: {
        advancePaid: number;
        amount: number;
    };
    private _documents?: string[];
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    private constructor(data: {
        id?: string;
        title: string;
        projectId: string;
        assignedId: string;
        description: string;
        prLink?: string;
        feedBack?: string;
        status: string;
        deadline: Date;
        comments?: Array<{ createdAt: Date; message: string; userId: string }>;
        tags: string[];
        acceptanceCriteria: Array<{ text: string; completed: boolean }>
        payment?: { advancePaid: number; amount: number };
        documents?: string[];
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this._id = data.id;
        this._title = data.title;
        this._projectId = data.projectId;
        this._assignedId = data.assignedId
        this._description = data.description;
        this._prLink = data.prLink;
        this._feedBack = data.feedBack;
        this._status = data.status || "todo";
        this._deadline = data.deadline;
        this._comments = data.comments || [];
        this._tags = data.tags || [];
        this._acceptanceCriteria = data.acceptanceCriteria || [];
        this._payment = data.payment || { advancePaid: 0, amount: 0 };
        this._documents = data.documents || [];
        this._createdAt = data.createdAt || new Date();
        this._updatedAt = data.updatedAt || new Date();
    }

    static create(data: {
        id?: string;
        title: string;
        projectId: string;
        assignedId: string
        description: string;
        prLink?: string;
        feedBack?: string;
        status: string;
        deadline: Date;
        comments?: Array<{ createdAt: Date; message: string; userId: string }>;
        tags: string[];
        acceptanceCriteria: Array<{ text: string; completed: boolean }>;
        payment?: { advancePaid: number; amount: number };
        documents?: string[];
        createdAt?: Date;
        updatedAt?: Date;
    }): TaskEntity {
        if (!data.title?.trim()) throw new Error("Task title is required");
        if (!data.projectId) throw new Error("ProjectId is required");

        return new TaskEntity({
            id: data.id,
            title: data.title.trim(),
            projectId: data.projectId,
            assignedId: data.assignedId,
            description: data.description,
            prLink: data.prLink,
            feedBack: data.feedBack,
            status: data.status,
            deadline: data.deadline,
            comments: data.comments,
            tags: data.tags,
            acceptanceCriteria: data.acceptanceCriteria,
            payment: data.payment,
            documents: data.documents,
        });
    }

    get id(): string | undefined {
        return this._id;
    }
    get title(): string {
        return this._title;
    }
    get projectId(): string {
        return this._projectId;
    }
    get assignedId(): string  {
        return this._assignedId;
    }
    get description(): string {
        return this._description;
    }
    get prLink(): string | undefined {
        return this._prLink;
    }
    get feedBack(): string | undefined {
        return this._feedBack;
    }
    get status(): string {
        return this._status;
    }
    get deadline(): Date {
        return this._deadline;
    }
    get comments() {
        return this._comments;
    }
    get tags() {
        return this._tags;
    }
    get acceptanceCriteria() {
        return this._acceptanceCriteria;
    }
    get payment() {
        return this._payment;
    }
    get documents(): string[] | undefined {
        return this._documents;
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

    addComment(comment: { message: string; userId: string }) {
        this._comments.push({ ...comment, createdAt: new Date() });
        this._updatedAt = new Date();
    }

    updateFeedback(newFeedback: string) {
        this._feedBack = newFeedback;
        this._updatedAt = new Date();
    }

    updatePayment(amount: number, advancePaid: number) {
        this._payment = { amount, advancePaid };
        this._updatedAt = new Date();
    }

    markCriteriaAsCompleted(index: number) {
        if (this._acceptanceCriteria[index]) {
            this._acceptanceCriteria[index].completed = true;
            this._updatedAt = new Date();
        }
    }
}
