export class ProjectEntity {
  private readonly _id?: string;
  private _creatorId: string;
  private _title: string;
  private _description: string;
  private _githubRepo?: string;
  private _techStack: string[];
  private _difficulty: string;
  private _startDate: Date;
  private _endDate: Date;
  private _expectation?: string;
  private _visibility: string;
  private _requiredRoles: { role: string; count: string; experience: string }[];
  private _status: string;
  private readonly _createdAt: Date;
  private _updatedAt?: Date;
  private _image?: string;

  private _members: {
    userId: string;
    role: string;
    joinedAt: string;
    status: string;
  }[];

  private constructor(data: {
    creatorId: string;
    title: string;
    description: string;
    githubRepo?: string;
    techStack: string[];
    difficulty: string;
    startDate: Date;
    endDate: Date;
    expectation?: string;
    visibility: string;
    requiredRoles: { role: string; count: string; experience: string }[];
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    image?: string;
    members: {
      userId: string;
      role: string;
      joinedAt: string;
      status: string;
    }[];
    id?: string;
  }) {
    this._creatorId = data.creatorId;
    this._title = data.title;
    this._description = data.description;
    this._githubRepo = data.githubRepo;
    this._techStack = data.techStack;
    this._difficulty = data.difficulty;
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._expectation = data.expectation;
    this._visibility = data.visibility;
    this._requiredRoles = data.requiredRoles;
    this._status = data.status || "active";
    this._createdAt = data.createdAt || new Date();
    this._updatedAt = data.updatedAt;
    this._image = data.image
    this._members = data.members;
    this._id = data.id;
  }

  static create(data: {
    creatorId: string;
    title: string;
    description: string;
    githubRepo?: string;
    techStack: string[];
    difficulty: string;
    startDate: Date;
    endDate: Date;
    expectation?: string;
    visibility: string;
    requiredRoles: { role: string; count: string; experience: string }[];
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    image?: string;
    members: {
      userId: string;
      role: string;
      joinedAt: string;
      status: string;
    }[];
    id?: string;
  }): ProjectEntity {
    if (!data.title?.trim()) throw new Error("Project title is required");

    return new ProjectEntity({
      ...data,
      title: data.title.trim(),
      description: data.description?.trim() || "",
    });
  }

  get id(): string | undefined {
    return this._id;
  }
  get creatorId(): string {
    return this._creatorId;
  }
  get title(): string {
    return this._title;
  }
  get description(): string {
    return this._description;
  }
  get githubRepo(): string | undefined {
    return this._githubRepo;
  }
  get techStack(): string[] {
    return this._techStack;
  }
  get difficulty(): string {
    return this._difficulty;
  }
  get startDate(): Date {
    return this._startDate;
  }
  get endDate(): Date {
    return this._endDate;
  }
  get expectation(): string | undefined {
    return this._expectation;
  }
  get visibility(): string {
    return this._visibility;
  }
  get requiredRoles(): { role: string; count: string; experience: string }[] {
    return this._requiredRoles;
  }
  get status(): string {
    return this._status;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
  get image(): string | undefined {
    return this._image
  }
  get members() {
    return this._members;
  }

  updateProjectDetails(title?: string, description?: string) {
    if (title) this._title = title.trim();
    if (description) this._description = description.trim();
    this._updatedAt = new Date();
  }

  markAsInactive() {
    this._status = "INACTIVE";
    this._updatedAt = new Date();
  }
}
