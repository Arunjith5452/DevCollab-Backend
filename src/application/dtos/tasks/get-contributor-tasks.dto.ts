import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { IsIn, IsNotEmpty, IsString } from "class-validator";


export class GetContributorTasksQuery {
    @IsString()
    @IsNotEmpty()
    projectId: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsIn(["todo", "in-progress", "done"] as const)
    status: TaskStatus;

    constructor(projectId: string, userId: string, status: TaskStatus) {
        this.projectId = projectId;
        this.userId = userId;
        this.status = status;
    }
}