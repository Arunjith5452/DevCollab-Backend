
export class CreateTaskResponseDTO {
    id: string;
    title: string;
    description: string;
    projectId: string;
    assignedId: string;
    status: string;
    deadline: Date;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;

    constructor(data: {
        id: string;
        title: string;
        description: string;
        projectId: string;
        assignedId: string;
        status: string;
        deadline: Date;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.projectId = data.projectId;
        this.assignedId = data.assignedId;
        this.status = data.status;
        this.deadline = data.deadline;
        this.tags = data.tags;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
